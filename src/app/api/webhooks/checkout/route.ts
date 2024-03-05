import { type StripeSubscriptionStatus } from "@prisma/client";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "~/env";
import { sendSubscriptionConfirmation, sendSubscriptionError } from "~/lib/resend";
import { db } from "~/server/db";

const stripe = require("stripe")(process.env.STRIPE_PRIVATE);

const secret = env.STRIPE_WEBHOOK_SECRET_KEY || "";

const getStripeSubscription = async (userId: string) => {
    return db.stripeSubscription.findFirst({
        where: {
            userId,
        },
    });
}

const updateStripeSubscription = async (userId: string, event: any, status: StripeSubscriptionStatus = "ACTIVE") => {
    const subscriptionId = event.data.object.subscription ?? undefined;
    const subscription = await getStripeSubscription(userId);
    if (!subscription) {
        throw new Error(`missing subscription for user, ${userId}`);
    }
    return await db.stripeSubscription.update({
        where: {
            userId,
        },
        data: {
            subscriptionId: subscriptionId,
            status: status,
        },
    });
}

export async function POST(req: Request) {
    try {
        const signature = headers().get("stripe-signature") as string;
        const body = await req.text();

        const event = stripe.webhooks.constructEvent(body, signature, secret);

        let subscription = null;
        const { user_id } = event.data.object.metadata;

        if (!event.data.object.customer_details.email) {
            throw new Error(`missing user email, ${event.id}`);
        }

        if (!event.data.object.metadata.user_id) {
            throw new Error(`missing user_id on metadata, ${event.id}`);
        }

        // send email to user
        const user = await db.user.findFirst({
            where: {
                id: user_id,
            },
        });

        if (!user) {
            throw new Error(`missing user, ${user_id}`);
        }

        switch (event.type) {
            case "checkout.session.completed":
                subscription = await updateStripeSubscription(user_id, event);
                sendSubscriptionConfirmation(user.email);
                break;
            case "checkout.session.async_payment_failed":
                subscription = await updateStripeSubscription(user_id, event, "PAYMENT_FAILED");
                sendSubscriptionError(user.email);
                break;
            case "checkout.session.async_payment_succeeded":
                console.log(event);
                break;
            case "checkout.session.expired":
                subscription = await updateStripeSubscription(user_id, event, "INCOMPLETE_EXPIRED");
                sendSubscriptionError(user.email);
                break;
            default:
                subscription = await updateStripeSubscription(user_id, event, "PAYMENT_FAILED");
                sendSubscriptionError(user.email);
                break;
        }

        return NextResponse.json({ result: subscription, ok: true });
    } catch (error) {

        console.error(error);
        return NextResponse.json(
            {
                message: "something went wrong",
                ok: false,
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({ ok: true });
}
import { type StripeSubscriptionStatus } from "@prisma/client";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "~/env";
import { sendSubscriptionConfirmation } from "~/lib/resend";
import { db } from "~/server/db";

const stripe = require("stripe")(process.env.STRIPE_PRIVATE);

const secret = env.STRIPE_SECRET_KEY || "";

const getStripeSubscription = async (userId: string) => {
    const subscription = await db.stripeSubscription.findFirst({
        where: {
            userId,
        },
    });

    return subscription;
}

const updateStripeSubscription = async (userId: string, status: StripeSubscriptionStatus = "ACTIVE") => {
    return await db.stripeSubscription.update({
        where: {
            userId,
        },
        data: {
            status: status,
        },
    });
}

export async function POST(req: Request) {
    try {
        const body = await req.text();

        const signature = headers().get("stripe-signature");

        const event = stripe.webhooks.constructEvent(body, signature, secret);

        let subscription = null;

        if (event.type === "checkout.session.completed") {
            if (!event.data.object.customer_details.email) {
                throw new Error(`missing user email, ${event.id}`);
            }

            if (!event.data.object.metadata.user_id) {
                throw new Error(`missing user_id on metadata, ${event.id}`);
            }

            const { user_id } = event.data.object.metadata;
            subscription = await getStripeSubscription(user_id);
            if (!subscription) {
                throw new Error(`missing subscription for user, ${user_id}`);
            }
            subscription = await updateStripeSubscription(user_id);

            // send email to user
            sendSubscriptionConfirmation(event.data.object.customer_details.email);
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
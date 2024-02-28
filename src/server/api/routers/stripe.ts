import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { stripe } from "~/lib/stripe";
import { TRPCError } from "@trpc/server";
import Stripe from "stripe";

const checkoutSchema = z.object({
    plan: z.string(),
    plan_name: z.string(),
    plan_frequency: z.string(),
    customerId: z.string().optional(),
    customerEmail: z.string().optional(),
});

const subscriptionSchema = z.object({
    sessionId: z.string(),
});

export type CheckoutStripeDTO = z.infer<typeof checkoutSchema>;
export type SubscriptionStripeDTO = z.infer<typeof subscriptionSchema>;

const cancelSubscription = async (ctx: any, subscriptionId: string) => {
    await stripe.subscriptions.update(
        subscriptionId,
        {
            cancel_at_period_end: true,
        }
    );

    return await ctx.db.stripeSubscription.update({
        where: {
            userId: ctx.session.user.id,
        },
        data: {
            status: "CANCELLED",
        },
    });
}

const retrieveSubscription = async (subscriptionId: string) => {
    return await stripe.subscriptions.retrieve(subscriptionId);
}

const updateStripeSubscription = async (subscriptionId: string, productId: string) => {
    return await stripe.subscriptions.update(
        subscriptionId,
        {
            items: [
                {
                    id: productId,
                },
            ],
        }
    );
}

const getSubscriptionFromDB = async (ctx: any) => {
    const dbSubscription = await ctx.db.stripeSubscription.findFirst({
        where: {
            userId: ctx.session.user.id,
        },
    });

    return dbSubscription;
}

const isSameSubscription = (dbSubscription: any, input: CheckoutStripeDTO) => {
    if (!dbSubscription) return false;
    if (dbSubscription.plan !== input.plan_name) return false;
    if (dbSubscription.frequency !== input.plan_frequency) return false;
    if (dbSubscription.stripeProductId !== input.plan) return false;
    return true;
}

const createSubscription = async (ctx: any, session: Stripe.Checkout.Session, input: CheckoutStripeDTO, status: string = "INCOMPLETE") => {
    // create subscription in the database
    await ctx.db.stripeSubscription.create({
        data: {
            userId: session.metadata!.user_id,
            customerId: session.customer as string,
            subscriptionId: session.subscription as string ?? undefined,
            status: status,
            plan: input.plan_name,
            frequency: input.plan_frequency,
            stripeProductId: input.plan
        },
    });
}

const updateSubscription = async (ctx: any, session: Stripe.Checkout.Session, input: CheckoutStripeDTO, updatedSubscription: Stripe.Subscription, status: string = "INCOMPLETE") => {
    // update subscription in the database
    await ctx.db.stripeSubscription.update({
        where: {
            userId: session.metadata!.user_id,
        },
        data: {
            customerId: session.customer as string,
            subscriptionId: updatedSubscription.id as string ?? undefined,
            status: status,
            plan: input.plan_name,
            frequency: input.plan_frequency,
            stripeProductId: input.plan
        },
    });
}


const updateOrCreateSubscription = async (ctx: any, session: Stripe.Checkout.Session, input: CheckoutStripeDTO) => {
    if (!session.metadata) throw new TRPCError({ code: "BAD_REQUEST" });

    let dbSubscription = await getSubscriptionFromDB(ctx);

    if (isSameSubscription(dbSubscription, input)) throw new TRPCError({ code: "FORBIDDEN" });

    if (!dbSubscription) {
        // create subscription in the database
        await createSubscription(ctx, session, input);
    } else {
        // We update the current plan onto Stripe
        if (dbSubscription.subscriptionId) {
            dbSubscription = await updateStripeSubscription(dbSubscription.subscriptionId, input.plan);
            // update subscription in the database
            await updateSubscription(ctx, session, input, dbSubscription);
        }
    }
    return dbSubscription;
}

const createSession = async (ctx: any, input: CheckoutStripeDTO) => {
    const { req, session } = ctx;
    const userEmail = session?.user?.email ?? input.customerEmail;
    const origin = req.headers.origin || "http://localhost:3000";

    // if user is logged in, redirect to thank you page, otherwise redirect to signup page.
    const success_url = `${origin}/thankyou?session_id={CHECKOUT_SESSION_ID}&user_id=${input.customerId}`;

    return await stripe.checkout.sessions.create({
        customer_email: userEmail,
        mode: "subscription",
        line_items: [
            {
                price: input.plan,
                quantity: 1,
            },
        ],
        metadata: {
            user_id: input.customerId as string,
        },
        success_url: success_url,
        cancel_url: `${origin}/pricing?session_id={CHECKOUT_SESSION_ID}`,
    });
}


export const stripeRouter = createTRPCRouter({
    createSession: protectedProcedure
        .input(checkoutSchema)
        .mutation(async ({ ctx, input }) => {
            console.log("session");
            try {
                const session = await createSession(ctx, input);
                updateOrCreateSubscription(ctx, session, input);
                return { session };
            } catch (error) {
                if (error instanceof Stripe.errors.StripeError) {
                    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", cause: error });
                }
            }
        }),
    validateSubscription: protectedProcedure
        .input(subscriptionSchema)
        .mutation(async ({ ctx, input }) => {
            const { session } = ctx;
            const { sessionId } = input;

            if (!session?.user) {
                throw new TRPCError({ code: "UNAUTHORIZED" });
            }

            const dbUser = await ctx.db.user.findFirst({
                where: {
                    id: session.user.id,
                },
            });

            if (!dbUser) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }

            try {
                const session = await retrieveSubscription(sessionId);
                const validStatuses = ["trialing", "active"];
                return validStatuses.includes(session.status);
            } catch (error) {
                if (error instanceof Stripe.errors.StripeError) {
                    const { message } = error;
                    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", cause: message });
                }
            }
        }),
    cancelSubscription: protectedProcedure
        .mutation(async ({ ctx }) => {
            const { session } = ctx;
            const user = session?.user;

            if (!user) {
                throw new TRPCError({ code: "UNAUTHORIZED" });
            }

            const dbSubscription = await ctx.db.stripeSubscription.findFirst({
                where: {
                    userId: user.id,
                },
            });

            if (!dbSubscription) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }

            if (!dbSubscription.subscriptionId) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }

            return await cancelSubscription(ctx, dbSubscription.subscriptionId);
        }),

    getSubscription: publicProcedure
        .query(async ({ ctx }) => {
            const { session } = ctx;
            const user = session?.user;

            if (!user) {
                throw new TRPCError({ code: "UNAUTHORIZED" });
            }

            const dbSubscription = await ctx.db.stripeSubscription.findFirst({
                where: {
                    userId: user.id,
                },
            });

            if (!dbSubscription) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }

            return dbSubscription;
        })
});


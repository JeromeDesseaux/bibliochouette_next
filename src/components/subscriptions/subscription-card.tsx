"use client";

import { loadStripe } from "@stripe/stripe-js";
import Stripe from "stripe";
import { env } from "~/env";
import { type CheckoutStripeDTO } from "~/server/api/routers/stripe";
// import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/react";

const subscriptionPlans = [
    {
        name: "Premium Solo",
        plans: [
            {
                name: "Mensuel",
                amount: 3,
                stripeId: "price_1NwhUWJCgrBn1Kjud1JMJSfk",
            },
            {
                name: "Annuel",
                amount: 30,
                stripeId: "price_1NwhnhJCgrBn1KjukvkceyF9",
            },
        ],
    }
]


const SubscriptionCard = () => {
    const stripeAPI = api.stripe.createSession.useMutation();

    const handleClick = async () => {
        // const session = await getServerAuthSession();
        // step 1: load stripe
        const STRIPE_PK = env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
        const stripe = await loadStripe(STRIPE_PK!);

        // step 2: define the data for monthly subscription
        const body: CheckoutStripeDTO = {
            plan: subscriptionPlans[0]!.plans[0]!.stripeId,
            plan_name: subscriptionPlans[0]!.name,
            plan_frequency: subscriptionPlans[0]!.plans[0]!.name,
        };
        // step 3: make a post fetch api call to /checkout-session handler
        const result = await stripeAPI.mutateAsync(body);
        console.log(result);

        // step 4: get the data and redirect to checkout using the sessionId
        const session = result as Stripe.Checkout.Session;
        stripe?.redirectToCheckout({ sessionId: session.id });
    };
    // render a simple card
    return (
        <div className="border border-gray-100 rounded-md p-8 flex flex-col gap-2 items-start">
            <h2 className="text-xl font-bold text-gray-700">Monthly Subscription</h2>
            <p className="text-gray-400">$20 per month</p>
            <button
                onClick={() => handleClick()}
                className="border border-violet-200 text-violet-500 rounded-md px-4 py-2 w-full hover:bg-violet-500 hover:text-violet-200 transition-colors"
            >
                Subscribe
            </button>
        </div>
    );
};
export default SubscriptionCard;
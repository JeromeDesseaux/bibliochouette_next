"use client";

import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import type Stripe from "stripe";
import { env } from "~/env";
import { type CheckoutStripeDTO } from "~/server/api/routers/stripe";
// import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/react";

const subscriptionPlans = [
    {
        name: "Premium Solo",
        frequency: "Mensuel",
        amount: 3,
        stripeId: "price_1NwhUWJCgrBn1Kjud1JMJSfk",
    },
    {
        name: "Premium Solo",
        frequency: "Annuel",
        amount: 30,
        stripeId: "price_1NwhnhJCgrBn1KjukvkceyF9",
    },
]

type SubscriptionCardProps = {
    planTitle: string;
    planDescription: string;
    planPrice: string;
    cb: () => void;
    disabled?: boolean;
}

const SubscriptionCard = ({ planTitle, planDescription, planPrice, cb, disabled }: SubscriptionCardProps) => {
    // render a simple card
    return (
        <div className="border border-gray-100 rounded-md p-8 flex flex-col gap-2 items-start">
            <h2 className="text-xl font-bold text-gray-700">{planTitle}</h2>
            <p className="text-gray-400">{planDescription}</p>
            <button
                disabled={disabled}
                onClick={() => cb()}
                className="border border-violet-200 text-violet-500 rounded-md px-4 py-2 w-full hover:bg-violet-500 hover:text-violet-200 transition-colors"
            >
                {planPrice}
            </button>
        </div>
    );
};


type SubscriptionHeroProps = {
    session: any;
}

const SubscriptionHero = ({ session }: SubscriptionHeroProps) => {
    const stripeAPI = api.stripe.createSession.useMutation();
    const isAuthenticated = session?.user;
    const router = useRouter()

    const handleClick = async (plan: string, name: string, frequency: string) => {
        // if the user is not authenticated, redirect to login
        if (!isAuthenticated) {
            return router.push("/authentication/login");
        }

        // const session = await getServerAuthSession();
        // step 1: load stripe
        const STRIPE_PK = env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
        const stripe = await loadStripe(STRIPE_PK!);

        // step 2: define the data for monthly subscription
        const body: CheckoutStripeDTO = {
            plan: plan,
            plan_name: name,
            plan_frequency: frequency,
        };
        // step 3: make a post fetch api call to /checkout-session handler
        const result = await stripeAPI.mutateAsync(body);

        // step 4: get the data and redirect to checkout using the sessionId
        const session = result as Stripe.Checkout.Session;
        stripe?.redirectToCheckout({ sessionId: session.id });
    };


    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-4xl font-bold text-gray-700">Abonnez-vous à Bibliochouette</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {
                    subscriptionPlans.map((plan, index) => {
                        return (
                            <SubscriptionCard
                                key={index}
                                planTitle={`${plan.name}`}
                                planDescription={`Abonnement ${plan.frequency}`}
                                planPrice={`${plan.amount}€/mois`}
                                cb={() => handleClick(
                                    plan.stripeId,
                                    plan.name,
                                    plan.frequency
                                )}
                            />
                        )
                    })
                }
            </div>

        </div>
    );
}

export {
    SubscriptionHero,
    SubscriptionCard
}
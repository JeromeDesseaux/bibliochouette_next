import { SubscriptionHero } from "~/components/subscriptions/subscription-card";
import { type ReactNode } from "react";
import { getServerAuthSession } from "~/server/auth";

const PricingWrapper = ({ children }: { children: ReactNode }) => {
    return (
        <div className="flex justify-center items-center grow-1 flex-1" style={{ "backgroundColor": "#f5f5f5" }}>
            {children}
        </div>
    )
}

const Pricing = async () => {
    const session = await getServerAuthSession();
    return (
        <PricingWrapper>
            <SubscriptionHero session={session} />
        </PricingWrapper>
    );
}


export default Pricing;

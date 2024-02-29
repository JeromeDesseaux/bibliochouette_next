import SubscriptionCard from "~/components/subscriptions/subscription-card";
import { type ReactNode } from "react";

const PricingWrapper = ({ children }: { children: ReactNode }) => {
    return (
        <div className="flex justify-center items-center grow-1 flex-1" style={{ "backgroundColor": "#f5f5f5" }}>
            {children}
        </div>
    )
}

const Pricing = async () => {
    return (
        <PricingWrapper>
            <SubscriptionCard />
        </PricingWrapper>
    );
}


export default Pricing;

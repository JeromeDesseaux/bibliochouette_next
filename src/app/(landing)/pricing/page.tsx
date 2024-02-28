import SubscriptionCard from "~/components/subscriptions/subscription-card";
import { type ReactNode } from "react";
import { getServerSession } from "next-auth";

const PricingWrapper = ({ children }: { children: ReactNode }) => {
    return (
        <div className="flex justify-center items-center grow-1 flex-1" style={{ "backgroundColor": "#f5f5f5" }}>
            {children}
        </div>
    )
}

const Pricing = async () => {
    const session = await getServerSession();
    return (
        <PricingWrapper>
            <SubscriptionCard userEmail={session?.user.email!} userId={session?.user.id!} />
        </PricingWrapper>
    );
}


export default Pricing;

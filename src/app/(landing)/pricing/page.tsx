import styled from "styled-components";
import SubscriptionCard from "~/components/subscriptions/subscription-card";

const PricingWrapper = styled.div`
  background-color: #f5f5f5;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  display: flex;
  flex: 1;
`;

const Pricing = () => {
    return (
        <PricingWrapper>
            <SubscriptionCard />
        </PricingWrapper>
    );
}


export default Pricing;

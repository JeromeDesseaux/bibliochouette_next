import { type ReactNode } from "react";
import { LandingWrapper } from "~/components/landing/wrappers";
import NavigationBar from "~/components/navigation-menu";


const LandingLayout = ({ children }: { children: ReactNode }) => {
    return (
        <LandingWrapper>
            <NavigationBar />
            {children}
        </LandingWrapper>
    );
}

export default LandingLayout;
import { type ReactNode } from "react";
import { LandingWrapper } from "~/components/landing/wrappers";
import NavigationBar from "~/components/navigation-menu";
import { getServerAuthSession } from "~/server/auth";


const LandingLayout = async ({ children }: { children: ReactNode }) => {
    const session = await getServerAuthSession();
    return (
        <LandingWrapper>
            <NavigationBar session={session} />
            {children}
        </LandingWrapper>
    );
}

export default LandingLayout;
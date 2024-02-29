import Link from "next/link";
import React from "react";
import { getServerAuthSession } from "~/server/auth";
import { LinkWrapper, LogoContainer, NavigationMenu } from "./navigation";


const NavLink = ({ children, href }: { children: React.ReactNode, href: string }) => {
    return (
        <Link href={href} className="hover:underline">
            {children}
        </Link>
    )
}

const NavigationBar = async () => {
    const session = await getServerAuthSession();

    return (
        <NavigationMenu>
            <LogoContainer>
                Logo
            </LogoContainer>
            <LinkWrapper>
                <NavLink href="/pricing">Tarifs</NavLink>
                <NavLink href="/about">A propos</NavLink>
                <NavLink href="mailto:contact@bibliochouette.fr">Contact</NavLink>
            </LinkWrapper>
            <div>
                {session ? (
                    <NavLink href="/dashboard">Dashboard</NavLink>
                ) : (
                    <NavLink href="/authentication/login">Connexion</NavLink>
                )}
            </div>
        </NavigationMenu>
    );
}

export default NavigationBar;
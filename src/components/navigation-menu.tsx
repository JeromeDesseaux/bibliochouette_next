"use client";

import Link from "next/link";
import React from "react";
import { LinkWrapper, LogoContainer, NavigationMenu } from "./navigation";
import Image from 'next/image'
import { useRouter } from "next/navigation";


const NavLink = ({ children, href }: { children: React.ReactNode, href: string }) => {
    return (
        <Link href={href} className="hover:underline">
            {children}
        </Link>
    )
}

type NavigationBarProps = {
    session: any;
}

const NavigationBar = ({ session }: NavigationBarProps) => {
    const router = useRouter();
    return (
        <NavigationMenu>
            <LogoContainer>
                <Image
                    src="/logo.webp"
                    width={64}
                    height={64}
                    alt="Logo de Bibliochouette qui représente le dessin d'une chouette sur un livre"
                    onClick={() => router.push('/')}
                />
            </LogoContainer>
            <LinkWrapper>
                <NavLink href="/pricing">Tarifs</NavLink>
                <NavLink href="/about">A propos</NavLink>
                <NavLink href="mailto:contact@bibliochouette.fr">Contact</NavLink>
            </LinkWrapper>
            <div className="pr-5">
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
// These styles apply to every route in the application
import '~/styles/globals.css'
import { type ReactNode } from "react";
import React from "react";
import { ThemeProvider } from "~/components/providers/theme-provider";
import { TRPCReactProvider } from "~/trpc/react";


export const metadata = {
    title: "Bibliochouette",
    description: "Generated by create-t3-app",
};

type ClientLayoutProps = {
    children: ReactNode;
};

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <TRPCReactProvider>{children}</TRPCReactProvider>
        </ThemeProvider>
    );
};


const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="en" suppressHydrationWarning={true}>
            <body >
                <ClientLayout>
                    {children}
                </ClientLayout>
            </body>
        </html>
    )
}

export default RootLayout;
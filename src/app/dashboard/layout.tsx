import React, { type ReactNode } from 'react';


const DashboardWrapper = ({ children }: { children: ReactNode }) => {
    return (
        <div className='flex flex-row min-h-screen'>
            {children}
        </div>
    )
}

const ContentWrapper = ({ children }: { children: ReactNode }) => {
    return (
        <div className='flex flex-grow flex-col p-20'>
            {children}
        </div>
    )
}


const Sidebar = ({ children }: { children: ReactNode }) => {
    return (
        <div className='flex flex-col items-center justify-center bg-gray-100 min-h-screen w-72 p-20'>
            {children}
        </div>
    )
}


export const metadata = {
    title: "Dashboard - Bibliochouette",
    description: "Dashboard général de gestion d'ouvrages et de prêts pour Bibliochouette",
};


export default function MainLayout({ children }: { children: ReactNode }) {
    return (<DashboardWrapper>
        <Sidebar>
            Sidebar
        </Sidebar>
        <ContentWrapper>
            {children}
        </ContentWrapper>
    </DashboardWrapper>);
}

"use client";

import React, { type ReactNode } from 'react';
import Image from "next/image"

interface ColumnProps {
    children: ReactNode;
    hiddenOnMobile?: boolean;
}

const Column = ({ children, hiddenOnMobile }: ColumnProps) => {
    const hiddenOnMobileClass = hiddenOnMobile ? 'hidden md:block' : '';

    return (
        // <div className='relative hidden lg:block h-screen md:flex w-1/2'>
        <div className={`relative h-screen flex lg:w-1/2 sm:px-3 justify-center items-center ${hiddenOnMobileClass}`}>
            {children}
        </div>
    )
}

const Wrapper = ({ children }: { children: ReactNode }) => {
    return (
        <div className='flex flex-row height-full width-full flex-wrap'>
            {children}
        </div>
    )
}

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <Wrapper>
            <Column hiddenOnMobile>
                <Image
                    src="/library.jpeg"
                    alt="Authentication"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 90vw"
                    style={{ objectFit: 'cover' }} />
            </Column>
            <Column>
                <div className='md:w-96'>
                    {children}
                </div>
            </Column>
        </Wrapper>
    );
}

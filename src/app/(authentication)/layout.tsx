import React, { useEffect, type ReactNode } from 'react';
import Image from "next/image"
import styled from 'styled-components'
import { useRouter } from 'next/navigation';
import { getServerAuthSession } from "~/server/auth";


const Column = styled.div`
    padding: 10px;
    flex-direction: column;
    flex-basis: 100%;
    flex: 1;
    height: 100vh;
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    height: 100vh;
    flex-wrap: wrap;
`;

export default async function AuthLayout({ children }: { children: ReactNode }) {
    const session = await getServerAuthSession();
    const router = useRouter();

    useEffect(() => {
        if (!session) return;
        if (session.user) {
            router.push('/');
        }
    }, [session]);

    return (
        <Wrapper>
            <Column className='relative hidden lg:block h-screen md:flex w-1/2'>
                <Image
                    src="/library.jpeg"
                    alt="Authentication"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 90vw"
                    style={{ objectFit: 'cover' }} />
            </Column>
            <Column className='flex justify-center items-center'>
                <div className='md:w-96 sm:w-100'>
                    {children}
                </div>
            </Column>
        </Wrapper>
    );
}

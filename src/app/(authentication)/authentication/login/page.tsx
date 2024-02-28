"use client"

import { signIn } from 'next-auth/react';
import GoogleOAuthButton from '~/components/auth/googleLogin';
import { type z } from 'zod';
import Link from 'next/link';
import EmailForm from '~/components/forms/email-form';
import type emailFormSchema from '~/common/forms/email-form';

const Login = () => {
    const handleSubmitEmail = async (values: z.infer<typeof emailFormSchema>) => {
        const { email } = values;
        try {
            await signIn('email', {
                email: email,
                callbackUrl: "/",
                redirect: true,
            });
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <h1 className="text-2xl font-semibold tracking-tight">
                Se connecter
            </h1>
            <p className="text-sm text-muted-foreground my-4">
                Entrez votre email et mot de passe ci-dessous pour vous connecter. Pas encore de compte ? <Link href="/auth/register" className='underline'>Créer un compte</Link>
            </p>
            <EmailForm onSubmit={handleSubmitEmail} submitLabel='Continuer par email' />
            {/* <LoginForm onSubmit={handleSubmit} submitLabel='Se connecter' /> */}
            <hr />
            <div className='flex flex-col'>
                <p className='my-4 text-sm text-muted-foreground'>Ou bien utiliser vos comptes existants</p>
                <GoogleOAuthButton className='w-100'>
                    Continuer avec Google
                </GoogleOAuthButton>
            </div>
        </div>
    );
};


export default Login;

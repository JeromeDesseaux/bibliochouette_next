import * as React from 'react';

interface VerifyEmailProps {
    token: string;
}

type EmailLoginProps = {
    url: string
};

export const VerifyEmail: React.FC<Readonly<VerifyEmailProps>> = ({
    token,
}) => (
    <div>
        <h1>Welcome!</h1>
        <p>Please verify your email by clicking the link below:</p>
        <a href={`http://localhost:3000/account/verify?token=${token}`}>Verify Email</a>
    </div>
);

export const EmailLogin: React.FC<EmailLoginProps> = ({ url }) => (
    <div>
        <h1>Welcome!</h1>
        <p>Please verify your email by clicking the link below:</p>
        <a href={url}>Verify Email</a>
    </div>
);
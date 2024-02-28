import { signIn } from 'next-auth/react';
import { Button } from '../ui/button';

type GoogleOAuthButtonProps = {
    className?: string;
    children?: React.ReactNode;
};

const GoogleOAuthButton: React.FC<GoogleOAuthButtonProps> = ({ className, children }) => {
    const handleSignIn = () => {
        signIn('google', { callbackUrl: '/' }).then((response) => {
            console.log('response', response);
        }).catch((error) => {
            console.error('error', error);
        });
    };

    return (
        <Button onClick={handleSignIn} variant="outline" className={className}>
            {children ? children : 'Se connecter avec Google'}
        </Button>
    );
};

export default GoogleOAuthButton;

import { Resend } from "resend";
import { VerifyEmail } from "~/components/emails/verifyEmail";

const emailClient = new Resend(process.env.RESEND_API_KEY);

interface VerifyEmailProps {
    to: string[];
    subject: string;
    token: string;
}

const sendVerificationEmail = async (params: VerifyEmailProps) => {
    try {
        await emailClient.emails.send({
            from: "Bibliochouette <nepasrepondre@bibliochouette.fr>",
            to: params.to,
            subject: params.subject,
            react: VerifyEmail({ token: params.token }),
            text: `Welcome to Bibliochouette! Please verify your email by clicking the link below:\n\nhttp://localhost:3000/account/verify/${params.token}`,
        });
    } catch (error) {
        console.error(error);
    }
}


export { emailClient, sendVerificationEmail };
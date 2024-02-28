import { type SendVerificationRequestParams } from 'next-auth/providers/email';
import { Resend } from 'resend';
import { EmailLogin } from '~/components/emails/verifyEmail';
import { env } from '~/env';

export const resend = new Resend(env.RESEND_API_KEY);

export const addContact = async (email: string) => {
    const response = await resend.contacts.create({
        email: email,
        unsubscribed: false,
        audienceId: env.RESEND_EMAILING_ID,
    });
    console.log(response)
    if (response.data) {
        return response.data.id;
    }
    if (response.error)
        throw new Error("Error adding contact" + response.error);
}

export const sendVerificationRequest = async (params: SendVerificationRequestParams) => {
    const { identifier, provider, url } = params


    const { error } = await resend.emails.send(
        {
            to: identifier,
            from: provider.from,
            subject: "Bienvenue sur Bibliochouette !",
            react: EmailLogin({ url }),
            text: `Bienvenue sur Bibliochouette !\n\nPour vous connecter, cliquez sur le lien suivant : ${url}`,
        },
    )
    if (error) {
        throw new Error("error sending email")
    }
}

export const sendSubscriptionConfirmation = async (email: string) => {
    const response = await resend.emails.send(
        {
            to: email,
            from: env.EMAIL_FROM,
            subject: "Confirmation d'abonnement",
            text: "Vous êtes maintenant abonné à Bibliochouette !",
        },
    )
    if (response.error)
        throw new Error("Error sending subscription confirmation" + response.error);
}
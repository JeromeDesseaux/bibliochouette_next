/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";

const Registered = () => {
    return (
        <div>
            <h1 className="text-2xl font-semibold tracking-tight">
                Bienvenue sur Bibliochouette !
            </h1>
            <p className="text-sm text-muted-foreground my-4">
                Un email vous a été envoyé. Merci de cliquer sur le lien fournit pour valider votre adresse mail.
                Entrez votre email et mot de passe ci-dessous pour vous connecter. Pas encore de compte ? <Link href="/auth/register" className='underline'>Créer un compte</Link>
            </p>
            <p className="text-sm text-muted-foreground my-4">
                Vous n'avez pas reçu l'email ? Vérifiez vos spams, l'adresse mail saisie est-elle correcte ? <Link href="/auth/login" className='underline'>Renvoyer l'email</Link>
                Sinon, contactez le support <Link href="mailto:contact@bibliochouette.fr" className='underline'>Envoyer un mail au support</Link>
            </p>
        </div>
    );
}

export default Registered;
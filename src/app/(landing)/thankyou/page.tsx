import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { api } from "~/utils/api";
import { getServerAuthSession } from "~/server/auth";


const ThankYouPage = async () => {
    const session = await getServerAuthSession();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const [error, setError] = useState<string | undefined>("");
    const stripeAPI = api.stripe.validateSubscription.useMutation();


    return (
        <div>
            {
                error ? <h1>Error: {error}</h1> : <div><h1>Thank You</h1>
                    <p>Thank you for your subscription!</p></div>
            }

        </div>
    );
}
export default ThankYouPage;
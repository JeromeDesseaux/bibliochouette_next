import { z } from "zod";

const emailFormSchema = z.object({
    email: z.string({
        required_error: "L'email est requis."
    }).email({
        message: "L'email doit être une adresse email valide."
    })
});

export default emailFormSchema;
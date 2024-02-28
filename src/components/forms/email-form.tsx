import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import emailFormSchema from '~/common/forms/email-form';

type EmailFormProps = {
    onSubmit: (values: z.infer<typeof emailFormSchema>) => void;
    submitLabel?: string;
};

const EmailForm: React.FC<EmailFormProps> = ({ onSubmit, submitLabel }) => {
    const form = useForm<z.infer<typeof emailFormSchema>>({
        resolver: zodResolver(emailFormSchema),
        defaultValues: {
            email: 'jerome.desseaux@gmail.com',
        },
    });

    const displaySubmitLabel = submitLabel ? submitLabel : 'Valider';

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder='john.doe@mabibli.fr' {...field}></Input>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className='w-full my-4'>{displaySubmitLabel}</Button>
            </form>
        </Form>
    )
}

export default EmailForm;
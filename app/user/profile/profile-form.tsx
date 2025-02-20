'use client';

import {useToast} from "@/hooks/use-toast";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {updateProfileSchema} from "@/lib/validator";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSession} from "next-auth/react";
import {updateProfile} from "@/lib/actions/user.actions";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

const ProfileForm = () => {
    const { data: session, update } = useSession();

    const form = useForm<z.infer<typeof updateProfileSchema>>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            name: session?.user?.name ?? '',
            email: session?.user?.email ?? '',
        },
    });
    
    const { toast } = useToast();
    
    const onSubmit = async (values: z.infer<typeof updateProfileSchema>) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const res = await updateProfile(values);
        
        if (!res.success) {
            return toast({
                variant: 'destructive',
                description: res.message,
            });
        }
        
        const newSession = {
            ...session,
            user: {
                ...session?.user,
                name: values.name,
            },
        };
        
        await update(newSession);
        
        toast({
            description: res.message,
        });
    };
    
    return (
        <Form {...form}>
            <form
                method='post'
                className='space-y-4'
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <div className='flex flex-col gap-5'>
                    <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormControl>
                                    <Input
                                        disabled
                                        placeholder='Email'
                                        className='input-field'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormControl>
                                    <Input
                                        disabled
                                        placeholder='Nome'
                                        className='input-field'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button
                    type='submit'
                    size='lg'
                    className='button col-span-2 w-full'
                    disabled={form.formState.isSubmitting}
                >
                    {form.formState.isSubmitting ? 'Submetendo...' : 'Profile Atualizado'}
                </Button>
            </form>
        </Form>
    );
};

export default ProfileForm;
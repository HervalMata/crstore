'use-client';

import {z} from "zod";
import {updateUserSchema} from "@/lib/validator";
import {useRouter} from "next/navigation";
import {useToast} from "@/hooks/use-toast";
import {ControllerRenderProps, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {updateUser} from "@/lib/actions/user.actions";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {USER_ROLES} from "@/lib/constants";

const UpdateUserForm = ({
    user,
} : {
    user: z.infer<typeof updateUserSchema>;
}) => {
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof updateUserSchema>>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: user,
    });

    const onSubmit = async ( values: z.infer<typeof updateUserSchema> ) => {
        try {
            const res = await updateUser({
                ...values,
                id: user.id,
            });

            if (!res.success) {
                toast({
                    variant: 'destructive',
                    description: res.message,
                });
                toast({
                    description: res.message,
                });
                form.reset();
                router.push("/admin/users");
            }
        } catch (error) {
            toast({
                description: (error as Error).message,
            });

        }
    };

    return (
        <Form {...form}>
            <form
                method="POST"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <div>
                    <FormField
                        control={form.control}
                        name='email'
                        render={({
                                     field,
                                 }: {
                            field: ControllerRenderProps<z.infer<typeof updateUserSchema>,
                                'email'>;
                        }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder='Digite o email do usuário' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div>
                    <FormField
                        control={form.control}
                        name='name'
                        render={({
                                     field,
                                 }: {
                            field: ControllerRenderProps<z.infer<typeof updateUserSchema>,
                                'name'>;
                        }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Nome</FormLabel>
                                <FormControl>
                                    <Input placeholder='Digite o nome do usuário' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div>
                    <FormField
                        control={form.control}
                        name='role'
                        render={({
                                     // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                     field,
                                 }: {
                            field: ControllerRenderProps<z.infer<typeof updateUserSchema>,
                                'role'>;
                        }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Função</FormLabel>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Escolha uma função' />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {USER_ROLES.map((role) => (
                                        <SelectItem key={role} value={role}>
                                            {role.charAt(0).toUpperCase() + role.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div>
                    <Button
                        type='submit'
                        disabled={form.formState.isSubmitting}
                        className='w-full'
                    >
                        {form.formState.isSubmitting ? 'Submetendo...' :  `Atualizar Usuuário`}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default UpdateUserForm;
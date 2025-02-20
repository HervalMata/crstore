'use client';

import {ShippingAddress} from "@/types";
import {useRouter} from "next/navigation";
import {useToast} from "@/hooks/use-toast";
import {ControllerRenderProps, SubmitHandler, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useTransition} from "react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {ArrowRight, Loader} from "lucide-react";
import {shippingAddressSchema} from "@/lib/validator";
import {updateUserAddress} from "@/lib/actions/user.actions";
import {shippingAddressDefaultValues} from "@/lib/constants";

const ShippingAddressForm = ({ address }: { address: ShippingAddress }) => {

    const router = useRouter();

    const { toast } = useToast();

    const form = useForm<z.infer<typeof shippingAddressSchema>>({
       resolver: zodResolver(shippingAddressSchema),
       defaultValues: address || shippingAddressDefaultValues,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isPending, startTransition] = useTransition();

    const onSubmit: SubmitHandler<z.infer<typeof shippingAddressSchema>> = (values) => {
        startTransition(async () => {
            const res = await updateUserAddress(values);

            if (!res.success) {
                toast({
                    variant: 'destructive',
                    description: res.message,
                });
                return;
            }

            router.push("/payment-method");
        });
    };

    return (
        <>
            <div className='max-w-md mx-auto space-y-4'>
                <h1 className='h2-bold mt-4'>
                    Endereço
                </h1>
                <p className='text-sm text-muted-foreground'>
                    Por favor digite um endereço para entrega
                </p>
                <Form {...form}>
                    <form
                        method='post'
                        className='space-y-4'
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <div className='flex flex-col md:flex-row gap-5'>
                            <FormField
                                control={form.control}
                                name='fullName'
                                render={({
                                    field,
                                } : {
                                    field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'fullName'>;
                                }) => (
                                    <FormItem className='w-full'>
                                        <FormLabel>Nome Completo</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Digite o nome completo" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                        </div>

                        <div className='flex flex-col md:flex-row gap-5'>
                            <FormField
                                control={form.control}
                                name='streetAddress'
                                render={({
                                             field,
                                         } : {
                                    field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'streetAddress'>;
                                }) => (
                                    <FormItem className='w-full'>
                                        <FormLabel>Endereço</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Digite o endereço" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className='flex flex-col md:flex-row gap-5'>
                            <FormField
                                control={form.control}
                                name='city'
                                render={({
                                             field,
                                         } : {
                                    field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'city'>;
                                }) => (
                                    <FormItem className='w-full'>
                                        <FormLabel>Cidade</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Digite a cidade" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className='flex flex-col md:flex-row gap-5'>
                            <FormField
                                control={form.control}
                                name='state'
                                render={({
                                             field,
                                         } : {
                                    field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'state'>;
                                }) => (
                                    <FormItem className='w-full'>
                                        <FormLabel>Estado</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Digite o estado" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className='flex flex-col md:flex-row gap-5'>
                            <FormField
                                control={form.control}
                                name='postalCode'
                                render={({
                                             field,
                                         } : {
                                    field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'postalCode'>;
                                }) => (
                                    <FormItem className='w-full'>
                                        <FormLabel>CEP</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Digite o cep" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className='flex flex-col md:flex-row gap-5'>
                            <FormField
                                control={form.control}
                                name='country'
                                render={({
                                             field,
                                         } : {
                                    field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'country'>;
                                }) => (
                                    <FormItem className='w-full'>
                                        <FormLabel>País</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Digite o país" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className='flex gap-2'>
                            <Button type='submit' disabled={isPending}>
                                {isPending ? (
                                    <Loader className='h-4 w-4 animate-spin' />
                                ) : (
                                    <ArrowRight className='h-4 w-4' />
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </>
    )
}

export default ShippingAddressForm;
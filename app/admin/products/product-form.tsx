'use client';

import {Product} from "@/types";
import {useRouter} from "next/navigation";
import {useToast} from "@/hooks/use-toast";
import {ControllerRenderProps, SubmitHandler, useForm} from "react-hook-form";
import {z} from "zod";
import {insertProductSchema, updateProductSchema} from "@/lib/validator";
import {zodResolver} from "@hookform/resolvers/zod";
import {productDefaultValues} from "@/lib/constants";
import {createProduct, updateProduct} from "@/lib/actions/product.actions";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import slugify from "slugify";
import {Textarea} from "@/components/ui/textarea";
import {Card, CardContent} from "@/components/ui/card";
import Image from "next/image";
import {UploadButton} from "@/lib/uploadthing";

const ProductForm = ({
    type,
    product,
    productId,
}: {
    type: 'Create' | 'Update';
    product: Product;
    productId: string;
}) => {
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof insertProductSchema>>({
        resolver:
            type === 'Update'
                ? zodResolver(updateProductSchema)
                : zodResolver(insertProductSchema),
        defaultValues:
            product && type === 'Update' ? product : productDefaultValues,
    });

    const onSubmit: SubmitHandler<z.infer<typeof insertProductSchema>> =
        async ( values ) => {
            if (type === "Create") {
                const res = await createProduct(values);

                if (!res.success) {
                    toast({
                        variant: 'destructive',
                        description: res.message,
                    });
                } else {
                    toast({
                        description: res.message,
                    });
                    router.push("/admin/products");
                }
            }

            if (type === "Update") {
                if (!productId) {
                    router.push("/admin/products");
                    return;
                }

                const res = await updateProduct({...values, id: productId});

                if (!res.success) {
                    toast({
                        variant: 'destructive',
                        description: res.message,
                    });
                } else {
                    toast({
                        description: res.message,
                    });
                    router.push("/admin/products");
                }
            }
        };

    const images = form.watch('images');

    return (
        <Form {...form}>
            <form
                method="POST"
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-8'
            >
                <div className='flex flex-col md:flex-row gap-5'>
                    <FormField
                        control={form.control}
                        name='name'
                        render={({
                            field,
                        }: {
                            field: ControllerRenderProps<z.infer<typeof insertProductSchema>,
                                'name'>;
                        }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Nome</FormLabel>
                                <FormControl>
                                    <Input placeholder='Digite o nome do produto' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='slug'
                        render={({
                                     field,
                                 }: {
                            field: ControllerRenderProps<z.infer<typeof insertProductSchema>,
                                'slug'>;
                        }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Nome</FormLabel>
                                <FormControl>
                                    <Input placeholder='Digite o nome do produto' {...field} />
                                    <Button
                                        type='button'
                                        className='bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 mt-2'
                                        onClick={() => {
                                            form.setValue(
                                                'slug',
                                                slugify(form.getValues('name'), { lower: true })
                                            );
                                        }}
                                    >
                                        Gerar Slug
                                    </Button>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className='flex flex-col md:flex-row gap-5'>
                    <FormField
                        control={form.control}
                        name='category'
                        render={({
                                     field,
                                 }: {
                            field: ControllerRenderProps<z.infer<typeof insertProductSchema>,
                                'category'>;
                        }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Categoria</FormLabel>
                                <FormControl>
                                    <Input placeholder='Digite a categoria do produto' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='brand'
                        render={({
                                     field,
                                 }: {
                            field: ControllerRenderProps<z.infer<typeof insertProductSchema>,
                                'brand'>;
                        }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Marca</FormLabel>
                                <FormControl>
                                    <Input placeholder='Digite a marca do produto' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className='flex flex-col md:flex-row gap-5'>
                    <FormField
                        control={form.control}
                        name='price'
                        render={({
                                     field,
                                 }: {
                            field: ControllerRenderProps<z.infer<typeof insertProductSchema>,
                                'price'>;
                        }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Preço</FormLabel>
                                <FormControl>
                                    <Input placeholder='Digite o preço do produto' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='stock'
                        render={({
                                     field,
                                 }: {
                            field: ControllerRenderProps<z.infer<typeof insertProductSchema>,
                                'stock'>;
                        }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Estoque</FormLabel>
                                <FormControl>
                                    <Input placeholder='Digite o estoque do produto' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className='upload-field flex flex-col md:flex-row gap-5'>
                    {/* Images */}
                    <FormField
                        control={form.control}
                        name='images'
                        render={({
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            field,
                                 }: {
                            field: ControllerRenderProps<z.infer<typeof insertProductSchema>,
                                'images'>;
                        }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Imagens</FormLabel>
                                <Card>
                                    <CardContent className='space-y-2 mt-2 min-h-48'>
                                        <div className='flex-start space-x-2'>
                                            {images.map((image: string) => (
                                                <Image
                                                    key={image}
                                                    src={image}
                                                    alt='product.name'
                                                    className='w-20 h-20 object-cover object-center rounded-sm'
                                                    width={100}
                                                    height={100}
                                                />
                                            ))}
                                            <FormControl>
                                                <UploadButton
                                                    endpoint= 'imageUploader'
                                                    onClientUploadComplete={(res: { url: string }[]) => {
                                                        form.setValue('images', [...images, res[0].url]);
                                                    }}
                                                    onUploadError={(error: Error) => {
                                                        toast({
                                                            variant: 'destructive',
                                                            description: `ERRO! ${error.message}`,
                                                        });
                                                    }}
                                                    />
                                            </FormControl>
                                        </div>
                                    </CardContent>
                                </Card>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className='upload-field'>{/* isFeatured */}</div>
                <div>
                <FormField
                    control={form.control}
                    name='description'
                    render={({
                                 field,
                             }: {
                        field: ControllerRenderProps<z.infer<typeof insertProductSchema>,
                            'description'>;
                    }) => (
                        <FormItem className='w-full'>
                            <FormLabel>Descrição</FormLabel>
                            <FormControl>
                                <Textarea placeholder='Digite a descrição do produto' className='resize-none' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                </div>
                <div>
                    <Button
                        type='submit'
                        size='lg'
                        disabled={form.formState.isSubmitting}
                        className='button col-span-2 w-full'
                    >
                        {form.formState.isSubmitting ? 'Submetendo...' :  `${type} Produto`}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default ProductForm;
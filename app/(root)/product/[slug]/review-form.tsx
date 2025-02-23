'use client';

import {useState} from "react";
import {useToast} from "@/hooks/use-toast";
import {SubmitHandler, useForm} from "react-hook-form";
import {z} from "zod";
import {insertReviewSchema} from "@/lib/validator";
import {zodResolver} from "@hookform/resolvers/zod";
import {reviewFormDefaultValues} from "@/lib/constants";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {StarIcon} from "lucide-react";
import {createUpdateReview} from "@/lib/actions/review.actions";

const ReviewForm = (
    {
        userId,
        productId,
        onReviewSubmitted,
    }: {
        userId: string;
        productId: string;
        onReviewSubmitted: () => void;
    }
) => {
    const [open, setOpen] = useState(false);

    const { toast } = useToast();

    const form = useForm<z.infer<typeof insertReviewSchema>>({
        resolver: zodResolver(insertReviewSchema),
        defaultValues: reviewFormDefaultValues,
    });

    const handleOpenForm = () => {
        form.setValue('productId', productId);
        form.setValue('userId', userId);
        setOpen(true);
    };

    const onSubmit: SubmitHandler<z.infer<typeof insertReviewSchema>> = async (values) => {
        const res = await createUpdateReview({ ...values, productId });

        if (!res.success) {
            return toast({
                variant: 'destructive',
                description: res.message,
            });
        }

        setOpen(false);

        onReviewSubmitted();

        toast({
            description: res.message,
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Button onClick={handleOpenForm} variant='default'>
                Escreva uma avaliação
            </Button>
            <DialogContent className='sm:max-w-[425px]'>
                <Form {...form}>
                    <form method='POST' onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle>Escreva uma avaliação</DialogTitle>
                            <DialogDescription>
                                suas experiências com outros compradores
                            </DialogDescription>
                        </DialogHeader>
                        <div className='grid gap-4 py-4'>
                            <FormField
                                control={form.control}
                                name='title'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Título</FormLabel>
                                        <FormControl>
                                            <Input placeholder='Digite o título' {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='description'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Descrição</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder='Digite a descrição' {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='rating'
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Título</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value.toString()}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {Array.from({ length: 5 }).map((_, index) => (
                                                        <SelectItem
                                                            key={index}
                                                            value={(index + 1).toString()}
                                                        >
                                                            {index + 1}{' '}
                                                            <StarIcon className='inline h-4 w-4' />
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type='submit'
                                size='lg'
                                className='w-full'
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting ? 'Submetendo...' : 'Enviar'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default ReviewForm;
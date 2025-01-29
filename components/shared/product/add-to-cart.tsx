'use client';

import {CartItem} from "@/types";
import {useRouter} from "next/navigation";
import {useToast} from "@/hooks/use-toast";
import {addItemToCart} from "@/lib/actions/cart.actions";
import {ToastAction} from "@/components/ui/toast";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";

const AddToCart = ({ item }: { item: CartItem }) => {
    const router = useRouter();
    const { toast } = useToast();

    const handleAddToCart = async () => {
        const res = await addItemToCart(item);

        if (!res.success) {
            toast({
                variant: 'destructive',
                description: res.message,
            });
            return;
        }

        toast({
            description: res.message,
            action: (
                <ToastAction
                    className='bg-primary text-white hover:bg-gray-800'
                    altText={'Ir para o carrinho'}
                    onClick={() => router.push('/cart')}
                >
                    Ir para o carrinho
                </ToastAction>
            ),
        });
    };

    return (
        <Button className='w-full' type={'button'} onClick={handleAddToCart}>
            <Plus /> Adicionar para o carrinho
        </Button>
    );
};

export default AddToCart;
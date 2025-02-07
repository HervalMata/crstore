'use client';

import {Cart, CartItem} from "@/types";
import {useRouter} from "next/navigation";
import {useToast} from "@/hooks/use-toast";
import {addItemToCart, removeItemFromCart} from "@/lib/actions/cart.actions";
import {ToastAction} from "@/components/ui/toast";
import {Button} from "@/components/ui/button";
import {Loader, Minus, Plus} from "lucide-react";
import {useTransition} from "react";

const AddToCart = ({ cart, item }: { cart?: Cart, item: CartItem }) => {
    const router = useRouter();
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    const handleAddToCart = async () => {
        startTransition(async () => {
            const res = await addItemToCart(item);
            console.log(res)
            if (!res.success) {
                toast({
                    variant: 'destructive',
                    description: res.message.toString(),
                });
                return;
            }

            toast({
                variant: 'destructive',
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
        });
    };

    const handleRemoveFromCart = async () => {
      startTransition(async () => {
          const res = await removeItemFromCart(item.productId);
          toast({
              variant: 'destructive',
              description: res.message,
          });

          return;
      });
    };

    const existItem = cart && cart.items.find((x) => x.productId === item.productId)

    return existItem ? (
        <div>
            <Button type='button' variant='outline' onClick={handleRemoveFromCart}>
                {isPending ? (
                    <Loader className='w-4 h-4 animate-spin' />
                ) : (
                    <Minus className='w-4 h-4' />
                )}
            </Button>
            <span className='px-2'>{existItem.qty}</span>
            <Button className='w-full' type='button' onClick={handleAddToCart}>
                {isPending ? (
                    <Loader className='w-4 h-4 animate-spin' />
                    ) : (
                        <Plus className='w-4 h-4' />
                )}
            </Button>
        </div>
    ) : (
        <Button className='w-full' type='button' onClick={handleAddToCart}>
            {isPending ? (
                <Loader className='w-4 h-4 animate-spin' />
            ) : (
                <Plus className='w-4 h-4' />
            )}{' '}
            Adicionar para o carrinho
        </Button>
    );
};

export default AddToCart;
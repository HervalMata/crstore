'use client';

import {useRouter} from "next/navigation";
import React from "react";
import {createOrder} from "@/lib/actions/order.actions";
import {useFormStatus} from "react-dom";
import {Button} from "@/components/ui/button";
import {Check, Loader} from "lucide-react";

const PlaceOrderForm = () => {
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();

      const res = await createOrder();

      if (res.redirect) {
          router.push(res.redirect);
      }
    };

    const PlaceOrderButton = () => {
      const { pending } = useFormStatus();

      return (
          <Button disabled={pending} className="w-full">
              {pending ? (
                  <Loader className="w-4 h-4 animate-spin" />
              ) : (
                  <Check className='w-4 h-4' />
              )}{' '}
              Finalizar Order
          </Button>
      );
    };

    return (
        <form onSubmit={handleSubmit} className='w-full'>
            <PlaceOrderButton />
        </form>
    );
}

export default PlaceOrderForm;
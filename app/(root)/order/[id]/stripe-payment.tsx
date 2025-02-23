import {loadStripe} from "@stripe/stripe-js";
import {useTheme} from "next-themes";
import {Elements, LinkAuthenticationElement, PaymentElement, useElements, useStripe} from "@stripe/react-stripe-js";
import {FormEvent, useState} from "react";
import {SERVER_URL} from "@/lib/constants";
import {Button} from "@/components/ui/button";
import {formatCurrency} from "@/lib/utils";

const StripePayment = (
    {
        priceInCents,
        orderId,
        clientSecret,
    }: {
        priceInCents: number;
        orderId: string;
        clientSecret: string;
    }
) => {
    const stripPromise = loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
    );

    const { theme, systemTheme } = useTheme();

    const StripeForm = () => {
        const stripe = useStripe();
        const elements = useElements();
        const [isLoading, setIsLoading] = useState(false);
        const [errorMessage, setErrorMessage] = useState('');
        const [email, setEmail] = useState('');

        const handleSubmit = async (e: FormEvent) => {
            e.preventDefault();

            if (stripe == null || elements == null || email == null) return;

            setIsLoading(true);

            stripe
                .confirmPayment({
                    elements,
                    confirmParams: {
                        return_url: `${SERVER_URL}/orders/${orderId}/stripe-payment-success`,
                    },
                })
                .then(({ error }) => {
                    if (
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        error?.type === 'card.error' || 
                        error?.type === 'validation_error'
                    ) {
                        setErrorMessage(error?.message ?? 'Um desconhecido erro ocorreu.');
                    } else if (error) {
                        setErrorMessage('Um desconhecido erro ocorreu.');
                    }
                })
                .finally(() => setIsLoading(false));
        };

        return (
            <form className='space-y-4' onSubmit={handleSubmit}>
                <div className='text-xl'>Pagamento com Stripe</div>
                {errorMessage && <div className="text-destructive">{errorMessage}</div>}
                <PaymentElement />
                <div>
                    <LinkAuthenticationElement
                        onChange={(e) => setEmail(e.value.email)}
                    />
                </div>
                <Button
                    className='w-full'
                    size='lg'
                    disabled={stripe == null || elements == null || isLoading}
                >
                    {isLoading
                        ? 'Processando...'
                        : `Pagamento finalizado ${formatCurrency(priceInCents / 100)}`
                    }
                </Button>
            </form>
        );
    };

    return (
        <Elements
            options={{
                clientSecret,
                appearance: {
                    theme:
                        theme === 'dark'
                            ? 'night'
                            : theme === 'light'
                            ? 'stripe'
                            : systemTheme === 'light'
                            ? 'stripe'
                            : 'night',
                },
            }}
            stripe={stripPromise}
            >
            <StripeForm />
        </Elements>
    );
};

export default StripePayment;
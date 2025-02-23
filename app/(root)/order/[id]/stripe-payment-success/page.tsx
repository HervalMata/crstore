import Stripe from "stripe";
import {getOrderById} from "@/lib/actions/order.actions";
import {notFound, redirect} from "next/navigation";
import {Button} from "@/components/ui/button";
import Link from "next/link";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const SuccessPage = async (props: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ payment_intent: string }>;
}) => {
    const { id } = await props.params;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { payment_intent: paymentIntentId } = props.searchParams;

    const order = await getOrderById(id);
    if (!order) notFound();

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (
        paymentIntent.metadata.orderId == null ||
        paymentIntent.metadata.orderId !== order.id.toString()
    ) {
        return notFound();
    }

    const isSuccess = paymentIntent.status === 'succeeded';

    if (!isSuccess) return redirect(`/order/${id}`);

    return (
        <div className='max-w-4xl w-full mx-auto space-y-8'>
            <div className='flex flex-col gap-6 items-center'>
                <h1 className='h1-bold'>Obrigado pela sua compra</h1>
                <div>Nós estamos processando sua ordem.</div>
                <Button asChild>
                    <Link href={`/order/${id}`}>Veja sua ordem</Link>
                </Button>
            </div>
        </div>
    );
};

export default SuccessPage;
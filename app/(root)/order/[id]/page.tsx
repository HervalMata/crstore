import {Metadata} from "next";
import {getOrderById} from "@/lib/actions/order.actions";
import OrderDetailsTable from "@/app/(root)/order/[id]/order-details-table";
import {ShippingAddress} from "@/types";
import {auth} from "@/auth";
import {notFound,redirect} from "next/navigation";
import Stripe from "stripe";

export const metadata: Metadata = {
    title: "Detalhes da Ordem",
}

const OrderDetailsPage = async (
    props: {
        params: Promise<{
            id: string;
        }>;
    }
) => {
  const { id } = await props.params;

  const order = await getOrderById(id);
  if (!order) notFound();

  const session = await auth();

  if (order.userId !== session?.user?.id) {
    return redirect('/unauthorized');
  }
  
  let client_secret = null;
  
  if (order.paymentMethod === 'Stripe' && !order.isPaid) {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
      const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(Number(order.totalPrice) * 100),
          currency: "BRL",
          metadata: { orderId: order.id },
      });
      client_secret = paymentIntent.client_secret;
  }

  if (order.userId !== session?.user.id) {
      return redirect('/unauthorized');
  }
  
    return (
      <OrderDetailsTable order={{
          ...order,
          shippingAddress: order.shippingAddress as ShippingAddress,
      }}
      stripeClientSecret={client_secret}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
      isAdmin={session?.user?.role === 'admin' || false}
      />
  );
};

export default OrderDetailsPage;
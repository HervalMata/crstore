import {Metadata} from "next";
import {getOrderById} from "@/lib/actions/order.actions";
import OrderDetailsTable from "@/app/(root)/order/[id]/order-details-table";
import {ShippingAddress} from "@/types";
import {auth} from "@/auth";
import {notFound,redirect} from "next/navigation";

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

  if (order.userId !== session?.user.id) {
      return redirect('/unauthorized');
  }

  return (
      <OrderDetailsTable order={{
          ...order,
          shippingAddress: order.shippingAddress as ShippingAddress,
      }}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
      />
  );
};

export default OrderDetailsPage;
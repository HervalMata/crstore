import {Metadata} from "next";
import {getOrderById} from "@/lib/actions/order.actions";
import notFound from "@/app/not-found";

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

  return <>Detalhes da Ordem</>
}

export default OrderDetailsPage;
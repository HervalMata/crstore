import {Metadata} from "next";
import {getOrderById} from "@/lib/actions/order.actions";

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const order = await getOrderById(id);

  return <>Detalhes da Ordem</>
}

export default OrderDetailsPage;
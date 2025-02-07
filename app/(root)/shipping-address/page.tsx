import {getMyCart} from "@/lib/actions/cart.actions";
import {redirect} from "next/navigation";
import {auth} from "@/auth";
import {getUserById} from "@/lib/actions/user.actions";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Endereço",
};

const ShippingAddress = async () => {
  const cart = await getMyCart();

  if (!cart || cart.items.length === 0) redirect("/cart");

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw  new Error("Nenhum Usuário encontrado com este ID");

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = await getUserById(userId);

  return <>Endereço</>;
};

export default ShippingAddress;
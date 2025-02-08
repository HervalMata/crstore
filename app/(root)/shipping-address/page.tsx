import {getMyCart} from "@/lib/actions/cart.actions";
import {redirect} from "next/navigation";
import {auth} from "@/auth";
import {getUserById} from "@/lib/actions/user.actions";
import {Metadata} from "next";
import ShippingAddressForm from "@/app/(root)/shipping-address/shipping-address-form";
import {ShippingAddress} from "@/types";

export const metadata: Metadata = {
    title: "Endereço",
};

const ShippingAddressPage = async () => {
  const cart = await getMyCart();

  if (!cart || cart.items.length === 0) redirect("/cart");

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw  new Error("Nenhum Usuário encontrado com este ID");

  const user = await getUserById(userId);

  return (
      <>
        <ShippingAddressForm address={user.address as ShippingAddress} />
      </>
  );
};

export default ShippingAddressPage;
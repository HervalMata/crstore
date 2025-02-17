import {Metadata} from "next";
import {auth} from "@/auth";
import {getUserById} from "@/lib/actions/user.actions";
import CheckoutSteps from "@/components/shared/checkout-steps";
import PaymentMethodForm from "@/app/(root)/payment-method/payment-method-form";

export const metadata: Metadata = {
    title: "Selecione Metódo de Pagamento",
}

const PaymentMethodPage = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("Usuário não encontrado.");

  const user = await getUserById(userId);

  return (
      <>
        <CheckoutSteps current={2} />
          <PaymentMethodForm preferredPaymentMethod={user.paymentMethod} />
      </>
  );
}

export default PaymentMethodPage;
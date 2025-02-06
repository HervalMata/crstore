import {getMyCart} from "@/lib/actions/cart.actions";
import CartTable from "@/app/(root)/cart/cart-table";

export const metadata = {
    title: 'Carrinho de Compras'
}

const CartPage = async () => {
    const cart = await getMyCart();
    

    return (
        <>
            <CartTable
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                cart={cart} 
            />
        </>
    );

}

export default CartPage;
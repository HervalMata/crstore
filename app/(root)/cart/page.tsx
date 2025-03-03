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
                cart={cart} 
            />
        </>
    );

}

export default CartPage;
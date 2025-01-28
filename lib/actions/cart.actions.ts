import {CartItem} from "@/types";

export async function addItemToCart(data: CartItem) {
    console.log(data);
    return {
        success: true,
        message: `Itens Adicionados para o carrinho`,
    };
}
import {CartItem} from "@/types";

export async function addItemToCart(data: CartItem) {
    return {
        success: true,
        message: `Itens Adicionados para o carrinho`,
    };
}
import {z} from "zod";
import {formatNumberWithDecimal} from "@/lib/utils";

const currency = z.string().refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    //(value) => /^\d{1,3}(?:\.\d{3})*,\d{2}$/.test(formatNumberWithDecimal(Number(value))),
    'Preço deve ter exatamente 2 decimais'
)

export const insertProductSchema = z.object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    slug: z.string().min(3, 'Slug deve ter pelo menos 3 caracteres'),
    category: z.string().min(3, 'Categoria deve ter pelo menos 3 caracteres'),
    brand: z.string().min(3, 'Marca deve ter pelo menos 3 caracteres'),
    description: z.string().min(3, 'Descrição deve ter pelo menos 3 caracteres'),
    stock: z.coerce.number(),
    images: z.array(z.string().min(3, 'Produto deve ter pelo menos uma imagem')),
    isFeatured: z.boolean(),
    banner: z.string().nullable(),
    price: currency,
})

export const signInFormSchema = z.object({
    email: z.string().email('Email invalido').min(3, 'Email deve ter pelo menos 3 caracteres'),
    password: z.string().min(3, 'Senha deve ter pelo menos 3 caracteres'),
})

export const signUpFormSchema = z.object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    email: z.string().email('Email invalido'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string().min(3, 'A confirmação de Senha deve ter pelo menos 6 caracteres'),
}).refine(
    (data) => data.password === data.confirmPassword, {
        message: 'Senhas não conferem',
        path: ['confirmPassword'],
    }
);

export const cartItemSchema = z.object({
    productId: z.string().min(1, 'Produto é requerido'),
    name: z.string().min(1, 'Nome é requerido'),
    slug: z.string().min(1, 'Slug é requerido'),
    qty: z.number().int().nonnegative('Quantidade deve ser um número positivo'),
    image: z.string().min(1, 'Imagem é requerida'),
    price: currency,
});

export const insertCartSchema = z.object({
    items: z.array(cartItemSchema),
    itemsPrice: currency,
    totalPrice: currency,
    shippingPrice: currency,
    taxPrice: currency,
    sessionCartId: z.string().min(1, 'ID da Sessão do carrinho é requerida.'),
    userId: z.string().optional().nullable(),
});

export const shippingAddressSchema = z.object({
    fullName: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    streetAddress: z.string().min(3, 'Endereço deve ter pelo menos 3 caracteres'),
    city: z.string().min(3, 'Cidade deve ter pelo menos 3 caracteres'),
    state: z.string().min(2, 'Estado deve ter pelo menos 2 caracteres'),
    postalCode: z.string().min(8, 'CEP deve ter pelo menos 8 caracteres'),
    country: z.string().min(3, 'País deve ter pelo menos 3 caracteres'),
    lat: z.number().optional(),
    lng: z.number().optional(),
})
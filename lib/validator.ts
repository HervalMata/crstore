import {z} from "zod";
import {formatNumberWithDecimal} from "@/lib/utils";

const currency = z.string().refine(
    (value) => /^\d+(\.\d{2})?R$/.test(formatNumberWithDecimal(Number(value))),
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
    password: z.string().min(3, 'Password deve ter pelo menos 3 caracteres'),
})
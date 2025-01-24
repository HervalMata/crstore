import {neonConfig, Pool} from "@neondatabase/serverless";
import ws from "ws";
import {PrismaNeon} from "@prisma/adapter-neon";
import {PrismaClient} from "@prisma/client";

neonConfig.webSocketConstructor = ws;
const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export const prisma = new PrismaClient({ adapter }).$extends({
    result: {
        product: {
            price: {
                compute(product) {
                    return product.price.toString();
                },
            },
            rating: {
                compute(product) {
                    return product.rating.toString();
                },
            },
        },
    },
});
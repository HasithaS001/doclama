import {
    cancelSubscription,
    createCheckout,
    createWebhook,
    getPrice,
    getProduct,
    getSubscription,
    listPrices,
    listProducts,
    listWebhooks,
    updateSubscription,
    type Variant,
} from "@lemonsqueezy/lemonsqueezy.js";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'

export async function POST(req: any) {
    try {
        const reqData = await req.json();

        if (!reqData.productId) {
            return NextResponse.json({ message: 'Product ID is missing' }, { status: 400 });
        }

        const checkout = await createCheckout(
            process.env.LEMONSQUEEZY_STORE_ID!,
            "758320",
            {

                checkoutData: {
                    email: 'themiya@gmail.com',
                    custom: {
                        user_id: '2',
                    },
                },
            },
        );

        return checkout.data?.data.attributes.url;

    } catch (error: any) {
        console.error('API Error:', error?.response?.data || error.message || error);
        return NextResponse.json({ message: 'Internal server error', error: error?.message || 'Unknown error' }, { status: 500 });
    }
}

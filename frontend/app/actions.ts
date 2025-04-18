/* eslint-disable no-console -- allow logs */
/* eslint-disable @typescript-eslint/no-non-null-assertion -- checked in configureLemonSqueezy() */
"use server";

import crypto from "node:crypto";
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
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

import { configureLemonSqueezy } from "@/config/lemonSqueezy";
import { webhookHasData, webhookHasMeta } from "@/lib/typeguards";
import { supabase } from '@/lib/supabase-server';

export async function getCheckoutURL(variantId: number, user?: {email?: string, id: string} | undefined ,embed = false) {
    configureLemonSqueezy();

    console.log(user);

    if(!user) {
        throw new Error("user not authenticated");
    }

    const checkout = await createCheckout(
        process.env.LEMON_SQUEEZY_STORE_ID!,
        variantId,
        {
            checkoutOptions: {
                embed,
                media: false,
                logo: !embed,
            },
            checkoutData: {
                email: user.email ?? undefined,
                custom: {
                    user_id: user.id ?? '123',
                },
            },
            productOptions: {
                enabledVariants: [variantId],
                redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/`,
                receiptButtonText: "Go to Dashboard",
                receiptThankYouNote: "Thank you for signing up to Lemon Stand!",
            },
        },
    );

    return checkout.data?.data.attributes.url;
}

export async function storeWebhookEvent(
    eventName: string,
    body: NewWebhookEvent["body"],
) {

    const id = crypto.randomInt(100000000, 1000000000);

    const { data, error } = await supabase
        .from('webhook_event')
        .insert([
            {
                id,
                event_name: eventName,
                processed: false,
                body,
            },
        ])
        .select();

    if (error) {
        throw new Error(`Failed to insert webhook event: ${error.message}`);
    }

    return data[0];
}

export async function processWebhookEvent(webhookEvent: NewWebhookEvent) {
    configureLemonSqueezy();

    const { data, error } = await supabase
        .from('webhook_event')
        .select('*')
        .eq('id', webhookEvent.id);

    if (!data || data.length === 0) {
        throw new Error(`Webhook event #${webhookEvent.id} not found in the database.`);
    }

    const row = data[0];

    // Extract the correct values from the database row
    const eventName = row.event_name;
    const eventBody = row.body;

    if (!process.env.WEBHOOK_URL) {
        throw new Error(
            "Missing required WEBHOOK_URL env variable. Please, set it in your .env file.",
        );
    }

    let processingError = "";

    console.log('Event name:', eventName);

    if (!webhookHasMeta(eventBody)) {
        processingError = "Event body is missing the 'meta' property.";
    } else if (webhookHasData(eventBody)) {
        if (eventName.startsWith("subscription_payment_")) {
            // Not implemented
        } else if (eventName.startsWith("subscription_")) {
            const attributes = eventBody.data.attributes;
            const variantId = attributes.variant_id as string;

            const { data: planData } = await supabase
                .from('plan')
                .select('*')
                .eq('variant_id', parseInt(variantId));

            if (!planData || planData.length < 1) {
                processingError = `Plan with variantId ${variantId} not found.`;
            } else {
                const plan = planData[0];

                const priceId = attributes.first_subscription_item.price_id;

                const priceData = await getPrice(priceId);
                if (priceData.error) {
                    processingError = `Failed to get the price data for the subscription ${eventBody.data.id}.`;
                }

                const isUsageBased = attributes.first_subscription_item.is_usage_based;
                const price = isUsageBased
                    ? priceData.data?.data.attributes.unit_price_decimal
                    : priceData.data?.data.attributes.unit_price;

                const updateData: NewSubscription = {
                    lemon_squeezy_id: eventBody.data.id,
                    order_id: attributes.order_id as number,
                    name: attributes.user_name as string,
                    email: attributes.user_email as string,
                    status: attributes.status as string,
                    status_formatted: attributes.status_formatted as string,
                    renews_at: attributes.renews_at as string,
                    ends_at: attributes.ends_at as string,
                    trial_ends_at: attributes.trial_ends_at as string,
                    price: price?.toString() ?? "",
                    is_paused: false,
                    subscription_item_id: attributes.first_subscription_item.id,
                    is_usage_based: attributes.first_subscription_item.is_usage_based,
                    user_id: eventBody.meta.custom_data.user_id,
                    plan_id: plan.id,
                };

                try {
                    const { error } = await supabase
                        .from('subscription')
                        .upsert([updateData], {
                            onConflict: 'lemon_squeezy_id',
                        });

                    if (error) console.error(error);

                } catch (error) {
                    processingError = `Failed to upsert Subscription #${updateData.lemon_squeezy_id} to the database.`;
                    console.error(error);
                }
            }
        } else if (eventName.startsWith("order_")) {
            // Not implemented
        } else if (eventName.startsWith("license_")) {
            // Not implemented
        }

        const { error: updateError } = await supabase
            .from('webhook_event')
            .update({
                processed: true,
                'processing_error': processingError,
            })
            .eq('id', webhookEvent.id);

        if (updateError) console.error(updateError);
    }
}

export async function getUserSubscriptions(userId: string) {

    if (!userId) {
        notFound();
    }

    const { data: userSubscriptions, error } = await supabase
        .from('subscription')
        .select("*")
        .eq("user_id", userId);

    if (error) {
        console.error("Error fetching subscriptions:", error);
        return [];
    }

    revalidatePath("/");


    return userSubscriptions;
}


export async function pauseUserSubscription({id, userId}: {id: string, userId: string}) {
    configureLemonSqueezy();

    // Get user subscriptions
    const userSubscriptions = await getUserSubscriptions(userId);

    // Check if the subscription exists
    const subscription = userSubscriptions.find(
        (sub) => sub.lemon_squeezy_id === id,
    );

    if (!subscription) {
        throw new Error(`Subscription #${id} not found.`);
    }

    const returnedSub = await updateSubscription(id, {
        pause: {
            mode: "void",
        },
    });

    // Update the db
    try {
        await supabase
            .from('subscription')
            .update({
                status: returnedSub.data?.data.attributes.status,
                status_formatted: returnedSub.data?.data.attributes.status_formatted,
                ends_at: returnedSub.data?.data.attributes.ends_at,
                is_paused: returnedSub.data?.data.attributes.pause !== null,
            })
            .eq('lemon_squeezy_id', id);
    } catch (error) {
        throw new Error(`Failed to pause Subscription #${id} in the database.`);
    }

    revalidatePath("/");

    return returnedSub;
}

export async function unpauseUserSubscription({id, userId}: {id: string, userId: string}) {
    configureLemonSqueezy();

    // Get user subscriptions
    const userSubscriptions = await getUserSubscriptions(userId);

    // Check if the subscription exists
    const subscription = userSubscriptions.find(
        (sub) => sub.lemon_squeezy_id === id,
    );

    if (!subscription) {
        throw new Error(`Subscription #${id} not found.`);
    }

    const returnedSub = await updateSubscription(id, { pause: null });

    // Update the db
    try {
        await supabase
            .from('subscription')
            .update({
                status: returnedSub.data?.data.attributes.status,
                statusFormatted: returnedSub.data?.data.attributes.status_formatted,
                endsAt: returnedSub.data?.data.attributes.ends_at,
                isPaused: returnedSub.data?.data.attributes.pause !== null,
            })
            .eq('lemon_squeezy_id', id);
    } catch (error) {
        throw new Error(`Failed to pause Subscription #${id} in the database.`);
    }

    revalidatePath("/");

    return returnedSub;
}

export async function cancelSub({id, userId}: {id: string, userId: string}) {
    configureLemonSqueezy();

    // Get user subscriptions
    const userSubscriptions = await getUserSubscriptions(userId);

    // Check if the subscription exists
    const subscription = userSubscriptions.find(
        (sub) => sub.lemon_squeezy_id === id,
    );

    if (!subscription) {
        throw new Error(`Subscription #${id} not found.`);
    }

    const cancelledSub = await cancelSubscription(id);

    if (cancelledSub.error) {
        throw new Error(cancelledSub.error.message);
    }

    // Update the db
    try {
        await supabase
            .from('subscription')
            .update({
                status: cancelledSub.data.data.attributes.status,
                statusFormatted: cancelledSub.data.data.attributes.status_formatted,
                endsAt: cancelledSub.data.data.attributes.ends_at,
            })
            .eq('lemon_squeezy_id', id);

    } catch (error) {
        throw new Error(`Failed to cancel Subscription #${id} in the database.`);
    }

    revalidatePath("/");

    return cancelledSub;
}



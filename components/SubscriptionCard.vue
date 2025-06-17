<!-- components/SubscriptionCard.vue -->
<template>
    <UCard>
        <template #header>
            <!-- Use props.subscription instead of just subscription -->
            <h1 class="font-bold text-gray-500">Subscription: {{ props.subscription.id }}</h1>
        </template>
        <div class="flex flex-col space-y-2">
            <!-- Update all references to use props.subscription -->
            <p>Type: {{ displayType }}</p>
            <p>Subscription Reference: {{ props.subscription.stripe_subscription_id }}</p>
            <p>Customer Reference: {{ props.subscription.stripe_customer_id }}</p>
            <p>Trial Start: {{ formatDateTime(props.subscription.trial_start) }}</p>
            <p>Trial End: {{ formatDateTime(props.subscription.trial_end) }}</p>
            <p>Subscription Start: {{ formatDateTime(props.subscription.subscription_start) }}</p>
            <p v-if="props.subscription.status === 'active'">Current Period End: {{ formatDateTime(props.subscription.current_period_end) }}</p>
            <p v-if="props.subscription.status === 'canceled'">Date Cancelled: {{ formatDateTime(props.subscription.current_period_end) }}</p>
        </div>

        <template #footer>
            <div>
                <!-- This will now display the correct status -->
                <p>Status: {{ props.subscription.status }}</p>
            </div>
        </template>
    </UCard>
</template>

<script setup lang="ts">
    import { defineProps, computed } from 'vue';
    import { format, parseISO } from 'date-fns';

    // ★★★ THE FIX IS HERE ★★★
    // Assign the entire result of defineProps to a 'props' constant.
    const props = defineProps<{
        subscription: {
            id: number;
            stripe_subscription_id: string;
            stripe_customer_id: string;
            status: string;
            current_period_end: Date;
            type: string;
            trial_start: Date | null;
            trial_end: Date | null;
            subscription_start: Date | null;
            stripe_account_url: string | null;
        };
    }>();

    const displayType = computed(() => {
    if (props.subscription.type === 'month') {
        return 'Monthly';
    }
    if (props.subscription.type === 'year') {
        return 'Yearly';
    }
    // Fallback for any other unexpected values
    return props.subscription.type;
    });

    function formatDateTime(isoString: string | null | undefined): string {
        if (!isoString) {
            return 'N/A';
        }
        return format(parseISO(isoString), "d MMMM yyyy");
    }
</script>
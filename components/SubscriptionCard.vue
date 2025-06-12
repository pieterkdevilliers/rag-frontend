<template>
    <UCard>
        <template #header>
            <h1 class="font-bold text-gray-500">Subscription: {{ subscription.id }}</h1>
        </template>
        <div class="flex flex-col space-y-2">
            <p>Type: {{ subscription.type }}</p>
            <p> Subscription Reference: {{ subscription.stripe_subscription_id }}</p>
            <p>Customer Reference: {{ subscription.stripe_customer_id }}</p>
            <p>Trial Start: {{ formatDateTime(subscription.trial_start) }}</p>
            <p>Trial End: {{ formatDateTime(subscription.trial_end) }}</p>
            <p>Subscription Start: {{ formatDateTime(subscription.subscription_start) }}</p>
        </div>

        <template #footer>
            <div>
                <p>Status: {{ subscription.status }}</p>
            </div>

        </template>
    </UCard>
</template>

<script setup lang="ts">

    import { defineProps } from 'vue';
    import { format, parseISO } from 'date-fns';

    const { subscription } = defineProps<{
    subscription: {
        id: number;
        stripe_subscription_id: string;
        stripe_customer_id: string;
        status: string;
        current_period_end: Date;
        type: string;  // 'monthly' or 'yearly'
        trial_start: Date | null;
        trial_end: Date | null;
        subscription_start: Date | null;
        stripe_account_url: string | null;
    };
    }>();

    // Create a helper function for reusability
    function formatDateTime(isoString: string | null | undefined): string {
    // Return a placeholder if the date is null or invalid
    if (!isoString) {
        return 'N/A';
    }
    // parseISO converts the string to a Date object
    // format then applies your desired output format
    return format(parseISO(isoString), "d MMMM yyyy");
    }
</script>
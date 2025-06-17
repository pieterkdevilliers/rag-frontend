<template>
    <UCard>
        <template #header>
            <h1 class="font-bold text-gray-500">{{ product.product_title }}</h1>
        </template>
            <div>
                <p>Description: {{ product.product_description }}</p>
                <p>${{ product.product_price.toFixed(2) }} - Billed {{ planCycle }}</p>
            </div>

        <template #footer>
            <div>
                <UButton
                    icon="i-heroicons:shopping-cart"
                    label="Subscribe"
                    :to="'https://fastapi-rag-2705cfd4c41a.herokuapp.com/api/v1/checkout/' + product.price_id + '/' + uniqueAccountId"
                    />
            </div>

        </template>
    </UCard>
</template>

<script setup lang="ts">

    import { defineProps, computed } from 'vue';
    import { format, parseISO } from 'date-fns';
    import { UButton } from '#components';
    import { useAuthStore } from '~/stores/auth';

    const authStore = useAuthStore();
    const uniqueAccountId = authStore.uniqueAccountId;

    const { product } = defineProps<{
    product: {
        id: number;
        product_title: string;
        product_id: string;
        product_description: string;
        product_statement_descriptor: Date;
        product_price: number;
        product_plan_cycle: string;
        price_id: string;
    };
    }>();

    const planCycle = computed(() => {
    if (product.product_plan_cycle === 'month') {
        return 'Monthly';
    }
    if (product.product_plan_cycle === 'year') {
        return 'Yearly';
    }
    // Fallback for any other unexpected values
    return props.subscription.type;
    });

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

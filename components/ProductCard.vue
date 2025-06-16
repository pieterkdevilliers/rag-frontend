<template>
    <UCard>
        <template #header>
            <h1 class="font-bold text-gray-500">Product: {{ product.product_title }}</h1>
        </template>
            <div>
                <p>Product ID: {{ product.product_id }}</p>
                <p>Description: {{ product.product_description }}</p>
                <p>Statement Descriptor: {{ product.product_statement_descriptor }}</p>
                <p>Price: ${{ product.product_price.toFixed(2) }}</p>
                <p>Plan Cycle: {{ product.product_plan_cycle }}</p>
                <p>Price ID: {{ product.price_id }}</p>
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

    import { defineProps } from 'vue';
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

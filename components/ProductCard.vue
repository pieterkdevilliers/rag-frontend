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
            </div>

        <template #footer>
            <div>
                <UButton
                    icon="i-heroicons:shopping-cart"
                    label="Subscribe"
                    />
            </div>

        </template>
    </UCard>
</template>

<script setup lang="ts">

    import { defineProps } from 'vue';
    import { format, parseISO } from 'date-fns';
import { UButton } from '#components';

    const { product } = defineProps<{
    product: {
        id: number;
        product_title: string;
        product_id: string;
        product_description: string;
        product_statement_descriptor: Date;
        product_price: number;
        product_plan_cycle: string;
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

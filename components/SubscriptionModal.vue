<template>
  <!-- Bind the custom UI configuration to the :ui prop -->
  <UModal v-model="isOpen" :ui="modalUiConfig">
    <!-- Use UCard for better default styling like header/body/footer -->
    <UCard>
        <template #header>
            <div class="flex items-center justify-between">
                <h2 class="text-lg font-bold">
                    Subscribe to a Plan
                </h2>
                <!-- Nuxt UI adds a close button by default in the top right -->
            </div>
        </template>

        <!-- Your main content -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-5">
            <div v-for="product in products?.products" :key="product.id">
                <ProductCard :product="product" />
            </div>
        </div>
      
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
    import { computed, ref } from 'vue';
    import ProductCard from './ProductCard.vue';
    import { useAuthStore } from '~/stores/auth';

    const props = defineProps<{
        modelValue: boolean;
    }>();

    const emit = defineEmits<{
        (e: 'update:modelValue', value: boolean): void;
    }>();

    const isOpen = computed({
        get: () => props.modelValue,
        set: (value: boolean) => emit('update:modelValue', value),
    });

    // ★★★ DEFINE YOUR CUSTOM UI CONFIGURATION HERE ★★★
    // We are overriding the default width/max-width of the modal.
    // 'w-full' ensures it's full-width on mobile.
    // 'sm:max-w-4xl' makes it much wider on desktop (4xl = 80rem / 1280px).
    // You can use other values like 'sm:max-w-2xl', 'sm:max-w-5xl', etc.
    const modalUiConfig = {
      width: 'w-full sm:max-w-4xl'
    }

    const { data: products, error } = await useFetch('https://fastapi-rag-2705cfd4c41a.herokuapp.com/api/v1/products', {
        headers: {
            Authorization: `Bearer ${useAuthStore().access_token}`,
        },
    });

    if (error.value) {
        console.error('Error fetching products:', error.value);
    }
</script>
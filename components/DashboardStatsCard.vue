<template>
  <UCard>
    <template #header>
      <!-- Use a prop for the title -->
      <p class="font-bold">{{ title }}</p>
    </template>

    <!-- Show a skeleton while the value is loading -->
    <div v-if="loading" class="flex justify-center py-4">
      <USkeleton class="h-24 w-24" :ui="{ rounded: 'rounded-full' }" />
    </div>

    <!-- Show the data once loaded -->
    <div v-else class="flex justify-center py-4">
      <div class="flex items-center justify-center w-24 h-24 bg-primary-100 dark:bg-primary-900 rounded-full">
        <!-- Use a prop for the value -->
        <span class="text-3xl font-bold text-primary-800 dark:text-primary-200">{{ value }}</span>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
// Define props that this component will accept
defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});
</script>
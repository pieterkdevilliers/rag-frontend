<template>
  <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
          Your New API Key
        </h3>
        <!-- <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="handleClose" /> -->
        <!-- Generally, the action button inside will close it -->
      </div>
    </template>

    <div class="p-4">
      <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">
        Please copy this API key and store it securely.
        <strong class="text-red-500 dark:text-red-400">You will not be able to see it again after closing this message.</strong>
        </p>
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
        <strong class="text-red-500 dark:text-red-400">We do not store this key.</strong>
      </p>
      
      <div v-if="apiKey" class="flex items-center space-x-2 mt-3 p-3 bg-gray-100 dark:bg-gray-800 rounded font-mono text-sm text-gray-700 dark:text-gray-200 break-all">
        <span class="flex-grow">{{ apiKey }}</span>
        <UButton
          icon="i-heroicons-clipboard-document"
          size="sm"
          color="gray" 
          variant="ghost"
          @click="copyApiKeyToClipboard"
          aria-label="Copy API Key"
        />
      </div>
      <div v-else class="p-3 bg-gray-100 dark:bg-gray-800 rounded text-sm text-gray-500 italic">
        No API Key to display.
      </div>
    </div>

    <template #footer>
      <div class="text-right">
        <UButton @click="handleClose" label="I have copied the key" color="primary" />
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, toRefs } from 'vue';

const props = defineProps({
  apiKey: {
    type: String as () => string | null,
    required: true,
  },
});

const emit = defineEmits(['close']);

const { apiKey } = toRefs(props); // Make prop reactive if needed, though for display it might not be strictly necessary
const toast = useToast();

const copyApiKeyToClipboard = async () => {
  if (apiKey.value) {
    try {
      await navigator.clipboard.writeText(apiKey.value);
      toast.add({ title: 'Copied!', description: 'API Key copied to clipboard.', color: 'green' });
    } catch (err) {
      console.error('Failed to copy API key: ', err);
      toast.add({ title: 'Copy Failed', description: 'Could not copy key. Please copy it manually.', color: 'red' });
    }
  } else {
      toast.add({ title: 'Nothing to Copy', description: 'No API key available to copy.', color: 'orange' });
  }
};

const handleClose = () => {
  emit('close'); // Signal the parent to close the UModal and clear the key
};
</script>
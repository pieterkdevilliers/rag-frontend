<template>
  <UModal :model-value="isOpen" @update:model-value="$emit('update:isOpen', $event)">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            Confirm AI Database Update
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="$emit('close')" />
        </div>
      </template>
      <div v-if="ai_db_status">
        <UCheckbox
          v-model="replace"
          label="Replace or Update?"
          class="mb-4"
        />
      <p>Check this box to replace the existing AI Database with the latest documents, leave it unchecked to simply update your existing AI Database.</p>
      </div>

      <div class="p-4">
        <p>Are you sure you want to update the AI Database with the latest documents?</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">This action may take some time and cannot be undone easily.</p>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="gray" variant="ghost" @click="$emit('cancel')">
            Cancel
          </UButton>
          <UButton @click="$emit('confirm', replace)">
            Complete AI Database Update
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { ref, watch, computed } from 'vue';

const authStore = useAuthStore();
const ai_db_status = computed(
	() => authStore.processed_docs_count > 0
);

const props = defineProps<{
  isOpen: boolean;
  isProcessing?: boolean;
}>();

const replace = ref(false);

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    // Modal is opening
    replace.value = false;
  }
});

defineEmits(['update:isOpen', 'confirm', 'cancel', 'close']);
</script>
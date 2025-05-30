<template>
  <UModal :model-value="isOpen" @update:model-value="handleClose">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            Update Allowed Origins for Widget: {{ widget ? widget.name : 'New Widget' }}
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="handleClose" />
        </div>
      </template>

      <UForm :schema="schema" :state="state" class="space-y-4 p-4" @submit="submitForm">
        <UFormGroup label="Add allowed origins as a comma-separated list" name="allowed_origins" required>
          <UTextarea v-model="state.allowed_origins" />
        </UFormGroup>

        <div class="flex justify-end gap-2 pt-4">
          <UButton color="gray" variant="ghost" @click="handleClose">
            Cancel
          </UButton>
          <UButton type="submit" :loading="isLoading">
            Save Changes
          </UButton>
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue';
import { Schema, z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';

const props = defineProps<{
  isOpen: boolean;
  widget: { // The Widget object being edited
    id: number;
    allowed_origins: string[];
  } | null; // Allow null for when no Widget is selected
}>();

const emit = defineEmits(['update:isOpen', 'widgetUpdated', 'close']);

const toast = useToast();
const authStore = useAuthStore();
const account_unique_id = authStore.uniqueAccountId
const apiAuthorizationToken = authStore.access_token;

const isLoading = ref(false);

const schema = z.object({
  allowed_origins: z.string().min(1, 'Allowed origins are required').max(500, 'Allowed origins must be less than 500 characters'),
});

type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
  allowed_origins: props.widget ? props.widget.allowed_origins.join(', ') : '', // Initialize with widget data if available
});


watch(() => props.widget, (newWidget) => {
  if (newWidget) {
    state.allowed_origins = newWidget.allowed_origins.join(', '); // Update state when widget changes
  } else {
    state.allowed_origins = ''; // Reset if no widget is selected
  }
});

const handleClose = () => {
  emit('close'); // Emit close to parent
};

const submitForm = async (event: FormSubmitEvent<Schema>) => {
  if (!props.widget) return; // Should not happen if modal is open with a widget

  isLoading.value = true;
  try {

    const updatedWidgetData = await $fetch(`https://fastapi-rag-2705cfd4c41a.herokuapp.com/api/v1/update-api-key/${account_unique_id}/${props.widget.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json', // Usually for PUT with JSON body
        'accept': 'application/json',
        'Authorization': `Bearer ${apiAuthorizationToken}`,
      },
      body: {
        allowed_origins: event.data.allowed_origins.split(',').map(item => item.trim()), // Convert string back to array
      },
    });

    toast.add({ title: 'Widget Updated', description: `Widget has been updated.`, color: 'green' });
    emit('widgetUpdated', updatedWidgetData); // Emit event with the updated widget data from API
    handleClose(); // Close the modal
  } catch (error: any) {
    console.error('Error updating widget:', error);
    const errorMessage = error.data?.detail || error.message || 'Could not update widget.';
    toast.add({ title: 'Error', description: errorMessage, color: 'red' });
  } finally {
    isLoading.value = false;
  }
};
</script>
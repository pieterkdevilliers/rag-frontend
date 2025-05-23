<template>
  <UModal :model-value="isOpen" @update:model-value="handleClose">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            Edit User
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="handleClose" />
        </div>
      </template>

      <UForm :schema="schema" :state="state" class="space-y-4 p-4" @submit="submitForm">
        <UFormGroup label="Password" name="Password">
          <UInput v-model="state.user_password" />
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
import { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';

const props = defineProps<{
  isOpen: boolean;
  user: { // The User object being edited
    id: number;
    password: string;
    name: string;
    email: string;
  } | null; // Allow null for when no User is selected
}>();

const emit = defineEmits(['update:isOpen', 'userUpdated', 'close']);

const toast = useToast();
const authStore = useAuthStore();
const account_unique_id = authStore.uniqueAccountId
const apiAuthorizationToken = authStore.access_token;

const isLoading = ref(false);

// Zod schema for validation
const schema = z.object({
  user_password: z.string().min(1, 'User password cannot be empty'),
});

type Schema = z.output<typeof schema>;

// Form state
const state = reactive<Schema>({
  user_password: '',
});

// // Watch for changes in the user prop to update the form state
// watch(() => props.user, (newUser) => {
//   if (newUser) {
//     state.user_password = newUser.user_password;
//   } else {
//     state.user_password = ''; // Reset if no user
//   }
// }, { immediate: true });


const handleClose = () => {
  emit('close'); // Emit close to parent
};

const submitForm = async (event: FormSubmitEvent<Schema>) => {
  if (!props.user) return; // Should not happen if modal is open with a user

  isLoading.value = true;
  try {

    const updatedUserData = await $fetch(`https://fastapi-rag-2705cfd4c41a.herokuapp.com/api/v1/users/${account_unique_id}/${props.user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json', // Usually for PUT with JSON body
        'accept': 'application/json',
        'Authorization': `Bearer ${apiAuthorizationToken}`,
      },
      body: {
        user_password: event.data.user_password, // Send only the updated password
        // Include other fields if your API expects them for an update
      },
    });

    toast.add({ title: 'User Updated', description: `User has been updated.`, color: 'green' });
    emit('userUpdated', updatedUserData); // Emit event with the updated user data from API
    handleClose(); // Close the modal
  } catch (error: any) {
    console.error('Error updating user:', error);
    const errorMessage = error.data?.detail || error.message || 'Could not update user.';
    toast.add({ title: 'Error', description: errorMessage, color: 'red' });
  } finally {
    isLoading.value = false;
  }
};
</script>
<template>
    <div class="max-w-md mx-auto p-4">
        <form @submit.prevent="handleAddFolder">
        <h2 class="text-2xl font-bold mb-4">Add New Folder</h2>
        <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700" for="folder_name">Folder Name</label>
            <UInput
            v-model="folder_name"
            id="folder_name"
            type="text"
            placeholder="Enter new folder name"
            autocomplete="off"
            />
        </div>
        <UButton
            type="submit"
            icon="i-heroicons:folder-plus"
            label="Add New Folder"
        >
        </UButton>
        </form>
        <p v-if="errorMessage" class="text-red-600 mt-4">{{ errorMessage }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';

const emit = defineEmits(['close', 'folderAdded']);
const authStore = useAuthStore();
const router = useRouter();

const folder_name = ref('');
const errorMessage = ref('');
const uniqueAccountId = authStore.uniqueAccountId;
const apiAuthorizationToken = authStore.access_token;

const handleAddFolder = async () => {
  try {
    const response = await fetch(`https://fastapi-rag-2705cfd4c41a.herokuapp.com/api/v1/folders/${uniqueAccountId}/${folder_name.value}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        accept: 'application/json',
        Authorization: `Bearer ${apiAuthorizationToken}`,
      },
    });
    emit('close');
    emit('folderAdded')

    if (!response.ok) {
      throw new Error('Failed to add new folder');
    }

    // Redirect to a secure route
    router.push('/folders');
  } catch (error) {
    console.error('Error:', error);
    errorMessage.value = 'Unable to add Folder. Please check your credentials.';
  }
};
</script>

<style scoped>
/* Add Tailwind CSS or custom styles here */
</style>
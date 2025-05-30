<template>
    <div class="max-w-md mx-auto p-4">
        <form @submit.prevent="handleAddWidget">
        <h2 class="text-2xl font-bold mb-4">Add New Widget</h2>
        <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700" for="name">Widget Name</label>
            <UInput
            v-model="name"
            id="name"
            type="text"
            placeholder="Enter new widget name"
            autocomplete="off"
            />
        </div>
        <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700" for="allowed_origins">Allowed Origins</label>
            <UTextarea
            v-model="allowed_origins"
            id="allowed_origins"
            type="text"
            placeholder="Enter allowed origins (comma-separated)"
            autocomplete="off"
            />
        </div>
        <UButton
            type="submit"
            icon="i-heroicons:command-line"
            label="Add New Widget"
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

const emit = defineEmits(['close', 'widgetAdded']);
const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

const name = ref('');
const allowed_origins = ref('');
const errorMessage = ref('');
const uniqueAccountId = authStore.uniqueAccountId;

const handleAddWidget = async () => {

    const widgetName = name.value;

  if (!widgetName || widgetName.trim() === '') {
    toast.add({ title: 'Error', description: 'Widget name is required.', color: 'red' });
    return;
  }

  try {

    // Prepare the data for the body
    const requestBody = {
      name: widgetName.trim(), // Add the name
      allowed_origins: allowed_origins.value.split(',').map(item => item.trim()).filter(item => item.length > 0), // Also filter out empty strings from ",,,"
    };

    const response = await fetch(`https://fastapi-rag-2705cfd4c41a.herokuapp.com/api/v1/create-api-key/${uniqueAccountId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
        body: JSON.stringify(requestBody),
    });

    if (response.ok){
      toast.add({ title: 'Success', description: 'Widget added successfully!', color: 'green' });
      emit('close');
      emit('widgetAdded');
      // Redirect to a secure route
      router.push('/web-widgets');
    }
    else {
      const errorData = await response.json();
      errorMessage.value = errorData.detail || 'Failed to add widget.';
      toast.add({ title: 'Error', description: errorMessage.value, color: 'red' });
    }



  } catch (error: any) {
    console.error('Error:', error);
    const errorMessage = error.data?.detail || error.message || 'Could not update widget.';
    toast.add({ title: 'Error', description: errorMessage, color: 'red' });
  }
};
</script>

<style scoped>
/* Add Tailwind CSS or custom styles here */
</style>
<template>
    <div class="max-w-md mx-auto p-4">
        <form @submit.prevent="handleAddUser">
        <h2 class="text-2xl font-bold mb-4">Add New User</h2>
        <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700" for="username">Email Address</label>
            <UInput
            v-model="username"
            id="username"
            type="text"
            placeholder="Enter new user email address"
            autocomplete="off"
            />
        </div>
        <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700" for="password">Password</label>
            <UInput
            v-model="password"
            id="password"
            type="password"
            placeholder="Set new user password"
            autocomplete="off"
            />
        </div>
        <UButton
            type="submit"
            icon="i-heroicons:user-plus"
            label="Add New User"
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

const emit = defineEmits(['close', 'userAdded']);
const authStore = useAuthStore();
const router = useRouter();

const username = ref('');
const password = ref('');
const errorMessage = ref('');
const uniqueAccountId = authStore.uniqueAccountId;
const apiAuthorizationToken = authStore.access_token;


const handleAddUser = async () => {
  const currentUserPayload = {
    user_email: username.value,
    user_password: password.value
  };
  console.log('User Payload:', currentUserPayload);
  try {
    const response = await fetch(`https://fastapi-rag-2705cfd4c41a.herokuapp.com/api/v1/users/${uniqueAccountId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        Authorization: `Bearer ${apiAuthorizationToken}`
      },
      body: JSON.stringify(currentUserPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('User creation error:', errorData);
      throw new Error(errorData.detail || 'Failed to create user');
    }
    emit('close');
    emit('userAdded');
    // Redirect to a secure route
    router.push('/users');
  } catch (error) {
    console.error('Error:', error);
    errorMessage.value = 'Unable to add User. Please check your credentials.';
  }

    const emailPayload = {
      to_email: username.value,
      subject: 'Welcome to Our Service',
      message: `Hello ${username.value},\n\nYou've been added as a user.\n\nBest regards,\nThe Team`,
      account_unique_id: authStore.uniqueAccountId,
    }

  const send_welcome_email = await fetch(`https://fastapi-rag-2705cfd4c41a.herokuapp.com/api/v1/send-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify(emailPayload),
    
  });
};
</script>

<style scoped>
/* Add Tailwind CSS or custom styles here */
</style>
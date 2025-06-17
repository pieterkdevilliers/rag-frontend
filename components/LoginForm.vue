<template>
    <div class="max-w-md mx-auto p-4">
        <form @submit.prevent="handleLogin">
        <h2 class="text-2xl font-bold mb-4">Login</h2>
        <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700" for="username">Email Address</label>
            <UInput
            v-model="username"
            id="username"
            type="text"
            placeholder="Enter your email address"
            autocomplete="off"
            />
        </div>
        <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700" for="password">Password</label>
            <UInput
            v-model="password"
            id="password"
            type="password"
            placeholder="Enter your password"
            autocomplete="off"
            />
        </div>
        <UButton
            type="submit"
            icon="i-heroicons:arrow-right-end-on-rectangle"
            label="Login"
        >
        </UButton>
        </form>
        <p v-if="errorMessage" class="text-red-600 mt-4">{{ errorMessage }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const username = ref('');
const password = ref('');
const errorMessage = ref('');

const handleLogin = async () => {
  try {
    const formData = new URLSearchParams();
    formData.append('username', username.value);
    formData.append('password', password.value);

    const response = await fetch('https://fastapi-rag-2705cfd4c41a.herokuapp.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        accept: 'application/json',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const data = await response.json();
    console.log('Response:', data);
    const uniqueAccountId = data.account_unique_id;
    const access_token = data.access_token;
    authStore.setUniqueAccountId(uniqueAccountId);
    authStore.setAuthToken(access_token);


    // Redirect to a secure route
    router.push('/users');
  } catch (error) {
    console.error('Error:', error);
    errorMessage.value = 'Login failed. Please check your credentials.';
  }
};
</script>

<style scoped>
/* Add Tailwind CSS or custom styles here */
</style>
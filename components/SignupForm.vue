<template>
    <div class="max-w-md mx-auto p-4">
        <form @submit.prevent="handleSignup">
        <h2 class="text-2xl font-bold mb-4">Create your account</h2>
        <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700" for="username">Username</label>
            <UInput
            v-model="username"
            id="username"
            type="text"
            placeholder="Enter your username"
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
        <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700" for="password">Account Organisation</label>
            <UInput
            v-model="account_organisation"
            id="account_organisation"
            type="text"
            placeholder="Enter your comapny name"
            autocomplete="off"
            />
        </div>
        <UButton
            type="submit"
            label='Create Account'
            variant="solid"
            icon="i-heroicons:squares-plus"
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
const account_organisation = ref('');
const errorMessage = ref('');

const handleSignup = async () => {
  try {
    const formData = new URLSearchParams();
    formData.append('username', username.value);
    formData.append('password', password.value);
    formData.append('account_organisation', account_organisation.value);

    const account = await fetch(`https://fastapi-rag-2705cfd4c41a.herokuapp.com/api/v1/accounts/${account_organisation.value}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        accept: 'application/json',
      },
      body: formData.toString(),
    });

    if (!account.ok) {
      throw new Error('Unable to create account');
    }

    const data = await account.json();
    console.log('Response:', data);
    const uniqueAccountId = data.account_unique_id;
    console.log('Unique Account ID:', uniqueAccountId);
    
    authStore.setUniqueAccountId(uniqueAccountId);

    const user = await fetch(`https://fastapi-rag-2705cfd4c41a.herokuapp.com/api/v1/users/${uniqueAccountId}/${username.value}/${password.value}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        accept: 'application/json',
      },
      body: formData.toString(),
    });

    if (!user.ok) {
      throw new Error('Unable to create user');
    }
    // Redirect to a secure route
    router.push('/login');
  } catch (error) {
    console.error('Error:', error);
    errorMessage.value = 'Login failed. Please check your credentials.';
  }
};
</script>

<style scoped>
/* Add Tailwind CSS or custom styles here */
</style>
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
        <UButton
            to="/forgot-password"
            icon="i-heroicons:arrow-path"
            label="Reset Password"
        >
        </UButton>
        </form>
        <p v-if="errorMessage" class="text-red-600 mt-4">{{ errorMessage }}</p>
    </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const myApiUrl = config.public.apiBaseURL;

// This will log on the server (in your terminal/docker logs) AND on the client (browser console)
console.log('RUNTIME CONFIG - apiBaseURL IS:', myApiUrl);
onMounted(() => {
  // This will log ONLY on the client (in your browser console)
  console.log('CLIENT MOUNTED - apiBaseURL IS:', config.public.apiBaseURL);
});
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const username = ref('');
const password = ref('');
const errorMessage = ref('');

const handleLogin = async () => {
	try {
		const formData = new URLSearchParams();
		formData.append('username', username.value);
		formData.append('password', password.value);

		const response = await fetch(
			`${config.public.apiBase}/token`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					accept: 'application/json',
				},
				body: formData.toString(),
			}
		);

		if (!response.ok) {
			throw new Error('Invalid credentials');
		}

		const data = await response.json();
		console.log('Response:', data);
		const uniqueAccountId = data.account_unique_id;
		const access_token = data.access_token;
    const accountOrganisation = data.account_organisation
    const docsCount = data.docs_count
    const subsStatus = data.active_subscription
		authStore.setUniqueAccountId(uniqueAccountId);
		authStore.setAuthToken(access_token);
    authStore.setAccountOrganisation(accountOrganisation);
    authStore.setDocsCount(docsCount);
    authStore.setSubsStatus(subsStatus)


    if (response.ok) {
      // CHECK for a redirect path in the URL query
      const redirectPath = route.query.redirect as string | undefined;
      console.log("Docs Count in AuthStore: ", docsCount)
      console.log("Subs Status in AuthStore: ", subsStatus)

      // If a redirect path exists, go there. Otherwise, go to a default page.
      if (redirectPath) {
        router.push(redirectPath);
      } else {

        router.push('/chats');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      errorMessage.value = 'Login failed. Please check your credentials.';
    }
  }

</script>

<style scoped>
/* Add Tailwind CSS or custom styles here */
</style>

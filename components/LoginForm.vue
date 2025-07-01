<template>
	<div class="form-component login-form">
		<h1 class="heading heading--1">Login</h1>
		<form @submit.prevent="handleLogin">
			<div class="form__label-fields">
				<div class="form__label-field">
					<label class="form__label" for="username"
						>Email Address</label
					>
					<UInput
						v-model="username"
						id="username"
						type="text"
						placeholder="Enter your email address"
						autocomplete="off"
					/>
				</div>
				<div class="form__label-field">
					<label class="form__label" for="password">Password</label>
					<UInput
						v-model="password"
						id="password"
						type="password"
						placeholder="Enter your password"
						autocomplete="off"
					/>
				</div>
				<div class="form__button-container">
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
						size="xs"
						class="ms-3"
						variant="link"
					>
					</UButton>
				</div>
			</div>
		</form>
		<p v-if="errorMessage" class="text-red-600 mt-4">{{ errorMessage }}</p>
	</div>
</template>

<script setup lang="ts">

import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';

const config = useRuntimeConfig();
const myApiUrl = config.public.apiBaseURL;

// This will log on the server (in your terminal/docker logs) AND on the client (browser console)
console.log('RUNTIME CONFIG - apiBaseURL IS:', myApiUrl);
onMounted(() => {
	// This will log ONLY on the client (in your browser console)
	console.log('CLIENT MOUNTED - apiBaseURL IS:', config.public.apiBaseURL);
});


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

		const response = await fetch(`${config.public.apiBase}/token`, {
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
		const accountOrganisation = data.account_organisation;
		const docsCount = data.docs_count;
		const subsStatus = data.active_subscription;
		const processed_docs_count = data.processed_docs_count
		authStore.setUniqueAccountId(uniqueAccountId);
		authStore.setAuthToken(access_token);
		authStore.setAccountOrganisation(accountOrganisation);
		authStore.setDocsCount(docsCount);
		authStore.setSubsStatus(subsStatus);
		authStore.setProcessedDocsCount(processed_docs_count);

		if (response.ok) {
			// CHECK for a redirect path in the URL query
			const redirectPath = route.query.redirect as string | undefined;
			console.log('Docs Count in AuthStore: ', docsCount);
			console.log('Subs Status in AuthStore: ', subsStatus);
			console.log('Processed Docs Count in AuthStore: ', processed_docs_count);

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
};
</script>

<style scoped>
/* Add Tailwind CSS or custom styles here */
</style>

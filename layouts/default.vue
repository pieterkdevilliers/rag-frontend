<template>
	<div class="layout layout--default">
		<header class="main-header">
			<div
				class="container mx-auto px-4 py-2 flex justify-between items-center"
			>
				<h1>
					<span>YourDocsAI</span>
				</h1>
				<Navbar />
			</div>
		</header>
		<div class="container container--full mx-auto">
			<slot />
		</div>
		<footer>
			<div class="container mx-auto p-4 text-center">
				<p class="text-center text-sm text-gray-500">
					&copy; {{ new Date().getFullYear() }} YourDocsAI. All rights
					reserved.
				</p>
				<p> Privacy Policy <a href="/privacy-policy" class="text-blue-500">here</a>.</p>
				<p> Terms of Service <a href="/terms-of-service" class="text-blue-500">here</a>.</p>
			</div>
		</footer>
	</div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
import { ref, computed, watchEffect } from 'vue';
import { useAuthStore } from '~/stores/auth';
import Navbar from '~/components/Navbar.vue';

const authStore = useAuthStore();

// Make `account_unique_id` reactive by deriving it from the store
const account_unique_id = computed(() => authStore.uniqueAccountId || null);
const account_organisation = ref('');

// Watch for changes in `account_unique_id` and fetch details
watchEffect(async () => {
	if (account_unique_id.value) {
		try {
			const apiAuthorizationToken = authStore.access_token;
			const { data: account, error } = await useFetch(
				`${config.public.apiBase}/accounts/${account_unique_id.value}`,
				{
					method: 'GET',
					headers: {
						accept: 'application/json',
						Authorization: `Bearer ${apiAuthorizationToken}`,
					},
				}
			);
			if (account.value?.account) {
				account_organisation.value =
					account.value.account.account_organisation;
			} else {
				console.error('Failed to fetch account details:', error.value);
			}
		} catch (error) {
			console.error('Error fetching account details:', error);
		}
	} else {
		account_organisation.value = '';
	}
});
</script>

<style scoped>
/* Apply styles when the link is active
  :deep(.router-link-exact-active) {
    @apply bg-white text-[#08bfb3] px-3 py-2 rounded-md text-sm;
  } */
</style>

<template>
	<div class="layout layout--default">
		<header class="main-header">
			<div
				class="container mx-auto px-4 py-2 flex justify-between items-center"
			>
				<div class="logo">
					<img src="../assets/images/logo-w100.png" alt="" />
					<span><strong>YourDocs</strong>AI</span>
				</div>
				<Navbar />
			</div>
		</header>
		<div class="container container--full mx-auto">
			<slot />
		</div>
		<Footer />
	</div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
import { ref, computed, watchEffect } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useHead, useRoute } from '#imports';
import Navbar from '~/components/Navbar.vue';
import Footer from '~/components/Footer.vue';

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

// Add current page as a class to the body tag
const route = useRoute();

// This computed property will generate a class name like:
// - /         -> 'page-home'
// - /about    -> 'page-about'
// - /user/id  -> 'page-user-id'
const bodyClass = computed(() => {
	if (route.path === '/') {
		return 'page-home';
	}
	// Takes the path, removes the leading '/', and replaces other '/' with '-'
	return `page-${route.path.slice(1).replace(/\//g, '-')}`;
});

useHead({
	bodyAttrs: {
		// Use the reactive computed property here
		class: bodyClass,
	},
});
</script>

<style scoped>
/* Apply styles when the link is active
  :deep(.router-link-exact-active) {
    @apply bg-white text-[#08bfb3] px-3 py-2 rounded-md text-sm;
  } */
</style>

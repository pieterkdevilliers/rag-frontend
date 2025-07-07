<template>
	<div class="layout layout--user_access">
		<header class="main-header">
			<div
				class="container mx-auto px-4 py-2 flex justify-between items-center"
			>
				<h1 class="font-bold text-xl text-primary">
					<span v-if="account_organisation">
						{{ account_organisation }}
					</span>
					<span v-else> YourDocsAI </span>
				</h1>
				<Navbar />
			</div>
		</header>
		<div class="container mx-auto p-4">
			<slot />
		</div>
		<footer>
			<div class="container mx-auto p-4 text-center">
				<Queries />
			</div>
		</footer>

		<!-- Add UNotifications here -->
		<UNotifications />
	</div>
</template>

<script setup lang="ts">
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { ref, computed, watchEffect, onMounted, nextTick, onBeforeUnmount } from 'vue';
import Queries from '~/components/Queries.vue';
import { useAuthStore } from '~/stores/auth';
import Navbar from '~/components/Navbar.vue';

const config = useRuntimeConfig();
const authStore = useAuthStore();
const isDesktop = ref(false);

// Make `account_unique_id` reactive by deriving it from the store
const account_unique_id = computed(() => authStore.uniqueAccountId || null);
const account_organisation = ref('');

onMounted(() => {
    // Tailwind's `lg` breakpoint is 1024px.
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    
    // Set the initial value
    isDesktop.value = mediaQuery.matches;

    // Update the value whenever the viewport size changes
    const onMediaChange = (e: MediaQueryListEvent) => {
        isDesktop.value = e.matches;
    };

    mediaQuery.addEventListener('change', onMediaChange);

    // Clean up the listener when the component is unmounted
    onBeforeUnmount(() => {
        mediaQuery.removeEventListener('change', onMediaChange);
    });
});

// --- UPDATED: The final trigger for the tour ---
const shouldStartTour = computed(() => {
    // All three conditions must be true
    return authStore.docs_count === 0 && 
           authStore.uniqueAccountId !== null && 
           isDesktop.value;
});

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


watch(shouldStartTour, (shouldShow) => {
	// Check if the tour should be shown
	if (shouldShow) {
		// 2. Wrap the driver logic in nextTick
		nextTick(() => {
			// Now, the DOM is updated and the Navbar elements should exist
			const driverObj = driver({
				showProgress: true,
				steps: [
					{
						element: '#chats-button',
						popover: {
							title: 'Chat Sessions',
							description:
								'View chat history including questions and answers.',
						},
					},
					{
						element: '#users-button',
						popover: {
							title: 'Users',
							description: 'Add or remove users from your account.',
						},
					},
					{
						element: '#documents-button',
						popover: {
							title: 'Documents',
							description:
								'Add folder and documents, and process the files into your AI Database when ready.',
						},
					},
					{
						element: '#widgets-button',
						popover: {
							title: 'Web Widgets',
							description:
								'Generate your API Key and Web-Widget, to add to your website, for your visitors to use.',
						},
					},
					{
						element: '#account-button',
						popover: {
							title: 'Your Account',
							description: 'View and manage your subscription and notification webhook.',
						},
					},
					{
						element: '#dashboard-button',
						popover: {
							title: 'Your Dashboard',
							description: 'Dashboard showing account ussage stats.',
						},
					},
				],
			});
			console.log('chats-button check: ', document.querySelector('#chats-button'));

			driverObj.drive();
		});
	}
}, { immediate: true });
</script>

<style scoped>
/* Apply styles when the link is active
  :deep(.router-link-exact-active) {
    @apply bg-white text-[#08bfb3] px-3 py-2 rounded-md text-sm;
  } */
</style>

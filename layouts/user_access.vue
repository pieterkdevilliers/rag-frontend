<template>
	<div class="layout layout--user_access">
		<header class="main-header">
			<div
				class="container mx-auto px-4 py-2 flex justify-between items-center"
			>
				<ClientOnly>
					<h1 class="font-bold text-xl text-primary">
						<span v-if="account_organisation">
							{{ account_organisation }}
						</span>
						<div v-else class="logo">
							<img
								src="../assets/images/logo-w50-inverse-purple.png"
								alt=""
							/>
							<span><strong>YourDocs</strong>AI</span>
						</div>
					</h1>
					<template #fallback>
						<!-- Optional: A placeholder that shows while waiting for client render -->
						<h1 class="font-bold text-xl text-primary">
							<span>YourDocsAI</span>
						</h1>
					</template>
				</ClientOnly>
				<Navbar />
			</div>
		</header>
		<div class="container mx-auto p-4">
			<slot />
			<Queries />
		</div>
		<Footer />

		<!-- Add UNotifications here -->
		<UNotifications />
	</div>
</template>

<script setup lang="ts">
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { ref, computed, watchEffect, onMounted } from 'vue';
import Queries from '~/components/Queries.vue';
import { useAuthStore } from '~/stores/auth';
import { useHead, useRoute } from '#imports';
import Navbar from '~/components/Navbar.vue';
import Footer from '~/components/Footer.vue';

const config = useRuntimeConfig();
const authStore = useAuthStore();

// Make `account_unique_id` reactive by deriving it from the store
const account_unique_id = computed(() => authStore.uniqueAccountId || null);
const account_organisation = ref('');
const showTour = computed(() => authStore.docs_count === 0);

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

// This will be used to determine if the tour should be shown
onMounted(() => {
	// const showTour = ref(true); // Turn on tour for testing
	if (showTour.value) {
		const driverObj = driver({
			popoverClass: 'tour-popover',
			showProgress: true,
			steps: [
				{
					element: '#nav-link-chats',
					popover: {
						title: 'Chats',
						description:
							'View chat history including questions and answers.',
					},
				},
				{
					element: '#nav-link-users',
					popover: {
						title: 'Users',
						description: 'Add or remove users from your account.',
					},
				},
				{
					element: '#nav-link-documents',
					popover: {
						title: 'Documents',
						description:
							'Add folder and documents, and process the files into your AI Database when ready.',
					},
				},
				{
					element: '#nav-link-web-widgets',
					popover: {
						title: 'Web Widgets',
						description:
							'Generate your API Key and Web-Widget, to add to your website, for your visitors to use.',
					},
				},
				{
					element: '#nav-link-accounts',
					popover: {
						title: 'Your Account',
						description: 'View and manage your subscription.',
					},
				},
				// {
				// 	element: '#nav-link-dashboards',
				// 	popover: {
				// 	},
				// },
			],
		});
		driverObj.drive();
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

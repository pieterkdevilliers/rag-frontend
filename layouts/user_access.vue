<template>
	<div class="layout--user_access">
		<header class="shadow-sm bg-white">
			<div class="container mx-auto p-4 flex justify-between">
				<h1 class="font-bold text-xl text-primary">
					<span v-if="account_organisation">
						{{ account_organisation }}
					</span>
					<span v-else> YourDocsAI </span>
				</h1>
				<Navbar />
				<!-- <ul class="flex gap-4 flex-wrap">
					<li>
						<UButton
							v-if="!account_unique_id"
							to="/"
							label="Home"
							icon="i-heroicons:home"
						>
						</UButton>
					</li>
					<li v-if="!account_unique_id">
						<UButton
							to="/login"
							icon="i-heroicons:arrow-right-end-on-rectangle"
							label="Login"
						>
						</UButton>
					</li>
					<li v-if="account_unique_id" id="chats-button">
						<UButton
							to="/chats"
							label="Chat Sessions"
							icon="i-heroicons:chat-bubble-bottom-center-text"
						>
						</UButton>
					</li>
					<li v-if="account_unique_id" id="users-button">
						<UButton
							to="/users"
							label="Users"
							icon="i-heroicons:users"
						>
						</UButton>
					</li>
					<li v-if="account_unique_id" id="documents-button">
						<UButton
							to="/folders"
							label="Documents"
							icon="i-heroicons:document-magnifying-glass"
						>
						</UButton>
					</li>
					<li v-if="account_unique_id" id="widgets-button">
						<UButton
							to="/web-widgets"
							label="Web Widgets"
							icon="i-heroicons:code-bracket"
						>
						</UButton>
					</li>
					<li v-if="account_unique_id" id="account-button">
						<UButton
							to="/accounts"
							label="My Account"
							icon="i-heroicons:user-circle"
						>
						</UButton>
					</li>
					<li v-if="account_unique_id">
						<UButton
							to="/login"
							label="Logout"
							icon="i-heroicons:arrow-left-end-on-rectangle"
						>
						</UButton>
					</li>
				</ul> -->
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
import { ref, computed, watchEffect, onMounted } from 'vue';
import Queries from '~/components/Queries.vue';
import { useAuthStore } from '~/stores/auth';
import Navbar from '~/components/Navbar.vue';

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

import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

onMounted(() => {
	if (showTour.value) {
		const driverObj = driver({
			showProgress: true,
			steps: [
				{
					element: '#chats-button',
					popover: {
						title: 'Chats',
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
						description: 'View and manage your subscription.',
					},
				},
			],
		});
		driverObj.drive();
	}
});
</script>

<style scoped>
/* Apply styles when the link is active
  :deep(.router-link-exact-active) {
    @apply bg-white text-[#08bfb3] px-3 py-2 rounded-md text-sm;
  } */
</style>

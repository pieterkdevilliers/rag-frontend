<template>
	<header class="shadow-sm bg-white">
		<nav class="container mx-auto p-4 flex justify-between">
			<h1 class="text-xl text-primary">{{ account_organisation }}</h1>
			<ul class="flex gap-4">
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
				<li v-if="account_unique_id">
					<UButton
						to="/chats"
						label="Chat Sessions"
						icon="i-heroicons:chat-bubble-bottom-center-text"
					>
					</UButton>
				</li>
				<li v-if="account_unique_id">
					<UButton to="/users" label="Users" icon="i-heroicons:users">
					</UButton>
				</li>
				<li v-if="account_unique_id">
					<UButton
						to="/folders"
						label="Documents"
						icon="i-heroicons:document-magnifying-glass"
					>
					</UButton>
				</li>
				<li v-if="account_unique_id">
					<UButton
						to="/web-widgets"
						label="Web Widgets"
						icon="i-heroicons:code-bracket"
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
			</ul>
		</nav>
	</header>
	<div class="container mx-auto p-4">
		<slot />
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import { useAuthStore } from '~/stores/auth';

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
				`https://fastapi-rag-2705cfd4c41a.herokuapp.com/api/v1/accounts/${account_unique_id.value}`,
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

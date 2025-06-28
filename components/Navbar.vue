<template>
	<!-- Mobile -->
	<div>
		<UButton
			@click="navOpen = !navOpen"
			:icon="navOpen ? 'i-heroicons:x-mark' : 'i-heroicons:bars-3'"
			:class="'md:hidden'"
		>
		</UButton>
		<nav>
			<UVerticalNavigation
				:links="
					!isAuthenticated ? LoggedOutMenuItems : LoggedInMenuItems
				"
				:class="navOpen ? '' : 'hidden'"
			>
			</UVerticalNavigation>
		</nav>
	</div>
	<!-- Desktop -->
	<nav class="hidden md:block">
		<UHorizontalNavigation :links="menuItems"> </UHorizontalNavigation>
	</nav>
	<p>Nav Open: {{ navOpen }}</p>
	<p>Logged In: {{ isAuthenticated }}</p>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '~/stores/auth';
import type { NavigationMenuItem } from '@nuxt/ui';
const authStore = useAuthStore();
const account_unique_id = ref(authStore.uniqueAccountId || null);
// const isAuthenticated = ref(!!account_unique_id.value);
const isAuthenticated = computed(() => authStore.uniqueAccountId !== null);
const navOpen = ref(false);

const LoggedOutMenuItems: NavigationMenuItem[] = [
	{
		label: 'Home',
		to: '/',
		icon: 'i-heroicons:home',
		type: 'label',
	},
	{
		label: 'Login',
		to: '/login',
		icon: 'i-heroicons:user-circle',
	},
];

const LoggedInMenuItems = ref<NavigationMenuItem[]>([
	{
		label: 'Home',
		to: '/',
		icon: 'i-heroicons:home',
		type: 'label',
	},
	{
		label: 'About',
		to: '/about',
	},
	{
		label: 'Contact',
		to: '/contact',
	},
]);
</script>

<style scoped></style>

<template>
	<!-- Mobile -->
	<div class="md:hidden">
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
				:class="[navOpen ? '' : 'hidden', 'nav--vertical']"
			>
			</UVerticalNavigation>
		</nav>
	</div>
	<!-- Desktop -->
	<nav class="hidden md:block">
		<UHorizontalNavigation
			:links="!isAuthenticated ? LoggedOutMenuItems : LoggedInMenuItems"
			:class="'nav--horizontal'"
		>
		</UHorizontalNavigation>
	</nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '~/stores/auth';
const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.uniqueAccountId !== null);
const navOpen = ref(false);

interface NavigationMenuItem {
	label: string;
	to: string;
	icon: string;
	type: 'label' | 'link';
}

const LoggedOutMenuItems = ref<NavigationMenuItem[]>([
	{
		label: 'Login',
		to: '/login',
		icon: 'i-heroicons:arrow-right-end-on-rectangle',
		type: 'link',
	},
]);

const LoggedInMenuItems = ref<NavigationMenuItem[]>([
	{
		label: 'Chat Sessions',
		to: '/chats',
		icon: 'i-heroicons:chat-bubble-bottom-center-text',
		type: 'link',
	},
	{
		label: 'Users',
		to: '/users',
		icon: 'i-heroicons:users',
		type: 'link',
	},
	{
		label: 'Documents',
		to: '/folders',
		icon: 'i-heroicons:document-magnifying-glass',
		type: 'link',
	},
	{
		label: 'Web Widgets',
		to: '/web-widgets',
		icon: 'i-heroicons:code-bracket',
		type: 'link',
	},
	{
		label: 'My Account',
		to: '/accounts',
		icon: 'i-heroicons:user-circle',
		type: 'link',
	},
	{
		label: 'Logout',
		to: '/login',
		icon: 'i-heroicons:arrow-left-end-on-rectangle',
		type: 'link',
	},
]);
</script>

<style scoped></style>

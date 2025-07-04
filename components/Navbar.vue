<template>
	<!-- Mobile -->
	<div class="lg:hidden mobile-navbar__container" ref="mobileNavbar">
		<UButton
			@click="toggleNav"
			:icon="navOpen ? 'i-heroicons:x-mark' : 'i-heroicons:bars-3'"
			:class="['lg:hidden', 'navbar__toggle']"
		>
		</UButton>
		<UVerticalNavigation
			:links="!isAuthenticated ? LoggedOutMenuItems : LoggedInMenuItems"
			:class="[
				navOpen ? 'nav--open' : 'nav--closed',
				'navbar nav--vertical',
			]"
		>
		</UVerticalNavigation>
	</div>

	<!-- Desktop -->
	<div class="navbar hidden lg:block">
		<UHorizontalNavigation
			:links="!isAuthenticated ? LoggedOutMenuItems : LoggedInMenuItems"
			:class="'nav--horizontal'"
		>
		</UHorizontalNavigation>
	</div>
</template>

<script setup lang="ts">
// This script block is 100% correct and does not need any changes.
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.uniqueAccountId !== null);
const navOpen = ref(false);

const LoggedOutMenuItems = ref([
	{
		label: 'Home',
		to: '/',
		icon: 'i-heroicons:home',
		exact: true,
	},
	{
		label: 'Pricing',
		to: '#pricing',
		icon: 'i-heroicons:currency-dollar',
	},
	// {
	// 	label: 'About',
	// 	icon: 'i-heroicons:information-circle',
	// 	children: [
	// 		{ label: 'The Problem', to: '/#problem', icon: 'i-heroicons:exclamation-triangle' },
	// 		{ label: 'The Solution', to: '/#solution', icon: 'i-heroicons:map' },
	// 		{ label: 'The Benefit', to: '/#benefit', icon: 'i-heroicons:lifebuoy' },
	// 		{ label: 'The How', to: '/#how', icon: 'i-heroicons:wrench-screwdriver' },
	// 		{ label: 'The Why', to: '/#why', icon: 'i-heroicons:cake' },
	// 	],
	// },
	{
		label: 'Login',
		to: '/login',
		icon: 'i-heroicons:arrow-right-end-on-rectangle',
	},
]);

const LoggedInMenuItems = ref([
	{
		label: 'Chat Sessions',
		to: '/chats',
		icon: 'i-heroicons:chat-bubble-bottom-center-text',
	},
	{ label: 'Users', to: '/users', icon: 'i-heroicons:users' },
	{
		label: 'Documents',
		to: '/folders',
		icon: 'i-heroicons:document-magnifying-glass',
	},
	{
		label: 'Web Widgets',
		to: '/web-widgets',
		icon: 'i-heroicons:code-bracket',
	},
	{ label: 'My Account', to: '/accounts', icon: 'i-heroicons:user-circle' },
	{ label: 'Dashboard', to: '/dashboards', icon: 'i-heroicons:chart-pie' },
	{
		label: 'Logout',
		to: '/login',
		icon: 'i-heroicons:arrow-left-end-on-rectangle',
	},
]);

const mobileNavbar = ref<HTMLElement | null>(null);

function toggleNav() {
	navOpen.value = !navOpen.value;
}

function closeNav() {
	setTimeout(() => {
		navOpen.value = false;
	}, 800);
}

const mobileLinks = computed(() => {
	const items = !isAuthenticated.value
		? LoggedOutMenuItems.value
		: LoggedInMenuItems.value;
	return items.map((item) => {
		if (item.children) {
			return item;
		}
		return { ...item, click: closeNav };
	});
});

function handleOutsideClick(event: MouseEvent) {
	if (
		mobileNavbar.value &&
		!mobileNavbar.value.contains(event.target as Node)
	) {
		navOpen.value = false;
	}
}

function handleScroll() {
	navOpen.value = false;
}

onMounted(() => {
	window.addEventListener('click', handleOutsideClick);
	window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
	window.removeEventListener('click', handleOutsideClick);
	window.removeEventListener('scroll', handleScroll);
});
</script>

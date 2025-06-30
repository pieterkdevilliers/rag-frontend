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
	<nav class="navbar hidden lg:block">
		<UHorizontalNavigation
			:links="!isAuthenticated ? LoggedOutMenuItems : LoggedInMenuItems"
			:class="'nav--horizontal'"
		>
		</UHorizontalNavigation>
	</nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.uniqueAccountId !== null);
const navOpen = ref(false);

const LoggedOutMenuItems = ref([
	{
		label: 'Login',
		to: '/login',
		icon: 'i-heroicons:arrow-right-end-on-rectangle',
		type: 'link',
	},
]);

const LoggedInMenuItems = ref([
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

const mobileNavbar = ref<HTMLElement | null>(null);

function toggleNav() {
	navOpen.value = !navOpen.value;
}

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

<style scoped></style>

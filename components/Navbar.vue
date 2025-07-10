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
			:links="mobileLinks"
			:class="[
				navOpen ? 'nav--open' : 'nav--closed',
				'navbar nav--vertical',
			]"
		/>
	</div>

	<!-- Desktop -->
	<div class="navbar hidden lg:block">
		<nav class="relative w-full flex items-center justify-between">
			<ul class="flex items-center min-w-0 gap-4">
				<li v-for="link in desktopLinks" :key="link.to || link.label">
					<NuxtLink
						:to="link.to"
						:id="link.attrs?.id"
						class="group relative w-full flex items-center gap-1.5 px-2.5 py-3.5 rounded-md font-medium text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
						active-class="text-primary-600 dark:text-white"
						inactive-class="text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white"
					>
						<UIcon
							v-if="link.icon"
							:name="link.icon"
							class="flex-shrink-0 w-5 h-5"
						/>
						<span
							class="truncate font-roboto-condensed text-base font-normal"
						>
							{{ link.label }}
						</span>
					</NuxtLink>
				</li>
			</ul>
		</nav>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useAuthStore } from '~/stores/auth';

// STEP 1: DEFINE A CLEAR TYPE FOR OUR LINK OBJECTS
interface NavLink {
	label: string;
	to: string;
	icon: string;
	exact?: boolean;
	attrs?: { [key: string]: any };
	click?: () => void;
	children?: NavLink[];
}

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.uniqueAccountId !== null);
const navOpen = ref(false);

const LoggedOutMenuItems = ref<NavLink[]>([
	// <-- Add type here
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
	{
		label: 'Login',
		to: '/login',
		icon: 'i-heroicons:arrow-right-end-on-rectangle',
	},
]);

const LoggedInMenuItems = ref<NavLink[]>([
	// <-- And here
	{
		label: 'Chat Sessions',
		to: '/chats',
		icon: 'i-heroicons:chat-bubble-bottom-center-text',
		attrs: { id: 'nav-link-chats' },
	},
	{
		label: 'Users',
		to: '/users',
		icon: 'i-heroicons:users',
		attrs: { id: 'nav-link-users' },
	},
	{
		label: 'Documents',
		to: '/folders',
		icon: 'i-heroicons:document-magnifying-glass',
		attrs: { id: 'nav-link-documents' },
	},
	{
		label: 'Web Widgets',
		to: '/web-widgets',
		icon: 'i-heroicons:code-bracket',
		attrs: { id: 'nav-link-web-widgets' },
	},
	{
		label: 'My Account',
		to: '/accounts',
		icon: 'i-heroicons:user-circle',
		attrs: { id: 'nav-link-accounts' },
	},
	{
		label: 'Dashboard',
		to: '/dashboards',
		icon: 'i-heroicons:chart-pie',
		attrs: { id: 'nav-link-dashboards' },
	},
	{
		label: 'Logout',
		to: '/login',
		icon: 'i-heroicons:arrow-left-end-on-rectangle',
		attrs: { id: 'nav-link-logout' },
	},
]);

// For the desktop nav
const desktopLinks = computed<NavLink[]>(() => {
	// <-- And here
	return isAuthenticated.value
		? LoggedInMenuItems.value
		: LoggedOutMenuItems.value;
});

// For the mobile nav
const mobileLinks = computed<NavLink[]>(() => {
	// <-- And finally here
	const sourceMenu = isAuthenticated.value
		? LoggedInMenuItems.value
		: LoggedOutMenuItems.value;

	return sourceMenu.map((item) => {
		if (item.children) {
			return item;
		}
		return {
			...item,
			click: () => {
				if (navOpen.value) {
					closeNav();
				}
			},
		};
	});
});

// --- The rest of your script is fine and does not need changes ---
const mobileNavbar = ref<HTMLElement | null>(null);

function toggleNav() {
	navOpen.value = !navOpen.value;
}

function closeNav() {
	setTimeout(() => {
		navOpen.value = false;
	}, 800);
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

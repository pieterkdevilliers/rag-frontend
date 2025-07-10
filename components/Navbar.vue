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

	<div class="navbar hidden lg:block">
		<nav class="navbar nav--horizontal">
			<ul class="flex items-center min-w-0 gap-4">
				<li v-for="link in desktopLinks" :key="link.to || link.label">
					<NuxtLink
						:to="getLinkPath(link)"
						:id="link.attrs?.id"
						:class="[
							'nav-link',
							'group',
							isLinkActive(link) ? 'nav-active' : 'nav-inactive',
						]"
						@click="handleAnchorClick(link)"
					>
						<UIcon
							v-if="link.icon"
							:name="link.icon"
							class="flex-shrink-0 w-5 h-5"
						/>
						<span class="nav-link__label">
							{{ link.label }}
						</span>
					</NuxtLink>
				</li>
			</ul>
		</nav>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRoute } from '#imports';

// 1. INTERFACE DEFINITION
interface NavLink {
	label: string;
	to: string;
	icon: string;
	exact?: boolean;
	attrs?: { [key: string]: any };
	click?: () => void;
	children?: NavLink[];
}

// 2. STATE & ROUTE INITIALIZATION
const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.uniqueAccountId !== null);
const navOpen = ref(false);
const route = useRoute();
const activeHash = ref(route.hash);
let observer: IntersectionObserver | null = null;
const mobileNavbar = ref<HTMLElement | null>(null);

// 3. DATA DEFINITIONS
const LoggedOutMenuItems = ref<NavLink[]>([
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
		attrs: {
			id: 'nav-link-pricing',
			class: 'anchor-link',
		},
	},
	{
		label: 'Login',
		to: '/login',
		icon: 'i-heroicons:arrow-right-end-on-rectangle',
	},
]);

const LoggedInMenuItems = ref<NavLink[]>([
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

// 4. COMPUTED PROPERTIES
const desktopLinks = computed<NavLink[]>(() => {
	return isAuthenticated.value
		? LoggedInMenuItems.value
		: LoggedOutMenuItems.value;
});

const mobileLinks = computed<NavLink[]>(() => {
	const sourceMenu = isAuthenticated.value
		? LoggedInMenuItems.value
		: LoggedOutMenuItems.value;

	return sourceMenu.map((item) => {
		// For items with children, just fix their path and return
		if (item.children) {
			// This ensures even parent dropdown links are correct
			return { ...item, to: getLinkPath(item) };
		}

		// For regular links, create a new object that...
		return {
			...item, // 1. Copies all original properties
			to: getLinkPath(item), // 2. OVERWRITES the 'to' prop with the correct, absolute path
			click: () => {
				// 3. Adds the click handler to close the nav
				if (navOpen.value) closeNav();
			},
		};
	});
});

// 5. LOGIC & HELPER FUNCTIONS
function setupObserver() {
	// Disconnect any old observer first to be safe
	cleanupObserver();

	if (route.path === '/') {
		const anchorLinks = LoggedOutMenuItems.value.filter((link) =>
			link.to.startsWith('#')
		);

		observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						activeHash.value = `#${entry.target.id}`;
					}
				});
			},
			{ rootMargin: '-50% 0px -50% 0px', threshold: 0 }
		);

		anchorLinks.forEach((link) => {
			const targetId = link.to.substring(1);
			const targetElement = document.getElementById(targetId);
			if (targetElement) {
				observer?.observe(targetElement);
			}
		});
	}
}

function cleanupObserver() {
	if (observer) {
		observer.disconnect();
		observer = null;
	}
}
function getLinkPath(link: NavLink): string {
	// If the link is an anchor and we are NOT on the homepage...
	if (link.to.startsWith('#') && route.path !== '/') {
		// ...prepend the root path to navigate back to the homepage's anchor.
		return `/${link.to}`; // This will result in '/#pricing'
	}
	// Otherwise, use the path as-is.
	return link.to;
}
function isLinkActive(link: NavLink): boolean {
	if (activeHash.value && link.to === activeHash.value) return true;
	if (activeHash.value && link.to !== activeHash.value) return false;
	if (link.exact) return route.path === link.to && !route.hash;
	return route.path.startsWith(link.to) && link.to !== '/' && !route.hash;
}

function handleAnchorClick(link: NavLink) {
	if (link.to.startsWith('#')) {
		activeHash.value = link.to;
	}
}

// 6. WATCHERS
watch(
	() => route.hash,
	(newHash) => {
		activeHash.value = newHash;
	}
);
watch(
	() => route.path,
	() => {
		activeHash.value = '';
	}
);

// 6. WATCHERS
// This watcher handles the scroll and sets the active hash
watch(
	() => route.hash,
	(newHash) => {
		activeHash.value = newHash;
		if (newHash) {
			setTimeout(() => {
				const el = document.getElementById(newHash.substring(1));
				el?.scrollIntoView({ behavior: 'smooth' });
			}, 100);
		}
	}
);

// This watcher handles the observer lifecycle and clears the active hash
watch(
	() => route.path,
	(newPath) => {
		if (newPath === '/') {
			nextTick(() => {
				setupObserver();
			});
		} else {
			cleanupObserver();
			// Clear the hash when navigating to a different page entirely
			activeHash.value = '';
		}
	},
	{ immediate: true }
);

// 7. LIFECYCLE HOOKS (SIMPLIFIED)
onMounted(() => {
	// Logic for closing nav on outside click/scroll
	window.addEventListener('click', handleOutsideClick);
	window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
	// Clean up all listeners
	window.removeEventListener('click', handleOutsideClick);
	window.removeEventListener('scroll', handleScroll);
	cleanupObserver(); // Also clean up observer when the whole navbar is destroyed
});

// 8. METHODS
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
</script>

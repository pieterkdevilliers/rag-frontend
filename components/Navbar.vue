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
			<template #default="{ link }">
				<!-- If the link has children, render a UDropdown -->
				<UDropdown
					v-if="link.children"
					:class="['has-children']"
					:items="[link.children]"
					:popper="{ placement: 'bottom-start' }"
					:ui="{ item: { padding: 'px-2.5 py-2' } }"
				>
					<UButton
						:label="link.label"
						color="gray"
						trailing-icon="i-heroicons-chevron-down-20-solid"
					/>
				</UDropdown>

				<!-- 
                    FIX #1: 
                    - Pass the `:to="link.to"` prop to UButton to make it a real link.
                    - Remove the unnecessary <div> wrapper.
                    - Move the @click event directly to the button.
                -->
				<UButton
					v-else
					:to="link.to"
					:label="link.label"
					color="gray"
					variant="ghost"
					@click="closeNav()"
				/>
			</template>
		</UVerticalNavigation>
	</div>

	<!-- Desktop -->
	<div class="navbar hidden lg:block">
		<UHorizontalNavigation
			:links="!isAuthenticated ? LoggedOutMenuItems : LoggedInMenuItems"
			:class="'nav--horizontal'"
		>
			<template #default="{ link }">
				<!-- If the link has children, render a UDropdown -->
				<UDropdown
					v-if="link.children"
					:items="[link.children]"
					:popper="{ placement: 'bottom-start' }"
					:ui="{ item: { padding: 'px-2.5 py-2' } }"
				>
					<UButton
						:label="link.label"
						color="gray"
						variant="ghost"
						trailing-icon="i-heroicons-chevron-down-20-solid"
					/>
				</UDropdown>

				<!-- 
                    FIX #2: 
                    Add a `v-else` block to render the regular links.
                    Without this, your Home, Pricing, and Login links would not appear
                    on desktop.
                -->
				<UButton
					v-else
					:to="link.to"
					:label="link.label"
					color="gray"
					variant="ghost"
				/>
			</template>
		</UHorizontalNavigation>
	</div>
</template>

<script setup lang="ts">
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
		type: 'link',
	},
	{
		label: 'Pricing',
		to: '#pricing',
		icon: 'i-heroicons:currency-dollar',
	},
	{
		label: 'About',
		to: '',
		icon: 'i-heroicons:information-circle',
		children: [
			{
				label: 'The Problem',
				to: '#problem',
				icon: 'i-heroicons:exclamation-triangle',
				type: 'link',
			},
			{
				label: 'The Solution',
				to: '#solution',
				icon: 'i-heroicons:map',
				type: 'link',
			},
			{
				label: 'The Benefit',
				to: '#benefit',
				icon: 'i-heroicons:lifebuoy',
				type: 'link',
			},
			{
				label: 'The How',
				to: '#how',
				icon: 'i-heroicons:wrench-screwdriver',
				type: 'link',
			},
			{
				label: 'The Why',
				to: '#why',
				icon: 'i-heroicons:cake',
				type: 'link',
			},
		],
	},
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
		label: 'Dashboard',
		to: '/dashboards',
		icon: 'i-heroicons:chart-pie',
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

<style scoped></style>

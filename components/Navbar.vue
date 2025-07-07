<template>
	<!-- Mobile (tour is disabled, so this part is less critical but fixed for correctness) -->
	<div class="lg:hidden mobile-navbar__container" ref="mobileNavbar">
		<UButton
			@click="toggleNav"
			:icon="navOpen ? 'i-heroicons:x-mark' : 'i-heroicons:bars-3'"
			:class="['lg:hidden', 'navbar__toggle']"
		/>
		<nav v-if="navOpen" class="nav--open navbar nav--vertical">
			<ul>
				<li v-for="link in mobileLinks" :key="link.to">
					<NuxtLink :to="link.to" @click="closeNav" class="flex items-center gap-2 px-4 py-3 group">
						<UIcon :name="link.icon" class="w-5 h-5" />
						<span>{{ link.label }}</span>
					</NuxtLink>
				</li>
			</ul>
		</nav>
	</div>

	<!-- Desktop: We now manually build the navigation links -->
	<div class="navbar hidden lg:block">
		<nav class="flex items-center gap-2">
			<template v-if="!isAuthenticated">
				<!-- Apply the utility classes directly here -->
				<NuxtLink
					v-for="link in LoggedOutMenuItems"
					:key="link.to"
					:to="link.to"
					class="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-md"
				>
					<UIcon :name="link.icon" class="w-4 h-4 mr-1" />
					{{ link.label }}
				</NuxtLink>
			</template>
			<template v-else>
				<!-- And also apply the utility classes directly here -->
				<NuxtLink
					v-for="link in LoggedInMenuItems"
					:key="link.to"
					:to="link.to"
					:id="link.id"
					class="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-md"
				>
					<UIcon :name="link.icon" class="w-4 h-4 mr-1" />
					{{ link.label }}
				</NuxtLink>
			</template>
		</nav>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.uniqueAccountId !== null);
const navOpen = ref(false);

const LoggedOutMenuItems = ref([
	{ label: 'Home', to: '/', icon: 'i-heroicons:home' },
	{ label: 'Pricing', to: '#pricing', icon: 'i-heroicons:currency-dollar' },
	{ label: 'Login', to: '/login', icon: 'i-heroicons:arrow-right-end-on-rectangle' },
]);

const LoggedInMenuItems = ref([
	{ id: 'chats-button', label: 'Chat Sessions', to: '/chats', icon: 'i-heroicons:chat-bubble-bottom-center-text' },
	{ id: 'users-button', label: 'Users', to: '/users', icon: 'i-heroicons:users' },
	{ id: 'documents-button', label: 'Documents', to: '/folders', icon: 'i-heroicons:document-magnifying-glass' },
	{ id: 'widgets-button', label: 'Web Widgets', to: '/web-widgets', icon: 'i-heroicons:code-bracket' },
	{ id: 'account-button', label: 'My Account', to: '/accounts', icon: 'i-heroicons:user-circle' },
	{ id: 'dashboard-button', label: 'Dashboard', to: '/dashboards', icon: 'i-heroicons:chart-pie' },
	{ label: 'Logout', to: '/login', icon: 'i-heroicons:arrow-left-end-on-rectangle' },
]);



const mobileNavbar = ref<HTMLElement | null>(null);
function toggleNav() { navOpen.value = !navOpen.value; }
function closeNav() { navOpen.value = false; }
function handleOutsideClick(event: MouseEvent) {
	if (mobileNavbar.value && !mobileNavbar.value.contains(event.target as Node)) {
		navOpen.value = false;
	}
}
onMounted(() => window.addEventListener('click', handleOutsideClick));
onBeforeUnmount(() => window.removeEventListener('click', handleOutsideClick));
</script>

<style scoped>

</style>
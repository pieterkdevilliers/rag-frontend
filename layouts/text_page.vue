<template>
	<div class="layout layout--text_page">
		<header class="main-header">
			<div
				class="container mx-auto px-4 py-2 flex justify-between items-center"
			>
				<div class="logo">
					<img src="../assets/images/logo-w100.png" alt="" />
					<span><strong>YourDocs</strong>AI</span>
				</div>
				<Navbar />
			</div>
		</header>
		<div class="container container--full mx-auto">
			<slot />
		</div>
		<Footer />
	</div>
</template>

<script setup lang="ts">
import { useHead, useRoute } from '#imports';
import Navbar from '~/components/Navbar.vue';
import Footer from '~/components/Footer.vue';

const route = useRoute();

// This computed property will generate a class name like:
// - /         -> 'page-home'
// - /about    -> 'page-about'
// - /user/id  -> 'page-user-id'
const bodyClass = computed(() => {
	if (route.path === '/') {
		return 'page-home';
	}
	// Takes the path, removes the leading '/', and replaces other '/' with '-'
	return `page-${route.path.slice(1).replace(/\//g, '-')}`;
});

useHead({
	bodyAttrs: {
		// Use the reactive computed property here
		class: bodyClass,
	},
});
</script>

<style scoped>
/* Apply styles when the link is active
  :deep(.router-link-exact-active) {
    @apply bg-white text-[#08bfb3] px-3 py-2 rounded-md text-sm;
  } */
</style>

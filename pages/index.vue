<template>
	<div class="page--landing">
		<section>
			<HomeHeroSection />
		</section>
		<section>
			<HomeProblemSection />
		</section>
		<section>
			<HomeSolutionSection />
		</section>
		<section>
			<HomeBenefitSection />
		</section>
		<section>
			<HomeHowItWorksSection />
		</section>
		<section>
			<HomeWhyYourDocsAISection />
		</section>
		<section>
			<HomeCallToActionSection />
		</section>

		<!-- ADD THIS: The placeholder div for the widget -->
		<div id="my-ai-chat-widget-container"></div>
	</div>
</template>

<script setup lang="ts">
// ADD THIS: Import Vue's lifecycle hooks
import { onMounted, onUnmounted } from 'vue';

// --- Your existing imports ---
import HomeHeroSection from '~/components/HomeHeroSection.vue';
import HomeProblemSection from '~/components/HomeProblemSection.vue';
import HomeWhyYourDocsAISection from '~/components/HomeWhyYourDocsAISection.vue';
// ... and so on for your other components

// --- ADD THIS: The entire logic block for the widget ---

// We declare this outside the hooks so we can access it in both onMounted and onUnmounted.
let scriptElement: HTMLScriptElement | null = null;

// onMounted is called after the component is rendered to the page.
onMounted(() => {
	// To avoid adding the script multiple times if the component re-renders,
	// we first check if our config object already exists.
	if ((window as any).myAIChatWidgetConfig) {
		return;
	}

	// 1. Set up the configuration on the window object
	(window as any).myAIChatWidgetConfig = {
		accountId: '8c53b4f906488f44',
		// IMPORTANT: Use an environment variable for your API key for security!
		apiKey: 'dd08b16e3d1da35a4e7973ef51fcd2d27422982883ee1174def4c922df503a87',
		buttonText: 'Try YourDocsAI here',
		widgetTitle: 'Ask questions about YourDocsAI'
	};

	// 2. Create the script element
	scriptElement = document.createElement('script');
	scriptElement.src = 'https://d31env5c5sjhq3.cloudfront.net/static/widget.js';
	scriptElement.async = true;
	scriptElement.defer = true;

	// 3. Append the script to the body to start loading it
	document.body.appendChild(scriptElement);
});

// onUnmounted is called right before the component is removed from the page.
onUnmounted(() => {
	// 4. Clean up to prevent issues when navigating away and back to this page.
	if (scriptElement && document.body.contains(scriptElement)) {
		document.body.removeChild(scriptElement);
	}
	// Also remove the global configuration object
	delete (window as any).myAIChatWidgetConfig;

    // The widget might also add its own elements or styles to the body.
    // If you notice things being left behind, you might need to find them by class or ID and remove them here.
});
</script>

<style scoped></style>

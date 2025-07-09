<template>
	<div class="page--landing">
		<section id="hero">
			<HomeHeroSection />
		</section>
		<section id="benefit">
			<HomeBenefitSection />
		</section>
		<section id="problem">
			<HomeProblemSection />
		</section>
		<section id="solution">
			<HomeSolutionSection />
		</section>
		<section id="pricing">
			<HomePricingSection />
		</section>
		<section id="how">
			<HomeHowItWorksSection />
		</section>
		<section id="why">
			<HomeWhyYourDocsAISection />
		</section>
		<section id="cta">
			<HomeCallToActionSection />
		</section>

		<!-- ADD THIS: The placeholder div for the widget -->
		<div id="my-ai-chat-widget-container"></div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

let scriptElement: HTMLScriptElement | null = null;

onMounted(() => {
	if ((window as any).myAIChatWidgetConfig) {
		return;
	}

	// 1. Set up the configuration on the window object
	(window as any).myAIChatWidgetConfig = {
		accountId: '8c53b4f906488f44',
		apiKey: 'dd08b16e3d1da35a4e7973ef51fcd2d27422982883ee1174def4c922df503a87',
		buttonText: 'Try YourDocsAI here',
		widgetTitle: 'Ask questions about YourDocsAI',
	};

	// 2. Create the script element
	scriptElement = document.createElement('script');
	scriptElement.src =
		'https://d31env5c5sjhq3.cloudfront.net/static/widget.js';
	scriptElement.async = true;
	scriptElement.defer = true;

	// 3. Append the script to the body to start loading it
	document.body.appendChild(scriptElement);
});

onUnmounted(() => {
	if (typeof (window as any).YourDocsAI?.destroy === 'function') {
		(window as any).YourDocsAI.destroy();
	}

	if (scriptElement && document.body.contains(scriptElement)) {
		document.body.removeChild(scriptElement);
	}

	delete (window as any).myAIChatWidgetConfig;
});
</script>

<style>
.page--landing > section {
	scroll-margin-top: 80px;
}
#hero {
	clip-path: polygon(0 0, 100% 0, 100% 97%, 0% 100%);
}
#cta {
	clip-path: polygon(0 0, 100% 20%, 100% 100%, 0% 100%);
}
@media screen and (min-width: 768px) {
	#hero {
		clip-path: polygon(0 0, 100% 0, 100% 90%, 0% 100%);
	}
}
@media screen and (min-width: 375px) {
	#cta {
		clip-path: polygon(0 0, 100% 5%, 100% 100%, 0% 100%);
	}
}
</style>

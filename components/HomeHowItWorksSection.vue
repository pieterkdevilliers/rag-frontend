<template>
	<div class="how-it-works-section container mx-auto">
		<div class="text-center mb-10 md:mb-12">
			<h2 class="heading heading--2">How It Works</h2>
		</div>
		<div class="grid md:grid-cols-3 gap-6 lg:gap-8">
			<div
				v-for="(step, index) in steps"
				:key="index"
				class="step-item border-box border-box--center border-box--purple"
			>
				<!-- Number Bubble - its styling remains distinct -->
				<div class="icon__number">
					{{ step.number }}
				</div>
				<!-- Text Content -->
				<div>
					<!-- Removed md:mt-4 as p-6 on parent and mb-6 on bubble handle spacing -->
					<h3 class="text-xl mb-2">
						{{ step.title }}
					</h3>
					<p class="text-base" v-html="step.description"></p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Step {
	number: number;
	title: string;
	description: string;
}

const steps = ref<Step[]>([
	{
		number: 1,
		title: 'Upload Your Business Info',
		description:
			'<strong>Securely upload</strong> your FAQs, product details, policies or any helpful documents.',
	},
	{
		number: 2,
		title: 'Customize & Embed Your Chat Widget',
		description:
			'<strong>Easily add</strong> the YourDocsAI chat to your website.',
	},
	{
		number: 3,
		title: 'Delight Your Visitors',
		description:
			'Customers get <strong>instant, accurate answers</strong> sourced directly from <strong><em>your</em></strong>&nbsp;content, anytime.',
	},
]);
</script>

<style scoped>
/* The .step-item class in the template now carries the primary box styling.
   The internal layout (flex flex-col items-center...) remains to position
   the number bubble and text within this box. */
</style>

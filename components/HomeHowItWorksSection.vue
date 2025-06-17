<template>
	<section
		class="how-it-works-section py-12 md:py-16 bg-gray-100 dark:bg-gray-800"
	>
		<div class="container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="text-center mb-10 md:mb-12">
				<h2 class="text-3xl tracking-tight sm:text-4xl">
					How It Works
				</h2>
			</div>

			<!-- Removed the outer 'relative' div and the decorative line for simplicity,
           as the boxes themselves will provide strong visual separation.
           You can add the line back if desired, adjusting z-index if needed. -->
			<div
				class="space-y-8 md:space-y-0 md:grid md:grid-cols-3 md:gap-8 lg:grid-cols-3 lg:gap-x-8"
			>
				<!--
          Adjusted grid:
          - md:grid-cols-1 and lg:grid-cols-3 ensure that on medium screens,
            if you prefer stacking before going to 3 columns, it will do so.
            If you want 2 columns on medium, use md:grid-cols-2.
          - space-y-8 for stacking on small screens.
          - md:gap-8 for medium screens (if 2 cols) or lg:gap-x-8 for 3 cols.
        -->
				<div
					v-for="(step, index) in steps"
					:key="index"
					class="step-item bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-6 shadow-md flex flex-col items-center text-center md:items-start md:text-left"
				>
					<!-- Number Bubble - its styling remains distinct -->
					<div
						class="flex-shrink-0 w-16 h-16 rounded-full bg-primary-500 dark:bg-primary-600 text-white flex items-center justify-center text-2xl shadow-md mb-6"
					>
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
	</section>
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
			'Securely add your FAQs, product details, policies, and any helpful documents.',
	},
	{
		number: 2,
		title: 'Customize & Embed Your Chat Widget',
		description: 'Easily add the YourDocsAI chat to your website.',
	},
	{
		number: 3,
		title: 'Delight Your Visitors',
		description:
			"Customers get instant, accurate answers sourced directly from <strong><em class='font-semibold'>your</em></strong> content, anytime.",
	},
]);
</script>

<style scoped>
/* Component-specific styles */

/* Define primary colors or use existing Tailwind colors */
.bg-primary-500 {
	background-color: #6366f1; /* Example: Indigo 500 */
}
.dark .bg-primary-600 {
	background-color: #4f46e5; /* Example: Indigo 600 */
}
.text-primary-600 {
	color: #4f46e5; /* Example: Indigo 600 */
}
.dark .text-primary-400 {
	color: #818cf8; /* Example: Indigo 400 */
}

/* The .step-item class in the template now carries the primary box styling.
   The internal layout (flex flex-col items-center...) remains to position
   the number bubble and text within this box. */
</style>

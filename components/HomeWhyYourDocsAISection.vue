<template>
	<section
		class="why-sourceproof-section py-12 md:py-16 bg-white dark:bg-gray-900"
	>
		<div class="container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="text-center mb-10 md:mb-12">
				<h2 class="text-3xl tracking-tight sm:text-4xl">
					Why YourDocsAI Chat?
				</h2>
			</div>

			<div
				class="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3"
			>
				<!--
          Grid Layout:
          - 1 column on small screens.
          - 2 columns on medium screens.
          - 3 columns on large screens. For 5 items, the last row will have 2.
        -->
				<div
					v-for="(reason, index) in reasons"
					:key="index"
					class="reason-item p-6 rounded-lg bg-slate-50 dark:bg-slate-800 shadow-md hover:shadow-lg transition-shadow duration-300"
				>
					<div class="flex items-start">
						<div class="flex-shrink-0">
							<!-- Placeholder for an icon - using a checkmark for simplicity -->
							<svg
								class="h-7 w-7 text-green-500 dark:text-green-400"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="2"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<div class="ml-4">
							<h3 class="text-lg font-semibold leading-6">
								{{ reason.title }}
							</h3>
							<p
								class="mt-2 text-base"
								v-html="reason.description"
							></p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Reason {
	title: string;
	description: string;
}

const reasons = ref<Reason[]>([
	{
		title: 'Your Content, Your Answers',
		description:
			'The YourDocsAI <strong><em>only</em></strong> uses information you provide. No made-up stuff!',
	},
	{
		title: 'Verifiable for Visitors',
		description: 'Links to source pages build trust.',
	},
	{
		title: 'Incredibly Easy',
		description: 'Designed for busy small business owners.',
	},
	{
		title: 'Affordable 24/7 Support',
		description: 'Get an AI helper that works tirelessly for you.',
	},
	{
		title: 'Boosts Your Credibility',
		description: 'Provide professional, instant support.',
	},
]);
</script>

<style scoped></style>

<template>
	<section class="benefits-section py-12 md:py-16 bg-white dark:bg-gray-900">
		<div class="container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="text-center mb-10 md:mb-12">
				<h2 class="text-3xl tracking-tight sm:text-4xl">
					Delight Customers & Free Up Your Time
				</h2>
			</div>

			<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
				<div
					v-for="(benefit, index) in benefits"
					:key="index"
					class="benefit-item bg-slate-50 dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
				>
					<div class="flex items-center mb-3">
						<!-- Optional: Icon placeholder -->
						<div class="flex-shrink-0">
							<component
								:is="benefit.icon"
								v-if="benefit.icon"
								class="h-8 w-8 text-primary-600 dark:text-primary-400"
								aria-hidden="true"
							/>
							<div
								v-else
								class="h-8 w-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center"
							>
								<!-- Fallback visual if no specific icon -->
								<span
									class="text-primary-600 dark:text-primary-400 text-lg"
									>✓</span
								>
							</div>
						</div>
						<h3 class="card__title ms-4 text-lg leading-6">
							{{ benefit.title }}
						</h3>
					</div>
					<p class="text-base" v-html="benefit.description"></p>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { ref, shallowRef, type Component } from 'vue';
import {
	ClockIcon,
	ArrowPathIcon,
	CursorArrowRippleIcon,
	CursorArrowRaysIcon,
	CheckCircleIcon,
	SparklesIcon,
	TicketIcon,
} from '@heroicons/vue/24/outline';

interface Benefit {
	icon?: Component; // Make icon optional or provide a default
	title: string;
	description: string;
}

const benefits = ref<Benefit[]>([
	{
		icon: shallowRef(ClockIcon),
		title: 'Instant Customer Support, 24/7',
		description:
			'Answer visitor questions immediately, day or night, directly on your website.',
	},
	{
		icon: shallowRef(ArrowPathIcon),
		title: 'Reduce Repetitive Enquiries',
		description:
			'Let your AI chat handle common questions, freeing up your team for complex issues.',
	},
	{
		icon: shallowRef(CursorArrowRaysIcon),
		title: 'Increase Website Engagement & Conversions',
		description:
			'Help visitors find what they need quickly, guiding them towards a purchase or inquiry.',
	},
	{
		icon: shallowRef(CheckCircleIcon),
		title: 'Answers You Can Trust',
		description:
			'YourDocsAI uses <strong><em>only your approved business information</em></strong>, ensuring accurate and consistent responses.',
	},
	{
		icon: shallowRef(SparklesIcon),
		title: 'Easy Setup',
		description: 'Upload your docs, embed the widget – no coding needed!',
	},
	{
		icon: shallowRef(TicketIcon),
		title: 'Enhanced Information',
		description:
			"Review the visitor's question context for better answers.",
	},
]);
</script>

<style scoped>
/* Component-specific styles can go here */

/* Ensure primary color is defined or use a default Tailwind color */
/* e.g., in your tailwind.config.js or replace .text-primary-600 with .text-indigo-600 etc. */
.text-primary-600 {
	color: #4f46e5; /* Example: Indigo 600 */
}
.dark .text-primary-400 {
	color: #818cf8; /* Example: Indigo 400 */
}
.bg-primary-100 {
	background-color: #e0e7ff; /* Example: Indigo 100 */
}
.dark .bg-primary-900 {
	background-color: #3730a3; /* Example: Indigo 900 */
}
</style>
<!-- New Comment -->

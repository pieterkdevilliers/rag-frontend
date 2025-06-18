<template>
	<section class="benefits-section py-12 md:py-16 bg-white dark:bg-gray-900">
		<div class="container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="text-center mb-10 md:mb-12">
				<h2 class="text-3xl tracking-tight sm:text-4xl">
					Delight Customers & Free Up Your Time
				</h2>
			</div>

			<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
				<!--
          Responsive Grid:
          - grid-cols-1: Single column on small screens (default).
          - md:grid-cols-2: Two columns on medium screens and up.
          - lg:grid-cols-3: Three columns on large screens and up.
                           With 5 items, the last row will have 2 items, which is often acceptable.
                           Alternatively, you could keep it at md:grid-cols-2 for a more consistent 2-column layout throughout.
                           If you have 5 items and want the last one centered in a 2-column grid:
                           The last item could have a class like `md:col-start-1 md:col-span-2 lg:col-start-auto lg:col-span-1`
                           or target it with :last-child if the parent is flex. With grid, it's simpler to let it flow.
        -->
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

interface Benefit {
	icon?: Component; // Make icon optional or provide a default
	title: string;
	description: string;
}

const benefits = ref<Benefit[]>([
	{
		// icon: shallowRef(ClockIcon), // Use shallowRef for components
		title: 'Instant Customer Support, 24/7',
		description:
			'Answer visitor questions immediately, day or night, directly on your website.',
	},
	{
		// icon: shallowRef(ChatBubbleLeftEllipsisIcon),
		title: 'Reduce Repetitive Inquiries',
		description:
			'Let your AI chat handle common questions, freeing up your team for complex issues.',
	},
	{
		// icon: shallowRef(ArrowTrendingUpIcon),
		title: 'Increase Website Engagement & Conversions',
		description:
			'Help visitors find what they need quickly, guiding them towards a purchase or inquiry.',
	},
	{
		// icon: shallowRef(ShieldCheckIcon),
		title: 'Answers You Can Trust',
		description:
			'YourDocsAI uses <strong><em>only your approved business information</em></strong>, ensuring accurate and consistent responses.',
	},
	{
		// icon: shallowRef(BoltIcon),
		title: 'Easy Setup',
		description: 'Upload your docs, embed the widget – no coding needed!',
	},
	{
		// icon: shallowRef(BoltIcon),
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

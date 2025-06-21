<template>
	<div class="social-proof-section container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-10 md:mb-12">
			<h2 class="heading heading--2">What Our Users Say</h2>
		</div>

		<div
			class="grid grid-cols-1 gap-8 md:grid-cols-12 lg:max-w-4xl lg:mx-auto"
		>
			<div
				v-for="(testimonial, index) in testimonials"
				:key="index"
				class="testimonial-card border-box border-box--purple md:col-span-6"
			>
				<!-- <h3>{{ testimonials.length }}</h3> -->
				<div>
					<!-- Quotation Mark Icon -->
					<svg
						class="quote-icon"
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
						viewBox="0 0 448 512"
					>
						<path
							d="M0 216C0 149.7 53.7 96 120 96l8 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-8 0c-30.9 0-56 25.1-56 56l0 8 64 0c35.3 0 64 28.7 64 64l0 64c0 35.3-28.7 64-64 64l-64 0c-35.3 0-64-28.7-64-64l0-32 0-32 0-72zm256 0c0-66.3 53.7-120 120-120l8 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-8 0c-30.9 0-56 25.1-56 56l0 8 64 0c35.3 0 64 28.7 64 64l0 64c0 35.3-28.7 64-64 64l-64 0c-35.3 0-64-28.7-64-64l0-32 0-32 0-72z"
						/>
					</svg>
				</div>
				<div class="card__content">
					<blockquote class="testimonial__quote">
						<p>"{{ testimonial.quote }}"</p>
					</blockquote>
					<footer class="">
						<p class="testimonial__author">
							<strong>{{ testimonial.name }}</strong>
						</p>
						<p
							v-if="testimonial.title_or_business"
							class="testimonial__business"
						>
							{{ testimonial.title_or_business }}
						</p>
					</footer>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Testimonial {
	quote: string;
	name: string;
	title_or_business?: string; // Optional
}

const testimonials = ref<Testimonial[]>([
	{
		quote: 'Test quote for checking text content layout and behaviour. Test quote for checking text content layout and behaviour. Test quote for checking text content layout and behaviour.',
		name: 'Jean de Villiers', // Replace with actual name
		title_or_business: 'Owner of PhantomPWR', // Replace
	},
	{
		quote: 'Our website chat now handles 70% of common questions! Game changer.',
		name: '[Your Name]', // Replace with actual name
		title_or_business: 'Owner of [Your Small Business Type]', // Replace
	},
	{
		quote: 'Customers love getting instant answers, even after hours.',
		name: '[Another Business Owner]', // Replace
		title_or_business: '[Their Business Name/Type]', // Replace (optional)
	},
]);

onMounted(() => {
	const testimonialsCount = ref(testimonials.value.length);
	const testimonialsCountOdd = ref(testimonialsCount.value % 2 === 1);
	const testimonialCard = document.querySelectorAll('.testimonial-card');

	if (testimonialsCountOdd.value) {
		testimonialCard.forEach((card) => {
			card.classList.add('count--odd');
		});
	}
});
</script>

<style scoped>
/* Component-specific styles can go here */

/* Define primary colors or use existing Tailwind colors if not in config */
.text-primary-500 {
	color: #6366f1; /* Example: Indigo 500 */
}
.dark .text-primary-400 {
	color: #818cf8; /* Example: Indigo 400 */
}

.testimonial-card {
	/* You can add min-height here if you want all cards to be the same height
     e.g., min-height: 280px;
     But flex-grow on blockquote should help with content pushing footer down.
  */
}
</style>

<template>
	<!-- This outer div is the single root element -->
	<div class="container--default container--full container__hero-section">
		<div class="container__inner">
			<div
				class="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-16 items-center md:px-8"
			>
				<div class="text-block text-block--left text-block--wide">
					<h1 class="heading heading--h1">
						<span class="heading__span--block font-extrabold"
							>Answer Customer Questions 24/7</span
						>
						<span class="heading__span--block"
							>Instantly & Accurately</span
						>
						<span class="heading__span--block"
							><strong><em>From Your Website!</em></strong></span
						>
					</h1>
					<p>
						Add an AI chat widget to your site that learns
						<strong>only</strong> from your business documents
						(FAQs, product info, policies). Provide instant,
						reliable answers to visitor questions, with links back
						to your source info.
					</p>
				</div>
				<div class="form-container">
					<SignupForm />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import SignupForm from './SignupForm.vue'; // Import the SignupForm component
</script>

<style scoped>
/* Add component-specific styles here if needed */
</style>

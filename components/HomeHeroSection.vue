<template>
	<!-- This outer div is the single root element -->
	<div class="container">
		<div class="container__inner">
			<div class="text-block text-block--center text-block--wide">
				<h1 class="heading heading__h1 mb-6">
					<span class="heading__span--block"
						>Answer Customer Questions 24/7</span
					>
					<span class="heading__span--block"
						>Instantly & Accurately –</span
					>
					<span class="heading__span--block"
						><strong>From Your Website!</strong></span
					>
				</h1>
				<p class="text-lg text-gray-600 mb-8">
					Add an AI chat widget to your site that learns *only* from
					your business documents (FAQs, product info, policies).
					Provide instant, reliable answers to visitor questions, with
					links back to your source info.
				</p>
			</div>
			<div class="form-container">
				<SignupForm />
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

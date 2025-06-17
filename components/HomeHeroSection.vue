<template>
	<!-- This outer div is the single root element -->
	<div class="container mx-auto px-4 py-8">
		<div class="text-center">
			<h1 class="text-4xl mb-6">
				Answer Customer Questions 24/7, Instantly & Accurately – Right
				From Your Website!
			</h1>
		</div>
		<div class="text-center max-w-2xl mx-auto">
			<p class="text-lg text-gray-600 mb-8">
				Add an AI chat widget to your site that learns *only* from your
				business documents (FAQs, product info, policies). Provide
				instant, reliable answers to visitor questions, with links back
				to your source info.
			</p>
		</div>
		<div class="flex justify-center">
			<SignupForm />
		</div>
	</div>
</template>

<script setup lang="ts">
import SignupForm from './SignupForm.vue'; // Import the SignupForm component
</script>

<style scoped>
/* Add component-specific styles here if needed */
</style>

<template>
	<!-- This outer div is the single root element -->
	<div class="home-cta-section container--default">
		<div class="text-center">
			<h2 class="heading heading__h2 mb-6">
				<span class="heading__span--block"
					>Give Your Website Visitors the Answers They Need,
					Instantly.</span
				>
				<span class="heading__span--block"
					><strong>Start Your Free Trial Today!</strong></span
				>
			</h2>
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

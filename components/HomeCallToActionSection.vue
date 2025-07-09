<template>
	<!-- This outer div is the single root element -->
	<div class="home-cta-section container--default">
		<div class="text-center">
			<h2 class="heading heading__h2 mb-6">
				<span class="heading__span--block font-extrabold"
					>Give Your Website Visitors the Answers They Need,
					Instantly.</span
				>
				<span class="heading__span--block"
					><strong><em>Create Your Account Today!</em></strong></span
				>
			</h2>
		</div>
		<div class="form-container">
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

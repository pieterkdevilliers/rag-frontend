<template>
    <!-- This outer div is the single root element -->
    <div class="container mx-auto px-4 py-8">
        <div class="text-center">
            <h1 class="text-4xl font-bold mb-6">
                Give Your Website Visitors the Answers They Need, Instantly. Start Your Free Trial Today!
            </h1>
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
<template>
  <section class="social-proof-section py-12 md:py-16 bg-slate-100 dark:bg-slate-800">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-10 md:mb-12">
        <h2 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          What Our Users Say
        </h2>
      </div>

      <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:max-w-4xl lg:mx-auto">
        <!--
          Grid Layout:
          - 1 column on small screens.
          - 2 columns on medium screens and up.
          - lg:max-w-4xl lg:mx-auto: On large screens, constrain the width of the 2-column grid and center it
            if you only have a few testimonials, to prevent them from stretching too wide.
            Remove this if you expect many testimonials or want them to fill more horizontal space.
        -->
        <div
          v-for="(testimonial, index) in testimonials"
          :key="index"
          class="testimonial-card bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg flex flex-col"
        >
          <div class="flex-shrink-0 mb-4">
            <!-- Quotation Mark Icon -->
            <svg class="h-10 w-10 text-primary-500 dark:text-primary-400" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 32 32">
              <path d="M6.59375 4C3.527344 4 1 6.527344 1 9.59375V22.40625C1 25.472656 3.527344 28 6.59375 28H15.40625C16.035156 28 16.59375 27.441406 16.59375 26.8125V18.90625C16.59375 18.277344 16.035156 17.71875 15.40625 17.71875H9.8125V11.59375C9.8125 10.410156 10.753906 9.53125 11.875 9.53125H12.96875C13.597656 9.53125 14.15625 8.972656 14.15625 8.34375V5.1875C14.15625 4.558594 13.597656 4 12.96875 4H6.59375ZM21.59375 4C18.527344 4 16 6.527344 16 9.59375V22.40625C16 25.472656 18.527344 28 21.59375 28H30.40625C31.035156 28 31.59375 27.441406 31.59375 26.8125V18.90625C31.59375 18.277344 31.035156 17.71875 30.40625 17.71875H24.8125V11.59375C24.8125 10.410156 25.753906 9.53125 26.875 9.53125H27.96875C28.597656 9.53125 29.15625 8.972656 29.15625 8.34375V5.1875C29.15625 4.558594 28.597656 4 27.96875 4H21.59375Z"></path>
            </svg>
          </div>
          <blockquote class="flex-grow">
            <p class="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
              "{{ testimonial.quote }}"
            </p>
          </blockquote>
          <footer class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
            <p class="text-base font-semibold text-gray-900 dark:text-white">
              {{ testimonial.name }}
            </p>
            <p v-if="testimonial.title_or_business" class="text-sm text-gray-500 dark:text-gray-400">
              {{ testimonial.title_or_business }}
            </p>
          </footer>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Testimonial {
  quote: string;
  name: string;
  title_or_business?: string; // Optional
}

const testimonials = ref<Testimonial[]>([
  {
    quote: "Our website chat now handles 70% of common questions! Game changer.",
    name: "[Your Name]", // Replace with actual name
    title_or_business: "Owner of [Your Small Business Type]" // Replace
  },
  {
    quote: "Customers love getting instant answers, even after hours.",
    name: "[Another Business Owner]", // Replace
    title_or_business: "[Their Business Name/Type]" // Replace (optional)
  },
  // Add more testimonials here if needed
  // {
  //   quote: "Setting up SourceProof AI was incredibly simple and it started helping our visitors right away.",
  //   name: "Jane Doe",
  //   title_or_business: "Support Lead, Tech Solutions Inc."
  // }
]);
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
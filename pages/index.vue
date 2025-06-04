<template>
    <div class="flex justify-center items-center">
        <HomeHeroSection />
    </div>
    <div class="flex justify-center items-center">
        <HomeProblemSection />
    </div>
    <div class="flex justify-center items-center">
        <HomeSolutionSection />
    </div>
    <div class="flex justify-center items-center">
        <HomeBenefitSection />
    </div>
    <div class="flex justify-center items-center">
        <HomeHowItWorksSection />
    </div>
    <div class="flex justify-center items-center">
          <HomeUseCasesSection />
    </div>
    <div class="flex justify-center items-center">
        <HomeWhyYourDocsAISection />
    </div>
    <div class="flex justify-center items-center">
        <HomeTestimonialsSection />
    </div>
    <div class="flex justify-center items-center">
      <HomeCallToActionSection />
    </div>
</template>

<script setup lang="ts">
// import SignupForm from './SignupForm.vue';
import HomeHeroSection from '~/components/HomeHeroSection.vue';
import HomeProblemSection from '~/components/HomeProblemSection.vue';
import HomeWhyYourDocsAISection from '~/components/HomeWhyYourDocsAISection.vue';
import HomeTestimonialsSection from '~/components/HomeTestimonialsSection.vue';
import HomeCallToActionSection from '~/components/HomeCallToActionSection.vue';
import HomeSolutionSection from '~/components/HomeSolutionSection.vue';
import HomeBenefitSection from '~/components/HomeBenefitSection.vue';
import HomeHowItWorksSection from '~/components/HomeHowItWorksSection.vue';
import HomeUseCasesSection from '~/components/HomeUseCasesSection.vue';
</script>

<style scoped>
</style>
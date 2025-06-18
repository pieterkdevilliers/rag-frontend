<template>
	<div class="page--landing">
		<section>
			<HomeHeroSection />
		</section>
		<section>
			<HomeProblemSection />
		</section>
		<section>
			<HomeSolutionSection />
		</section>
		<section>
			<HomeBenefitSection />
		</section>
		<section>
			<HomeHowItWorksSection />
		</section>
		<section style="display: none">
			<HomeUseCasesSection />
		</section>
		<section>
			<HomeWhyYourDocsAISection />
		</section>
		<section>
			<HomeTestimonialsSection />
		</section>
		<section>
			<HomeCallToActionSection />
		</section>
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

<style scoped></style>

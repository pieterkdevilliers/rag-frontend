<template>
	<div class="how-it-works-section container--default mx-auto">
		<div class="text-center mb-10 md:mb-12">
			<h2 class="heading heading--2">What It Costs</h2>
		</div>
		<div class="grid md:grid-cols-3 gap-6 lg:gap-8">
			<div
				v-for="(step, index) in steps"
				:key="index"
				class="step-item border-box border-box--center border-box--purple"
			>
				<!-- Number Bubble - its styling remains distinct -->
				<div class="icon__number">
					<component
							:is="step.icon"
							v-if="step.icon"
							class="icon--white size--8"
							aria-hidden="true"
						/>
				</div>
				<!-- Text Content -->
				<div>
					<!-- Removed md:mt-4 as p-6 on parent and mb-6 on bubble handle spacing -->
					<h3 class="text-xl mb-2">
						{{ step.title }}
					</h3>
					<p class="text-base" v-html="step.description"></p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, shallowRef, type Component } from 'vue';
import {
	BeakerIcon,
	CurrencyDollarIcon,
	ArchiveBoxXMarkIcon,
} from '@heroicons/vue/24/outline';

interface Step {
	icon?: Component;
	title: string;
	description: string;
}

const steps = ref<Step[]>([
	{
		icon: shallowRef(BeakerIcon),
		title: 'Start For Free',
		description:
			'<strong>Securely upload</strong> up to 10 documents and run test queries - completely free.',
	},
	{
		icon: shallowRef(CurrencyDollarIcon),
		title: '£25/m or £250/year',
		description:
			'<strong>Save</strong> by signing up for an annual plan.',
	},
	{
		icon: shallowRef(ArchiveBoxXMarkIcon),
		title: 'Cancel anytime',
		description:
			'No <strong>lock in.</strong> If it doesn not work for your business, cancel without any hassle. <strong><em>your</em></strong>&nbsp;content, anytime.',
	},
]);
</script>

<style scoped>
/* The .step-item class in the template now carries the primary box styling.
   The internal layout (flex flex-col items-center...) remains to position
   the number bubble and text within this box. */
</style>

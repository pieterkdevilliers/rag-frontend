<template>
	<div class="problem-section container mx-auto px-4 py-8">
		<div class="container__inner">
			<h2 class="mb-8">
				<span class="heading__span--block"
					>Are Your Website Visitors Getting Frustrated?</span
				>
				<span class="heading__span--block">Are You Losing Time?</span>
			</h2>
		</div>
		<div class="grid sm:grid-cols-2 lg:grid-cols-4 justify-center gap-6">
			<div
				v-for="(problem, index) in problems"
				:key="index"
				class="problem-box"
			>
				<div class="flex flex-col items-center">
					<component
						:is="problem.icon"
						v-if="problem.icon"
						class="icon--purple size--10"
						aria-hidden="true"
					/>
					<p class="problem-box__description">
						{{ problem.description }}
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, shallowRef, type Component } from 'vue';
import { QuestionMarkCircleIcon } from '@heroicons/vue/24/outline';

interface Problem {
	icon?: Component; // Make icon optional or provide a default
	description: string;
}

const problems = ref<Problem[]>([
	{
		icon: shallowRef(QuestionMarkCircleIcon),
		description:
			"Visitors can't find answers on your site and leave frustrated?",
	},
	{
		icon: shallowRef(QuestionMarkCircleIcon),
		description:
			'Spending too much time answering the same customer questions over and over?',
	},
	{
		icon: shallowRef(QuestionMarkCircleIcon),
		description:
			"Losing potential sales because prospects can't get immediate information when they need it?",
	},
	{
		icon: shallowRef(QuestionMarkCircleIcon),
		description: 'Want to provide 24/7 support without hiring more staff?',
	},
]);
</script>

<style scoped></style>

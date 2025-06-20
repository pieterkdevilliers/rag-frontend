<template>
	<div class="why-sourceproof-section container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-10 md:mb-12">
			<h2 class="heading heading--2">Why YourDocsAI Chat?</h2>
		</div>

		<div class="reason-grid">
			<div
				v-for="(reason, index) in reasons"
				:key="index"
				class="reason-item border-box border-box--purple min-h-40"
			>
				<div>
					<div class="card__header--has-icon">
						<div class="flex-shrink-0">
							<component
								:is="reason.icon"
								class="icon--purple size--8"
								aria-hidden="true"
							/>
						</div>
						<h3 class="text-lg leading-6">
							{{ reason.title }}
						</h3>
					</div>
					<div>
						<p
							class="mt-2 text-base"
							v-html="reason.description"
						></p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, shallowRef, type Component } from 'vue';
import {
	FolderIcon,
	DocumentCheckIcon,
	SparklesIcon,
	ClockIcon,
	CheckBadgeIcon,
} from '@heroicons/vue/24/outline';

interface Reason {
	icon?: Component;
	title: string;
	description: string;
}

const reasons = ref<Reason[]>([
	{
		icon: shallowRef(FolderIcon),
		title: 'Your Content, Your Answers',
		description:
			'The YourDocsAI <strong><em>only</em></strong> uses information you provide. No made-up stuff!',
	},
	{
		icon: shallowRef(DocumentCheckIcon),
		title: 'Verifiable for Visitors',
		description: 'Links to source pages build trust.',
	},
	{
		icon: shallowRef(SparklesIcon),
		title: 'Incredibly Easy',
		description: 'Designed for busy small business owners.',
	},
	{
		icon: shallowRef(ClockIcon),
		title: 'Affordable 24/7 Support',
		description: 'Get an AI helper that works tirelessly for you.',
	},
	{
		icon: shallowRef(CheckBadgeIcon),
		title: 'Boosts Your Credibility',
		description: 'Provide professional, instant support.',
	},
]);
</script>

<style scoped></style>

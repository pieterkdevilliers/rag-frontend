<template>
	<div class="why-sourceproof-section container--default mx-auto">
		<div class="text-center mb-10 md:mb-12">
			<h2 class="text-gradient heading heading--2">
				Why YourDocsAI Chat?
			</h2>
		</div>
		<div class="reason-grid">
			<div
				v-for="(reason, index) in reasons"
				:key="index"
				class="reason-item min-h-40"
			>
				<PlainCard>
					<template #header>
						<component
							:is="reason.icon"
							class="icon--bg icon--purple size--8 md:size--10"
							aria-hidden="true"
						/>
						<h3 class="card__title">
							{{ reason.title }}
						</h3>
					</template>
					<div v-html="reason.description"></div>
				</PlainCard>
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
import PlainCard from './PlainCard.vue';

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

// Handle odd number of cards
onMounted(() => {
	const reasonsCount = ref(reasons.value.length);
	const reasonsCountOdd = ref(reasonsCount.value % 2 === 1);
	const reasonCard = document.querySelectorAll('.reason-card');

	if (reasonsCountOdd.value) {
		reasonCard.forEach((card) => {
			card.classList.add('count--odd');
		});
	}
});
</script>

<style scoped></style>

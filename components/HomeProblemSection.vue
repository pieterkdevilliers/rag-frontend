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
				class="problem-box rounded-lg p-6 w-full"
			>
				<p>
					{{ problem }}
				</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const problems = ref<string[]>([
	"Visitors can't find answers on your site and leave frustrated?",
	'Spending too much time answering the same customer questions over and over?',
	"Losing potential sales because prospects can't get immediate information when they need it?",
	'Want to provide 24/7 support without hiring more staff?',
]);
</script>

<style scoped></style>

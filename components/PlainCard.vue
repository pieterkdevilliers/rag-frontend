<template>
	<UCard
		:class="['card--plain', $attrs.class]"
		:ui="{
			header: {
				class: 'card__header',
				padding: false,
			},
			body: {
				class: 'card__body',
				padding: false,
			},
			divide: false,
			ring: false,
			shadow: false,
		}"
	>
		<template #header>
			<slot name="header" />
		</template>
		<div>
			<slot />
		</div>
	</UCard>
</template>

<script setup lang="ts"></script>

<template>
	<UModal
		:model-value="isOpen"
		@update:model-value="$emit('update:isOpen', $event)"
	>
		<UCard
			:ui="{
				ring: '',
				divide: 'divide-y divide-gray-100 dark:divide-gray-800',
			}"
		>
			<template #header>
				<div class="flex items-center justify-between">
					<h3 class="heading heading--h3">Confirm Subscription Cancellation</h3>
					<UButton
						color="gray"
						variant="ghost"
						icon="i-heroicons-x-mark-20-solid"
						class="-my-1"
						@click="$emit('close')"
					/>
				</div>
			</template>

			<div class="p-4">
				<p>Are you sure you want to cancel the subscription for "{{ itemName }}"?</p>
				<p>
					<strong>This action cannot be undone.</strong>
				</p>
				<p>
					<strong>This will immediatly cancel your subscription, and any live web widgets will stop returning answers.</strong>
				</p>
			</div>

			<template #footer>
				<div class="flex justify-end gap-2">
					<UButton
						color="gray"
						variant="ghost"
						@click="$emit('cancel')"
					>
						Nevermind
					</UButton>
					<UButton color="red" @click="$emit('confirm')">
						Cancel Subscription
					</UButton>
				</div>
			</template>
		</UCard>
	</UModal>
</template>

<script setup lang="ts">
defineProps<{
	isOpen: boolean;
	itemName: string;
}>();

defineEmits(['update:isOpen', 'confirm', 'cancel', 'close']);
</script>

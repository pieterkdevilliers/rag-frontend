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
					<h3 class="heading heading--h3">Confirm Deletion</h3>
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
				<p>Are you sure you want to delete "{{ itemName }}"?</p>
				<p>
					<strong>This action cannot be undone.</strong>
				</p>
			</div>

			<template #footer>
				<div class="flex justify-end gap-2">
					<UButton
						color="gray"
						variant="ghost"
						@click="$emit('cancel')"
					>
						Cancel
					</UButton>
					<UButton color="red" @click="$emit('confirm')">
						Delete
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

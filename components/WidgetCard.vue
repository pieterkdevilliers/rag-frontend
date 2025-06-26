<template>
	<UCard>
		<div>
			<p><strong>Widget Name:</strong> {{ widget.name }}</p>
			<p>
				<strong>Allowed Origins:</strong>
				{{ widget.allowed_origins.join(', ') }}
			</p>
			<p>
				<strong>Created At:</strong>
				{{ new Date(widget.created_at).toLocaleDateString() }}
			</p>
			<p><strong>Display Prefix:</strong> {{ widget.display_prefix }}</p>
		</div>

		<template #footer>
			<div class="flex gap-2">
				<UTooltip text="View widget code snippet">
					<UButton
						icon="i-heroicons:code-bracket"
						@click="emitViewSnippet"
					/>
				</UTooltip>
				<UTooltip text="Edit allowed origins">
					<UButton
						icon="i-heroicons:pencil-square"
						@click="emitEditWidget"
					/>
				</UTooltip>
				<UTooltip text="Delete widget">
					<UButton
						icon="i-heroicons:trash"
						@click="openConfirmDeleteModal"
						:loading="isDeleting"
					/>
				</UTooltip>
			</div>
		</template>
	</UCard>

	<!-- Confirmation Modal -->
	<ConfirmDeleteModal
		:is-open="isModalOpen"
		:item-name="widget.name"
		@update:is-open="isModalOpen = $event"
		@confirm="handleDeleteWidget"
		@cancel="closeConfirmDeleteModal"
		@close="closeConfirmDeleteModal"
	/>

	<!-- In parent component template -->
	<UModal v-model="isViewCodeSnippetModalOpen">
		<ViewCodeSnippetModal
			v-if="isViewCodeSnippetModalOpen"
			:widget="widget"
			@close="isViewCodeSnippetModalOpen = false"
		/>
	</UModal>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const { widget } = defineProps<{
	widget: {
		id: number;
		name: string;
		allowed_origins: string[];
		created_at: string;
		display_prefix: string;
		account_unique_id: string;
	};
}>();

const emit = defineEmits([
	'widgetDeleted',
	'editWidgetClicked',
	'viewCodeSnippetClicked',
]);

const toast = useToast(); // For notifications
const authStore = useAuthStore();
const router = useRouter();
const isModalOpen = ref(false);
const isDeleting = ref(false);

const uniqueAccountId = authStore.uniqueAccountId;
const apiAuthorizationToken = authStore.access_token;

const openConfirmDeleteModal = () => {
	isModalOpen.value = true;
};

const closeConfirmDeleteModal = () => {
	isModalOpen.value = false;
};

const handleDeleteWidget = async () => {
	isDeleting.value = true;
	closeConfirmDeleteModal(); // Close modal immediately

	try {
		await $fetch(
			`${config.public.apiBase}/delete-api-key/${uniqueAccountId}/${widget.id}`,
			{
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					accept: 'application/json',
					Authorization: `Bearer ${apiAuthorizationToken}`,
				},
			}
		);

		toast.add({
			title: 'Widget Deleted',
			description: `Widget "${widget.id} - ${widget.name}" has been deleted.`,
			color: 'green',
		});
		emit('widgetDeleted', widget.id); // Emit event with widget ID
	} catch (error: any) {
		console.error('Error deleting widget:', error);
		const errorMessage =
			error.data?.detail || error.message || 'Could not delete widget.';
		toast.add({ title: 'Error', description: errorMessage, color: 'red' });
	} finally {
		isDeleting.value = false;
	}
};

const emitEditWidget = () => {
	emit('editWidgetClicked', widget); // Emit the widget object
};

const isViewCodeSnippetModalOpen = ref(false);
const emitViewSnippet = () => {
	isViewCodeSnippetModalOpen.value = true;
};

const closeViewCodeSnippetModal = () => {
	isViewCodeSnippetModalOpen.value = false;
};
</script>

<style scoped></style>

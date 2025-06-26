<template>
	<UCard class="card-grid__card">
		<div class="card__body">
			<p><strong>Email:</strong> {{ user.user_email }}</p>
			<p><strong>User ID:</strong> {{ user.id }}</p>

			<!-- New Toggle for Receive Notifications -->
			<div class="flex items-center justify-between mt-4">
				<label :for="`notifications-toggle-${user.id}`"
					><strong>Receive Notifications:</strong></label
				>
				<UTooltip text="Should this user receive email notifications?">
					<UToggle
						:id="`notifications-toggle-${user.id}`"
						v-model="localReceiveNotifications"
						:loading="isUpdatingNotifications"
						@update:model-value="handleToggleReceiveNotifications"
					/>
				</UTooltip>
			</div>
		</div>
		<template #footer>
			<div class="flex gap-2">
				<UTooltip text="Edit User Password">
					<UButton
						icon="i-heroicons:pencil-square"
						@click="emitEditUser"
					/>
				</UTooltip>
				<UTooltip text="Delete User">
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
		:item-name="user.user_email"
		@update:is-open="isModalOpen = $event"
		@confirm="handleDeleteUser"
		@cancel="closeConfirmDeleteModal"
		@close="closeConfirmDeleteModal"
	/>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const { user } = defineProps<{
	user: {
		id: number;
		user_email: string;
		receive_notifications?: boolean;
	};
}>();

const emit = defineEmits(['userDeleted', 'editUserClicked', 'userUpdated']);

const toast = useToast(); // For notifications
const authStore = useAuthStore();
const isModalOpen = ref(false);
const isDeleting = ref(false);
const isUpdatingNotifications = ref(false);

const localReceiveNotifications = ref(user.receive_notifications);
watch(
	() => user.receive_notifications,
	(newValue) => {
		localReceiveNotifications.value = newValue;
	}
);

const uniqueAccountId = authStore.uniqueAccountId;
const apiAuthorizationToken = authStore.access_token;

const openConfirmDeleteModal = () => {
	isModalOpen.value = true;
};

const closeConfirmDeleteModal = () => {
	isModalOpen.value = false;
};

const handleToggleReceiveNotifications = async (newValue: boolean) => {
	// The newValue is the new state of the toggle, v-model (localReceiveNotifications) is already updated.
	isUpdatingNotifications.value = true;
	const originalValue = !newValue; // For rollback

	try {
		const updatedUserData = await $fetch(
			`${config.public.apiBase}/users/${uniqueAccountId}/${user.id}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json', // IMPORTANT: Send JSON for Pydantic model
					accept: 'application/json',
					Authorization: `Bearer ${apiAuthorizationToken}`,
				},
				// Send only the field that changed. FastAPI `exclude_unset=True` handles this.
				body: {
					receive_notifications: newValue,
				},
			}
		);

		toast.add({
			title: 'Settings Updated',
			description: `Notification preference for "${user.user_email}" updated.`,
			color: 'green',
		});
		emit('userUpdated', { ...user, receive_notifications: newValue });
	} catch (error: any) {
		console.error('Error updating notification settings:', error);
		const errorMessage =
			error.data?.detail ||
			error.message ||
			'Could not update notification settings.';
		toast.add({ title: 'Error', description: errorMessage, color: 'red' });
		// Rollback optimistic update
		localReceiveNotifications.value = originalValue;
		user.receive_notifications = originalValue; // Also rollback prop if it was directly mutated
	} finally {
		isUpdatingNotifications.value = false;
	}
};

const handleDeleteUser = async () => {
	isDeleting.value = true;
	closeConfirmDeleteModal(); // Close modal immediately

	try {
		await $fetch(
			`${config.public.apiBase}/users/${uniqueAccountId}/${user.id}`,
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
			title: 'User Deleted',
			description: `User "${user.id} - ${user.user_email}" has been deleted.`,
			color: 'green',
		});
		emit('userDeleted', user.id); // Emit event with user ID
	} catch (error: any) {
		console.error('Error deleting user:', error);
		const errorMessage =
			error.data?.detail || error.message || 'Could not delete user.';
		toast.add({ title: 'Error', description: errorMessage, color: 'red' });
	} finally {
		isDeleting.value = false;
	}
};

const emitEditUser = () => {
	emit('editUserClicked', user); // Emit the user object
};
</script>

<style scoped></style>

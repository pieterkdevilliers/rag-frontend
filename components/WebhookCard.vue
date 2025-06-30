<template>
	<UCard>
		<div>
			<p><strong>Webhook Destination URL:</strong> {{ webhook.account.webhook_url }} </p>
		</div>
		<template #footer>
			<div class="flex gap-2">
				<UTooltip text="Edit Webhook Destination URL">
					<UButton
						icon="i-heroicons:pencil-square"
						@click="emitEditWebhook"
					/>
				</UTooltip>
			</div>
		</template>
	</UCard>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const { webhook } = defineProps<{
	webhook: {
		// The object passed from the parent has an 'account' key
		account: {
			webhook_url: string;
		};
	};
}>();

const emit = defineEmits(['editWebhookClicked']);
console.log("Card Webhook: ", webhook)
const toast = useToast(); // For notifications
const authStore = useAuthStore();
const isModalOpen = ref(false);

const uniqueAccountId = authStore.uniqueAccountId;
const apiAuthorizationToken = authStore.access_token;

const emitEditWebhook = () => {
	emit('editWebhookClicked', webhook); // Emit the webhook object
};
</script>

<style scoped></style>

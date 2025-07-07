<template>
	<section v-if="!activeSubscription">
		<p class="m-4">
			To subscribe to a plan, please click the button below.
		</p>
		<UButton
			label="Subscribe Now"
			icon="i-heroicons:plus-circle-16-solid"
			variant="solid"
			@click="openSubscriptionModal"
			class="m-4"
		/>
	</section>
	<section class="my-subscriptions container--default mx-auto">
		<div class="page-header">
			<h2 class="heading heading--h2">My Subscriptions</h2>
		</div>
		<div class="search-pagination-container"></div>
		<div class="subscription-grid card-grid">
			<div
				v-for="subscription in subscriptions?.subscriptions"
				:key="subscription.id"
			>
				<SubscriptionCard
				:subscription="subscription"
				@subscription-canceled="handleSubscriptionCanceled" />
			</div>
		</div>
	</section>
	<section class="my-subscriptions container--default mx-auto">
		<h2 class="heading heading--h2">Notification Webhook</h2>
			<div class="card-grid">
				<div>
					<WebhookCard
						:webhook="webhook"
						@edit-webhook-clicked="openEditWebhookModal"
					/>
				</div>
			</div>
	</section>

	<SubscriptionModal v-model="isSubscriptionModalOpen" />

		<!-- Edit Webook Modal -->
	<EditWebhookModal
		:is-open="isEditWebhookModalOpen"
		:webhook="webhookToEdit"
		@close="closeEditWebhookModal"
		@webhook-updated="handleWebhookUpdated"
	/>

	<UNotifications />
</template>

<script setup lang="ts">
	const config = useRuntimeConfig();
	import SubscriptionCard from '~/components/SubscriptionCard.vue';
	import SubscriptionModal from '~/components/SubscriptionModal.vue';
	import WebhookCard from '~/components/WebhookCard.vue'
	import EditWebhookModal from '~/components/EditWebhookModal.vue';
	import { ref, watch } from 'vue';
	import { useAuthStore } from '~/stores/auth';

	definePageMeta({
		middleware: 'auth',
		layout: 'user-access',
	});

	const authStore = useAuthStore();
	const toast = useToast(); // For notifications

	const apiAuthorizationToken = authStore.access_token;
	const uniqueAccountId = authStore.uniqueAccountId;
	const activeSubscription = computed(() => authStore.subs_status);
	console.log('activeSubscription: ', activeSubscription);
	const accountOrganisation = ref('');

	const isSubscriptionModalOpen = ref(false);

	const openSubscriptionModal = () => {
		isSubscriptionModalOpen.value = true;
	};

	const closeSubscriptionModal = () => {
		isSubscriptionModalOpen.value = false;
	};

	interface Subscription {
		id: number;
		stripe_subscription_id: string;
		stripe_customer_id: string;
		status: string;
		current_period_end: Date;
		type: string; // 'monthly' or 'yearly'
		trial_start: Date | null;
		trial_end: Date | null;
		subscription_start: Date | null;
		stripe_account_url: string | null;
		related_product_title: string | null;
	}


	// [NEW METHOD]
	// This handler receives the `canceledId` from the emit.
	const handleSubscriptionCanceled = (canceledId: number) => {
		// Ensure we have data to work with
		if (!subscriptions.value || !subscriptions.value.subscriptions) {
			return;
		}

		// Find the specific subscription in our local array
		const subToUpdate = subscriptions.value.subscriptions.find(
			(sub) => sub.id === canceledId
		);

		// If found, update its status. Vue's reactivity will do the rest!
		if (subToUpdate) {
			subToUpdate.status = 'canceled';
			console.log(`Updated subscription ${canceledId} status locally.`);
		}
	};


	const {
			data: subscriptions,
			error,
			refresh,
		} = await useFetch(
			`${config.public.apiBase}/stripe-subscriptions/${uniqueAccountId}`,
			{
				method: 'GET',
				headers: {
					accept: 'application/json',
					Authorization: `Bearer ${apiAuthorizationToken}`,
				},
				cache: 'no-cache' 
			}
		);


		if (error.value) {
			console.error('Error fetching subscriptions:', error.value);
		} else {
			console.log('Stored Unique Account ID:', authStore.uniqueAccountId);
		}

		watch(subscriptions, (newSubscriptionsValue) => {
        if (newSubscriptionsValue) {
            authStore.setSubsStatus(newSubscriptionsValue.active_subscription);
            console.log('Auth store status updated to:', newSubscriptionsValue.active_subscription);
        }
    }, { immediate: true });

	interface Webhook {
			id: number;
			webhook_url: string;
		}

	const {
		data: webhook,
		error: webhookError,
    	refresh: refreshWebhook,
	} = await useFetch(`${config.public.apiBase}/accounts/${uniqueAccountId}`, {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: `Bearer ${apiAuthorizationToken}`,
		},
	});
	console.log("Webhooks Data: ", webhook.value.account.webhook_url)

	if (error.value) {
		console.error('Error fetching users:', error.value);
	} else {
		console.log('Stored Unique Account ID:', authStore.uniqueAccountId);
	}

	const refreshWebhooks = async () => {
		console.log('Refreshing webhooks...');
		await refresh();
	};

	// --- State for Edit Webhook Modal ---
	const isEditWebhookModalOpen = ref(false);
	const webhookToEdit = ref<Webhook | null>(null);

	const openEditWebhookModal = (webhook: Webhook) => {
		webhookToEdit.value = webhook;
		isEditWebhookModalOpen.value = true;
	};

	const closeEditWebhookModal = () => {
		isEditWebhookModalOpen.value = false;
		webhookToEdit.value = null; // Clear the selected user
	};

	const handleWebhookUpdated = async (updatedWebhook: Webhook) => {
		await refreshWebhook();
	};
</script>

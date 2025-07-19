<!-- components/SubscriptionCard.vue -->
<template>
	<UCard>
		<template #header>
			<!-- Use props.subscription instead of just subscription -->
			<h3 class="heading heading--h3 text-pretty card__title">
				{{ props.subscription.related_product_title }}
			</h3>
		</template>
		<div class="subscription-card__details">
			<!-- Update all references to use props.subscription -->
			<p><strong>Type:</strong> {{ displayType }}</p>
			<p class="paragraph-label-text block">
				<strong class="paragraph-label-text__label"
					>Subscription Reference:</strong
				>
				<UTooltip
					:text="props.subscription.stripe_subscription_id"
					class="paragraph-label-text__text"
				>
					<span>
						{{ props.subscription.stripe_subscription_id }}
					</span>
				</UTooltip>
			</p>
			<p class="paragraph-label-text block">
				<strong class="paragraph-label-text__label"
					>Customer Reference:</strong
				>
				<UTooltip
					:text="props.subscription.stripe_customer_id"
					class="paragraph-label-text__text"
				>
					<span>
						{{ props.subscription.stripe_customer_id }}
					</span>
				</UTooltip>
			</p>
			<p>
				<strong>Trial Start:</strong>
				{{ formatDateTime(props.subscription.trial_start) }}
			</p>
			<p>
				<strong>Trial End:</strong>
				{{ formatDateTime(props.subscription.trial_end) }}
			</p>
			<p>
				<strong>Subscription Start:</strong>
				{{ formatDateTime(props.subscription.subscription_start) }}
			</p>
			<p v-if="props.subscription.status === 'active'">
				<strong>Current Period End:</strong>
				{{ formatDateTime(props.subscription.current_period_end) }}
			</p>
			<p v-if="props.subscription.status === 'canceled'">
				<strong>Date Canceled:</strong>
				{{ formatDateTime(props.subscription.current_period_end) }}
			</p>
		</div>

		<template #footer>
			<div class="subscription-card__footer">
				<!-- This will now display the correct status -->
				<p class="subscription-status">
					<strong>Status:</strong> {{ props.subscription.status }}
				</p>
			</div>
			<div v-if="props.subscription.status === 'active'">
				<UTooltip text="Cancel Subscription">
					<UButton
						icon="i-heroicons:x-mark"
						label="Cancel Subscription"
						@click="openConfirmCancelModal"
						:loading="isCancelling"
					/>
				</UTooltip>
			</div>
		</template>
	</UCard>

	<!-- Confirmation Modal -->
	<ConfirmCancelModal
		:is-open="isModalOpen"
		:item-name="props.subscription.related_product_title"
		@update:is-open="isModalOpen = $event"
		@confirm="handleCancelSubscription"
		@cancel="closeConfirmCancelModal"
		@close="closeConfirmCancelModal"
	/>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';
import { format, parseISO } from 'date-fns';

const toast = useToast();
const config = useRuntimeConfig();
const authStore = useAuthStore();
const isModalOpen = ref(false);
const isCancelling = ref(false);
const uniqueAccountId = authStore.uniqueAccountId;
const apiAuthorizationToken = authStore.access_token;

const emit = defineEmits(['subscriptionCanceled']);

const props = defineProps<{
	subscription: {
		id: number;
		stripe_subscription_id: string;
		stripe_customer_id: string;
		status: string;
		current_period_end: Date;
		type: string;
		trial_start: Date | null;
		trial_end: Date | null;
		subscription_start: Date | null;
		stripe_account_url: string | null;
		related_product_title: string | null;
	};
}>();

const openConfirmCancelModal = () => {
	isModalOpen.value = true;
};

const closeConfirmCancelModal = () => {
	isModalOpen.value = false;
};

const displayType = computed(() => {
	if (props.subscription.type === 'month') {
		return 'Monthly';
	}
	if (props.subscription.type === 'year') {
		return 'Yearly';
	}
	// Fallback for any other unexpected values
	return props.subscription.type;
});

function formatDateTime(isoString: string | null | undefined): string {
	if (!isoString) {
		return 'N/A';
	}
	return format(parseISO(isoString), 'd MMMM yyyy');
}

const handleCancelSubscription = async () => {
	isCancelling.value = true;
	closeConfirmCancelModal(); // Close modal immediately

	try {
		await $fetch(
			`${config.public.apiBase}/cancel-stripe-sub/${uniqueAccountId}/${props.subscription.stripe_subscription_id}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					accept: 'application/json',
					Authorization: `Bearer ${apiAuthorizationToken}`,
				},
			}
		);

		toast.add({
			title: 'Subscription Canceled',
			description: `Subscription "${props.subscription.id} - ${props.subscription.related_product_title}" has been canceled.`,
			color: 'green',
		});
		emit('subscriptionCanceled', props.subscription.id);
	} catch (error: any) {
		console.error('Error canceling subscription:', error);
		const errorMessage =
			error.data?.detail ||
			error.message ||
			'Could not cancel subscription.';
		toast.add({ title: 'Error', description: errorMessage, color: 'red' });
	} finally {
		isCancelling.value = false;
	}
};
</script>
<style scoped>
/*
	<UTooltip> adds inline-flex, which breaks the truncation ellipsis.
	Adding block to tailwind.css still gets overridden by <UTooltip>.
 */
.paragraph-label-text__text {
	display: block;
}
</style>

<!-- components/SubscriptionCard.vue -->
<template>
	<UCard>
		<template #header>
			<!-- Use props.subscription instead of just subscription -->
			<h3 class="heading heading--h3 text-pretty">
				{{ props.subscription.related_product_title }}
			</h3>
		</template>
		<div class="subscription-card__details">
			<!-- Update all references to use props.subscription -->
			<p><strong>Type:</strong> {{ displayType }}</p>
			<p>
				<strong>Subscription Reference:</strong>
				{{ props.subscription.stripe_subscription_id }}
			</p>
			<p>
				<strong>Customer Reference:</strong>
				{{ props.subscription.stripe_customer_id }}
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
				<p><strong>Status:</strong> {{ props.subscription.status }}</p>
			</div>
		</template>
	</UCard>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';
import { format, parseISO } from 'date-fns';

// ★★★ THE FIX IS HERE ★★★
// Assign the entire result of defineProps to a 'props' constant.
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
</script>

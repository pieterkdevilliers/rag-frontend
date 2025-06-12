<template>
    <section>
        <h1 class="font-bold text-gray-500 mb-4">My Subscriptions</h1>
            <div class="grid grid-cols-4 gap-5">
      <div v-for="subscription in subscriptions?.subscriptions" :key="subscription.id">
        <SubscriptionCard :subscription="subscription" />
      </div>
    </div>
    </section>
    <section>
        <h1 class="font-bold text-gray-500 m-4">Subscribe to a Plan</h1>
        <p class="mb-4">To subscribe to a plan, please click the button below.</p>
        <UButton
            label="Subscribe Now"
            icon="i-heroicons:plus-circle-16-solid"
            variant="solid"
            @click="openSubscriptionModal"
            class="m-4"
        />
        <p>This will display the SUBSCRIBE button if no active subscription exists</p>
    </section>

    <SubscriptionModal
        v-model="isSubscriptionModalOpen"
    />

    <UNotifications />
</template>

<script setup lang="ts">

import SubscriptionCard from '~/components/SubscriptionCard.vue';
import SubscriptionModal from '~/components/SubscriptionModal.vue';
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const toast = useToast(); // For notifications

const apiAuthorizationToken = authStore.access_token;
const uniqueAccountId = authStore.uniqueAccountId;
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
    type: string;  // 'monthly' or 'yearly'
    trial_start: Date | null;
    trial_end: Date | null;
    subscription_start: Date | null;
    stripe_account_url: string | null;
}

  const { data: subscriptions, error, refresh } = await useFetch(`https://fastapi-rag-2705cfd4c41a.herokuapp.com/api/v1/stripe-subscriptions/${uniqueAccountId}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${apiAuthorizationToken}`,
    },
  });

  if (error.value) {
    console.error('Error fetching subscriptions:', error.value);
  } else {
    console.log('Stored Unique Account ID:', authStore.uniqueAccountId);
  }

</script>
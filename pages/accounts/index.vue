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
        <p class="m-4">To subscribe to a plan, please click the button below.</p>
        <UButton
            label="Subscribe Now"
            icon="i-heroicons:plus-circle-16-solid"
            variant="solid"
            @click="openSubscriptionModal"
            class="m-4"
        />
        <h1>********NOTE: The subscribe button will only display when the account does not have an active subscription</h1>
        <h1>This is not active right now, to reduce the hassle in styling the subscription modal.********</h1>
    </section>

    <SubscriptionModal
        v-model="isSubscriptionModalOpen"
    />

    <UNotifications />
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
import SubscriptionCard from '~/components/SubscriptionCard.vue';
import SubscriptionModal from '~/components/SubscriptionModal.vue';
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';

definePageMeta({
    middleware: 'auth',
    layout: 'user-access',
});

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
    related_product_title: string | null;
}

  const { data: subscriptions, error, refresh } = await useFetch(`${config.public.apiBase}/stripe-subscriptions/${uniqueAccountId}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${apiAuthorizationToken}`,
    },
  });

  authStore.setSubsStatus(subscriptions.value.active_subscription)
  
  if (error.value) {
    console.error('Error fetching subscriptions:', error.value);
  } else {
    console.log('Stored Unique Account ID:', authStore.uniqueAccountId);
  }

</script>
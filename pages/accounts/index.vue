<template>
    <section>
        <h1 class="font-bold text-gray-500 mb-4">My Subscriptions</h1>
            <div class="grid grid-cols-4 gap-5">
      <div>
        <SubscriptionCard 

          />
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
</script>
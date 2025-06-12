<template>
    <UCard class="bg-white shadow-md rounded-lg">
        <template #header>
            <h1 class="font-bold text-gray-500">Subscription Details:</h1>
        </template>
        <div class="flex flex-col space-y-2">
            <p>Subscription: "SubscriptionID"</p>
            <p>Type: "SubscriptionType"</p>
            <p> Subscription Reference: "SubscriptionReference"</p>   
            <p>Customer Reference: "CustomerReference"</p>
            <p>Trial Start: "TrialStart"</p>
            <p>Trial End: "TrialEnd"</p>
            <p>Subscription Start: "SubscriptionStart"</p>
        </div>

        <template #footer>
            <div>
                <p>Status: "SubscriptionStatus"</p>
            </div>

        </template>
    </UCard>
</template>
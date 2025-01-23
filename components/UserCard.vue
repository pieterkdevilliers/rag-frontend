<template>
        <UCard>
            <p class="font-bold text-gray-500 m-4">Email: {{ user.user_email }}</p>
            <p class="font-bold text-gray-500 m-4">User ID: {{ user.id }}</p>
            <template #footer>
                <div class="flex gap-2">
                    <UButton 
                        :to="`/users/${user.id}`"
                        icon="i-heroicons:pencil-square">
                    </UButton>
                    <UButton 
                        :to="`/users/${user.id}`"
                        icon="i-heroicons:trash">
                    </UButton>
                </div>
            </template>
        </UCard>
</template>

<script setup lang="ts">
const { user } = defineProps<{
    user: {
        id: number;
        user_email: string;
    };
}>();

</script>

<style scoped>

</style>
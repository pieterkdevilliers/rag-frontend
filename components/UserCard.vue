<template>
        <UCard>
            <p class="font-bold text-gray-500 m-4">Email: {{ user.user_email }}</p>
            <p class="font-bold text-gray-500 m-4">User ID: {{ user.id }}</p>
            <template #footer>
                <UButton 
                    :to="`/users/${user.id}`"
                    label="Edit User"
                    icon="i-heroicons:user">
                </UButton>
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
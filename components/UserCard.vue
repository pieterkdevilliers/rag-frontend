<template>
        <div class="card text-center">
            <p class="font-bold text-gray-500 m-4">User Email: {{ user.user_email }}</p>
            <p>User ID: {{ user.id }}</p>
            <NuxtLink :to="`/users/${user.id}`">
                <p class="btn my-4"> View User</p>
            </NuxtLink>
        </div>
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
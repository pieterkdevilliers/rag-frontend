<template>
    <LoginForm />
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
const authStore = useAuthStore();

authStore.clearUniqueAccountId();
authStore.clearAuthToken();

</script>

<style scoped>
    h2 {
        color: blue;
        margin-bottom: 20px;
        font-size: 36px;
    }
    p {
        color: green;
        margin: 20px 0;
    }

</style>
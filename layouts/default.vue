<template>
    <header class="shadow-sm bg-white">
        <nav class="container mx-auto p-4 flex justify-between">
            <NuxtLink class="font-bold" to="/">Private Rag</NuxtLink>
            <ul class="flex gap-4">
                <li><NuxtLink class="btn" to="/">Home</NuxtLink></li>
                <li><NuxtLink to="/login">Login</NuxtLink></li>
                <li><NuxtLink to="/users">Users</NuxtLink></li>
                <li><NuxtLink to="/folders">Documents</NuxtLink></li>
            </ul>
        </nav>
    </header>
    <div class="container mx-auto p-4">
        <slot />
    </div>
</template>

<script setup lang="ts" >

</script>

<style scoped>
.router-link-exact-active {
    color: #12b448;
}
</style>
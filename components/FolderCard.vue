<template>
        <div class="card text-center">
            <p class="font-bold text-gray-500 m-4">Folder Name: {{ folder.folder_name }}</p>
            <p>Folder ID: {{ folder.id }}</p>
            <NuxtLink :to="`/folders/${folder.id}`">
                <p class="btn my-4"> View Documents</p>
            </NuxtLink>
        </div>
</template>

<script setup lang="ts">
const { folder } = defineProps<{
    folder: {
        id: number;
        folder_name: string;
    };
}>();

</script>

<style scoped>

</style>
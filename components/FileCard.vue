<template>
        <div class="card text-center">
            <p class="font-bold text-gray-500 m-4 truncate">File Name: {{ file.file_name }}</p>
            <p>File ID: {{ file.id }}</p>
            <!-- <NuxtLink :to="`/folders/${folder.id}`">
                <p class="btn my-4"> View File</p>
            </NuxtLink> -->
        </div>
</template>

<script setup lang="ts">
const { file } = defineProps<{
    file: {
        id: number;
        file_name: string;
    };
}>();

</script>

<style scoped>

</style>
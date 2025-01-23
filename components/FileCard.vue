<template>
        <div class="card text-left">
            <p class="font-bold text-gray-500 m-4 truncate">{{ file.file_name }}</p>
            <p class="font-bold text-gray-500 m-4">ID: {{ file.id }}</p>
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
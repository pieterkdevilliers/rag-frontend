<template>
        <UCard>
                <p class="font-bold text-gray-500 m-4">{{ folder.id }}</p>
                <p class="font-bold text-gray-500 m-4">{{ folder.folder_name }}</p>
            <template #footer>
                <UButton 
                    :to="`/folders/${folder.id}`"
                    label="View Documents"
                    icon="i-heroicons:clipboard-document-list">
                </UButton>
            </template>
        </UCard>
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
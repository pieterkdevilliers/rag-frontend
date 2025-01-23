<template>
        <UCard>
                <p class="font-bold text-gray-500 m-4">{{ folder.id }}</p>
                <p class="font-bold text-gray-500 m-4">{{ folder.folder_name }}</p>
            <template #footer>
                <div class="flex gap-2">
                    <UButton 
                        :to="`/folders/${folder.id}`"
                        icon="i-heroicons:clipboard-document-list">
                    </UButton>
                    <UButton 
                        icon="i-heroicons:pencil-square">
                    </UButton>
                    <UButton 
                        icon="i-heroicons:trash">
                    </UButton>
                </div>
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
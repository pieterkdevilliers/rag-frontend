<template>
	<section class="Web-widgets container--default mx-auto">
		<div class="page-header">
			<h2 class="heading heading--2">Web Widgets</h2>
			<div
				v-if="canAddWidgets"
				class="flex justify-start sm:justify-end gap-6 my-2"
			>
				<UButton
					icon="i-heroicons:plus-circle-16-solid"
					variant="outline"
					label="Add Widget"
					@click="openAddWidgetModal"
				/>
			</div>
		</div>
		<div class="search-pagination-container"></div>
		<div v-if="canAddWidgets">
			<div class="web-widgets-grid card-grid">
				<div v-for="widget in widgets?.api_keys" :key="widget.id">
					<WidgetCard
						:widget="widget"
						@widget-deleted="handleWidgetRemoved"
						@edit-widget-clicked="openEditWidgetModal"
					/>
				</div>
			</div>

			<!-- Add Widget Modal -->
			<UModal v-model="isAddWidgetModalOpen">
				<div class="p-5">
					<AddWidgetForm
						@close="closeAddWidgetModal"
						@widgetAdded="refreshWidgets"
					/>
				</div>
			</UModal>

			<!-- Edit Widget Modal -->
			<EditWidgetModal
				:is-open="isEditWidgetModalOpen"
				:widget="widgetToEdit"
				@close="closeEditWidgetModal"
				@widget-updated="handleWidgetUpdated"
			/>

			<UNotifications />
		</div>
		<div v-if="!canAddWidgets">
			<div class="flex justify-center mb-4 mt-12">
				<UButton
					icon="i-heroicons:plus-circle-16-solid"
					label="Widgets not available - subscribe to create web widgets"
					to="/accounts"
				/>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
import { ref, computed } from 'vue';
import { useAuthStore } from '~/stores/auth';
import AddWidgetForm from '~/components/AddWidgetForm.vue'; // Import modal component
import type { list } from 'postcss';
import WidgetCard from '~/components/WidgetCard.vue';
import EditWidgetModal from '~/components/EditWidgetModal.vue';
import { useFetch } from '#app'; // Ensure you have this import for useFetch

definePageMeta({
	middleware: 'auth',
	layout: 'user-access',
});

interface Widget {
	id: number;
	name: string;
	allowed_origins: string[];
	created_at: string;
	display_prefix: string;
}

const authStore = useAuthStore();
const apiAuthorizationToken = authStore.access_token;
const uniqueAccountId = authStore.uniqueAccountId;
const canAddWidgets = computed(() => authStore.subs_status);

const {
	data: widgets,
	error,
	refresh,
} = await useFetch(
	`${config.public.apiBase}/list-api-keys/${uniqueAccountId}`,
	{
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: `Bearer ${apiAuthorizationToken}`,
		},
	}
);

console.log('Widgets fetched:', widgets.value.api_keys || []);

if (error.value) {
	console.error('Error fetching widgets:', error.value);
} else {
	console.log('Stored Unique Account ID:', authStore.uniqueAccountId);
}

const handleWidgetRemoved = (deletedWidgetId: number) => {
	console.log(
		`Widget with ID ${deletedWidgetId} was reported as deleted. Triggering refresh.`
	);
	refreshWidgets();
};
// Modal state
const isAddWidgetModalOpen = ref(false);

const openAddWidgetModal = () => {
	isAddWidgetModalOpen.value = true;
	console.log('Add Widget Modal opened');
};

const closeAddWidgetModal = () => {
	isAddWidgetModalOpen.value = false;
	console.log('Add Widget Modal closed');
};

const refreshWidgets = async () => {
	console.log('Refreshing widgets...');
	await refresh();
};

// --- State for Edit Widget Modal ---
const isEditWidgetModalOpen = ref(false);
const widgetToEdit = ref<Widget | null>(null);

const openEditWidgetModal = (widget: Widget) => {
	widgetToEdit.value = widget;
	isEditWidgetModalOpen.value = true;
};

const closeEditWidgetModal = () => {
	isEditWidgetModalOpen.value = false;
	widgetToEdit.value = null; // Clear the selected widget
};

const handleWidgetUpdated = async (updatedWidget: Widget) => {
	// Option 1: Refresh the whole list (simpler)
	await refreshWidgets();
};
</script>

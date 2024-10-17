<template>
    <div class="container mx-auto p-4">
        <!-- Action selector -->
        <div class="mb-4">
            <select v-model="selectedAction" class="p-2 border rounded">
                <option value="">Select an action</option>
                <option value="delete">Delete</option>
                <!-- Add more actions as needed -->
            </select>
            <button @click="performAction" class="ml-2 p-2 bg-blue-500 text-white rounded">
                Perform Action
            </button>
        </div>

        <!-- Table header -->
        <div class="flex font-bold bg-gray-100">
            <div class="p-2 w-10">
                <input type="checkbox" @change="toggleAllRows" v-model="allRowsSelected">
            </div>
            <div v-for="column in columns" :key="column.key" class="p-2 flex-1">
                {{ column.label }}
                <button @click="toggleSort(column.key)" class="ml-1">
                    {{ getSortIcon(column.key) }}
                </button>
            </div>
        </div>

        <!-- Table rows -->
        <div v-for="row in sortedRows" :key="row.id" class="flex border-b">
            <div class="p-2 w-10">
                <input type="checkbox" v-model="selectedRows" :value="row.id">
            </div>
            <div v-for="column in columns" :key="column.key" class="p-2 flex-1">
                {{ row[column.key] }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Props
const props = defineProps({
    rows: {
        type: Array,
        required: true
    },
    columns: {
        type: Array,
        required: true
    }
});

// State
const selectedRows = ref([]);
const allRowsSelected = ref(false);
const sortKey = ref('');
const sortOrder = ref('asc');
const selectedAction = ref('');

// Computed
const sortedRows = computed(() => {
    if (!sortKey.value) return props.rows;
    return [...props.rows].sort((a, b) => {
        const aValue = a[sortKey.value];
        const bValue = b[sortKey.value];
        if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1;
        return 0;
    });
});

// Methods
function toggleSort(key) {
    if (sortKey.value === key) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    } else {
        sortKey.value = key;
        sortOrder.value = 'asc';
    }
}

function getSortIcon(key) {
    if (sortKey.value !== key) return '⇅';
    return sortOrder.value === 'asc' ? '↑' : '↓';
}

function toggleAllRows() {
    if (allRowsSelected.value) {
        selectedRows.value = props.rows.map(row => row.id);
    } else {
        selectedRows.value = [];
    }
}

function performAction() {
    if (selectedAction.value === 'delete') {
        deleteRows(selectedRows.value);
    }
    // Add more actions as needed
}

function deleteRows(ids) {
    // Implement delete functionality here
    console.log('Deleting rows with IDs:', ids);
}
</script>
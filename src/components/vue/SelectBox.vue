<template>
    <div class="relative w-72">
        <button type="button" class="dropdown-button" @click="toggleDropdown">
            <span class="flex items-center">
                <span :class="['block truncate', getOptionClass(selectedOption)]">
                    {{ getDisplayText(selectedOption) }}
                </span>
            </span>
            <span class="dropdown-icon">
                <ChevronsUpDown class="h-5 w-5 text-indigo-500" aria-hidden="true" />
            </span>
        </button>
        <transition name="dropdown">
            <ul v-if="isOpen" class="dropdown-list">
                <li v-for="option in options" :key="option.id" :class="['dropdown-item', getItemClass(option)]"
                    @click="handleSelect(option)">
                    <div class="flex items-center justify-between w-full">
                        <span :class="getOptionClass(option)">
                            {{ option.name }}
                        </span>
                        <CheckIcon v-if="isSelected(option)" class="h-5 w-5 text-indigo-500" aria-hidden="true" />
                    </div>
                </li>
            </ul>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { ChevronsUpDown, Check as CheckIcon } from 'lucide-vue-next';

interface Option {
    id: number;
    name: string;
}

const props = defineProps<{
    options: Option[],
    onSelect: Function
}>();
const isOpen = ref(false);
const selectedOption = ref<Option | null>(props.options[0]);

const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
};

const handleSelect = (option: Option) => {
    selectedOption.value = option;
    props.onSelect(option);
    isOpen.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative.w-72')) {
        isOpen.value = false;
    }
};

const getDisplayText = (option: Option | null): string => {
    return option ? option.name : '\u00A0'; // Non-breaking space
};

const getOptionClass = (option: Option | null): string => {
    return isSelected(option) ? 'font-medium' : '';
};

const getItemClass = (option: Option): string => {
    return isSelected(option) ? ' hover:bg-gray-200 ' : 'text-gray-900 hover:bg-indigo-500 hover:text-white hover:font-bold';
};

const isSelected = (option: Option): boolean => {
    return option.id === selectedOption.value?.id;
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.dropdown-button {
    @apply relative w-full cursor-pointer rounded-lg bg-white py-3 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-purple-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-300 sm:text-sm;
}

.dropdown-icon {
    @apply pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2;
}

.dropdown-list {
    @apply absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm;
}

.dropdown-item {
    @apply relative cursor-pointer select-none py-2 pl-3 pr-9;
}
.dropdown-enter-active,
.dropdown-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>
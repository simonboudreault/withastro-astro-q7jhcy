<template>
    <div class="relative w-72"> <button type="button"
            class="relative w-full cursor-default rounded-lg bg-white py-3 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
            @click="toggleDropdown"> <span class="flex items-center"> <span
                    :class="['block truncate', selectedOption.id === options[0].id ? 'font-medium' : 'font-normal']">
                    <!-- Add a non-breaking space (&nbsp;) when no option is selected to maintain height --> {{
                selectedOption ? selectedOption.name : '&nbsp;' }} </span> </span> <span
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <!-- <ChevronUpDown class="h-5 w-5 text-gray-400" aria-hidden="true" /> --> </span> </button>
        <transition name="dropdown">
            <ul v-if="isOpen"
                class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                <li v-for="option in options" :key="option.id"
                    :class="['relative cursor-default select-none py-2 pl-3 pr-9', option.id === selectedOption.id ? 'bg-indigo-600 text-white' : 'text-gray-900']"
                    @click="handleSelect(option)"> <span
                        :class="['block truncate', option.id === selectedOption.id ? 'font-medium' : 'font-normal']"> {{
                option.name }} </span> <span v-if="option.id === selectedOption.id"
                        class="absolute inset-y-0 right-0 flex items-center pr-4">
                        <!-- <Check class="h-5 w-5" aria-hidden="true" /> --> </span> </li>
            </ul>
        </transition>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
// import { ChevronUpDown, Check } from 'lucide-vue-next'; 
interface Option { id: number; name: string; }
const props = defineProps<{ options: Option[] }>();
const isOpen = ref(false); const selectedOption = ref<Option | null>(props.options[0]);
const toggleDropdown = () => { isOpen.value = !isOpen.value; };
const handleSelect = (option: Option) => { selectedOption.value = option; isOpen.value = false; };
const handleClickOutside = (event: MouseEvent) => { const target = event.target as HTMLElement; if (!target.closest('.relative.w-72')) { isOpen.value = false; } };
onMounted(() => { document.addEventListener('click', handleClickOutside); });
onBeforeUnmount(() => { document.removeEventListener('click', handleClickOutside); });
</script>
<style scoped>
/* Any additional styles can be added here if needed */
.dropdown-enter-active,
.dropdown-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

li:hover {
    background-color: #f3f4f6;
}
</style>
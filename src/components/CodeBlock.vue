<script setup>
import 'highlight.js/styles/night-owl.css';
import javascript from 'highlight.js/lib/languages/javascript';
import { onMounted, ref } from 'vue';
import hljs from 'highlight.js/lib/core';
hljs.registerLanguage('javascript', javascript);

const props = defineProps({
    code: {
        type: String,
        required: true
    },
    language: {
        type: String,
        default: 'plaintext'
    }
});

const copySuccess = ref(false);
const codeRef = ref(null);

const copyCode = () => {
    console.log('copying code');
    navigator.clipboard.writeText(props.code).then(() => {
        copySuccess.value = true;
        setTimeout(() => {
            copySuccess.value = false;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy code: ', err);
    });
};

onMounted(() => {
    if (codeRef.value) {
        hljs.highlightElement(codeRef.value);
    }
});
</script>

<template>
    <div class="flex flex-col rounded-md overflow-hidden">
        <div class="flex justify-between items-center bg-gray-800 px-4 py-2">
            <span class="text-gray-300 font-mono">{{ language }}</span>
            <button @click="copyCode"
                class="bg-blue-500 text-white rounded px-2 py-1 hover:bg-blue-400 transition duration-300">
                {{ copySuccess ? 'Copied!' : 'Copy code' }}
            </button>
        </div>
        <pre class="overflow-x-auto whitespace-normal rounded-bl-md rounded-br-md">
            <code ref="codeRef" :class="`language-${language}`" class="text-white whitespace-pre-wrap">{{ code }}</code>
        </pre>
    </div>
</template>

<style scoped>
.copy-btn {
    cursor: pointer;
}
</style>
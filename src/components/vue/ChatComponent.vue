<template>
    <div class="bg-white shadow sm:rounded-lg -2xl mx-auto mt-10">
        <div>
            <!-- {{ JSON.stringify(session) }} -->
        </div>
        <div class="px-4 py-5 sm:p-6">
            <h2 class="text-2xl font-bold mb-4 text-gray-900">{{ greeting }}</h2>
            <div class="mb-4">
                <label id="api-select-label" class="block text-sm font-medium text-gray-700">Select API</label>
                <div class="mt-1">
                    <SelectBox :options="apiOptions" :onSelect="selectApi" />
                </div>

            </div>

            <div class="space-y-4 mb-4 m-h-64 overflow-y-auto conversation">
                <div v-for="(message, index) in session.conversation" :key="index" class="flex relative group">
                    <div :class="[
                        'px-4 py-2 rounded-lg',
                        message.role === 'user'
                            ? 'bg-indigo-100 text-indigo-800 ml-auto'
                            : 'bg-gray-100 text-gray-800'
                    ]">
                        <div v-if="message.role === 'assistant'" class="font-semibold mb-1">Assistant:</div>
                        <div v-else class="font-semibold mb-1">You:</div>
                        <div v-for="(part, partIndex) in message.content" :key="partIndex">
                            <span v-if="part.type === 'text'" v-html="part.content"></span>
                            <CodeBlock v-else-if="part.type === 'code'" :code="part.content"
                                :language="part.language" />
                        </div>
                    </div>
                    <button @click="removeMessage(index)"
                        class="absolute top-1 right-1 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <form @submit.prevent="submitData" class="mt-4">
                <label for="userInput" class="sr-only">Message</label>
                <textarea id="userInput" v-model="userInput" rows="3"
                    class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Type your prompt here..."></textarea>

                <div class="mt-4">
                    <button type="submit" :disabled="isLoading"
                        class="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <span v-if="!isLoading">Submit</span>
                        <div v-else class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    </button>
                </div>
            </form>

            <p v-if="error" class="mt-4 text-red-600">
                {{ error }}
            </p>
        </div>
    </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import CodeBlock from './CodeBlock.vue';
import SelectBox from './SelectBox.vue';
import { useStore } from '@nanostores/vue'
import { $sessions, setSessions, $currentSession, addMessageToCurrentSession } from '../../store/session'

const greeting = 'AI Chat Interface';
const userInput = ref('');
const error = ref('');
const isLoading = ref(false);


// const convo = useStore($currentSession) || 'nothig';
// const conversation = ref(convo.value.conversation || []);
const session = useStore($currentSession)
// const conversation = ref(session.conversation || []);
const open = ref(false);
const hoveredApi = ref(null);
const apiOptions = [
    { name: 'Chat GPT', id: 'openAI' },
    { name: 'Claude', id: 'anthropic' }
]
const selectedApi = ref(apiOptions[1]);

const apiEndpoints = {
    openAI: 'http://localhost:3000/generate',
    anthropic: 'http://localhost:3000/anthropic'
};

const currentApiEndpoint = computed(() => apiEndpoints[selectedApi.value.id]);

const toggleDropdown = () => {
    open.value = !open.value;
};

const removeMessage = (index) => {
    conversation.value.splice(index, 1);
};

const selectApi = (api) => {
    selectedApi.value = api;
    open.value = false;
};
const formatMessage = (content) => {
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
    const boldPattern = /\*\*(.*?)\*\*/g;
    const italicPattern = /\*(.*?)\*/g;
    const linkPattern = /\[(.*?)\]\((.*?)\)/g;


    let lastIndex = 0;
    const parts = [];
    const processText = (text) => {

        // Format bold
        text = text.replace(boldPattern, '<strong>$1</strong>');

        // Format italic
        text = text.replace(italicPattern, '<em>$1</em>');

        // Format links
        text = text.replace(linkPattern, '<a href="$2">$1</a>');

        // Handle new lines
        text = text.replace(/\n/g, '<br>');

        return text;
    };

    // Process code blocks and text
    content.replace(codeBlockRegex, (match, language, code, offset) => {
        // Add formatted text before code block
        if (offset > lastIndex) {
            const textBefore = content.slice(lastIndex, offset);
            parts.push({ type: 'text', content: processText(textBefore) });
        }
        // Add code block
        parts.push({ type: 'code', language: language || 'plaintext', content: code.trim() });
        lastIndex = offset + match.length;
    });

    // Add remaining formatted text after last code block
    if (lastIndex < content.length) {
        const remainingText = content.slice(lastIndex);
        parts.push({ type: 'text', content: processText(remainingText) });
    }

    return parts;
};

const contexts = [
    {
        id: '1',
        name: 'Context 1',
        content: 'you are a code assistant, you write quality code, everything you write is seperated in simple, single responsabillity, pure functions'
    },
    {
        id: '2',
        name: 'Context 2',
        content: 'you are a code assistant, you write quality code, everything you write is seperated in simple, single responsabillity, pure functions'
    },
]

const selectedContext = ref();

const addContext = (content) => {
    content = `${selectedContext.value}\n${content}`;
    console.log(content);
    const newMessage = { role: 'assistant', content };
    addMessageToCurrentSession(newMessage);

};

const submitData = async () => {
    if (selectedContext.value && !conversation.value.length) {
        addContext(userInput.value);
    }

    if (!userInput.value.trim()) {
        error.value = 'Please enter a prompt before submitting.';
        return;
    }

    error.value = '';
    isLoading.value = true;
    const context = ''
    // const content = `${context}\n${userInput.value}`;
    const content = `${userInput.value}`;

    const newMessage = { role: 'user', content: [{ type: 'text', content }] };
    addMessageToCurrentSession(newMessage);
    // conversation.value.push({ role: 'user', content: [{ type: 'text', content }] });
    console.log('session', $currentSession.get()); 

    try {
        const res = await fetch(currentApiEndpoint.value, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: $currentSession.get().conversation.map(msg => ({
                    role: msg.role,
                    content: msg.content.map(part => part.content).join('\n')
                }))
            }),
        });

        if (!res.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await res.json();
        const formattedContent = formatMessage(data.result);
        const newMessage = { role: 'assistant', content: formattedContent };
        addMessageToCurrentSession(newMessage);
        // conversation.value.push({ role: 'assistant', content: formattedContent });
        userInput.value = '';
    } catch (err) {
        console.error('Error:', err);
        error.value = 'An error occurred while submitting. Please try again.';
    } finally {
        isLoading.value = false;
    }
};

</script>

<style scoped>
/* Add any component-specific styles here */
</style>
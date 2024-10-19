<template>
    <div class="bg-white shadow sm:rounded-lg -2xl mx-auto mt-10">
        <div>
            <!-- user : {{ JSON.stringify(user) }} <br>
            session : {{ JSON.stringify(session) }} -->
        </div>
        <div class="px-4 py-5 sm:p-6">
            <h2 class="text-2xl font-bold mb-4 text-gray-900">{{ greeting }}</h2>

            <div>
                <label for="context-select" class="block text-sm font-medium text-gray-700">Select Context</label>
                <div class="mt-1">
                    <div v-for="contextType in contextTypes">
                        <div class="mb-2">
                            <label for="context-select" class="block text-sm font-medium text-gray-700">{{
                                contextType.name }}</label>
                            <div class="mt-1">
                                <SelectBox :options="contextType.entries" :onSelect="selectContext" :defaultValue="0" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mb-4">
                <label for="context-input" class="block text-sm font-medium text-gray-700">Context</label>
                <div class="mt-1">
                    <textarea id="context-input" v-model="context"
                        class="peer h-full min-h-[100px] w-full resize-none rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
                        placeholder=" ">  </textarea>
                </div>
            </div>

            <div class="mb-4">
                <label id="api-select-label" class="block text-sm font-medium text-gray-700">Select API</label>
                <div class="mt-1">
                    <SelectBox :options="apiOptions" :onSelect="selectApi" :defaultValue="1" />
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
import { ref, computed, onMounted, defineProps } from 'vue';
import CodeBlock from './CodeBlock.vue';
import SelectBox from './SelectBox.vue';
import { useStore } from '@nanostores/vue'
import { $currentSession, addMessageToCurrentSession, setSessionUser } from '../../store/session'
import { $user, setUser } from '../../store/user'

// add props
const props = defineProps({
    user: {
        type: Object,
        required: true
    }
});

const greeting = 'AI Chat Interface';
const userInput = ref('');
const error = ref('');
const isLoading = ref(false);


const session = useStore($currentSession)
const user = useStore($user)
const open = ref(false);
const context = ref('')
const apiOptions = [
    { name: 'Chat GPT', id: 'openAI' },
    { name: 'Claude', id: 'anthropic' }
]
const selectedApi = ref(apiOptions[1]);

onMounted(() => {
    // selectApi(apiOptions[1]);
    // console.log('mounted');
    // setUser({
    //     id: props.user.id,
    //     email: props.user.email,
    // });
    // console.log(props.user)
});

const apiEndpoints = {
    openAI: 'http://localhost:3000/generate',
    anthropic: 'api/ai/completion'
};

const currentApiEndpoint = computed(() => apiEndpoints[selectedApi.value.id]);

const removeMessage = (index) => {
    session.value.conversation.splice(index, 1);
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

const contextTypes = ref([
    {
        name: 'code assistant',
        entries: [
            {
                id: 1,
                name: 'Context 1',
                content: 'you are a code assistant, you write quality code, everything you write is seperated in simple, single responsabillity, pure functions'
            },
            {
                id: 2,
                name: 'Context 2',
                content: 'you are a code assistant, you write quality code, everything you write is seperated in simple, single responsabillity, pure functions'
            },
        ]
    },
    {
        name: 'dnd assistant',
        entries: [
            {
                id: 1,
                name: 'Builds',
                content: 'you are a dungeons and dragons (dnd) expert 5th edition (5e). You help me create character builds that are fun to play and powerful. Explain the race, the levels the choices, the skills.'
            },
            {
                id: 2,
                name: 'Plots',
                content: 'you are a dungeons and dragons (dnd) expert 5th edition (5e). You are an exceptionnal writer and create very relatable, complex, human and emotionnal plots with interesting storypoints and twists. create a resume of a plot for the backstory af a character. You must be very succint, only writing the bare minimum to capture ideas, almost as a list. start from the following description : '
            }, {
                id: 3,
                name: 'Background writing',
                content: 'you are a great story writer in the likes of george r.r. martin, Tolkien and lovecraft. I want you to write a background story using an engaging style, told from the character at the first person, applying the following plot :'
            },
            {

            }

        ]
    }
])

const selectedContext = ref();

const addContext = (userInput) => {
    if ((/*!selectedContext.value && */ !context.value) || session.value.conversation.length !== 0) {
        return;
    }
    // const updatedInput  = `${context.value}\n${userInput.value}`;
    // console.log(updatedInput);
    console.log(context.value);
    const newMessage = { role: 'assistant', content: [{ type: 'text', content: context.value }] };
    addMessageToCurrentSession(newMessage, true);

};

const selectContext = contextEntry => {
    // selectedContext.value = context;
    console.log('selecting context', contextEntry);
    context.value = contextEntry.content;
}

const submitData = async () => {

    if (!userInput.value.trim()) {
        error.value = 'Please enter a prompt before submitting.';
        return;
    }
    const inputWithContext = addContext(userInput);

    error.value = '';
    isLoading.value = true;
    const context = ''
    // const content = `${context}\n${userInput.value}`;
    const content = `${userInput.value}`;

    const newMessage = { role: 'user', content: [{ type: 'text', content }] };
    addMessageToCurrentSession(newMessage);
    // session.conversation.value.push({ role: 'user', content: [{ type: 'text', content }] });
    setSessionUser(props.user.id);

    const currentSession = $currentSession.get();
    console.log('submit data');
    console.log(currentSession);

    // ! quand je load la session, la conversation content est pas splitté en parts
    const body = JSON.stringify({
        messages: currentSession.conversation.map(msg => ({
            role: msg.role,
            content: msg.content.map(part => part.content).join('\n')
        })),
    })

    try {
        const res = await fetch(currentApiEndpoint.value, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Access-Control-Allow-Origin': '*',
            },
            body,
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
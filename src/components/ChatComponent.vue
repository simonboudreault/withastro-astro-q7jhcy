<script setup>
import { ref, computed } from 'vue';
import CodeBlock from './CodeBlock.vue'; // Make sure this path is correct

// Register other languages as needed

const greeting = 'AI Chat Interface';
const userInput = ref('');
const error = ref('');
const isLoading = ref(false);
const selectedApi = ref('openAI');
const oldConversation = [{ "role": "user", "content": [{ "type": "text", "content": "give me 2 js functions seperated by plain text and numbered" }] }, { "role": "assistant", "content": [{ "type": "text", "content": "Here are 2 JavaScript functions separated by plain text and numbered:" }, { "type": "code", "language": "plaintext", "content": "1. Function to calculate the factorial of a number:" }, { "type": "code", "language": "javascript", "content": "function factorial(n) {\n  if (n === 0 || n === 1) {\n    return 1;\n  } else {\n    return n * factorial(n - 1);\n  }\n}" }, { "type": "code", "language": "plaintext", "content": "This function calculates the factorial of a given number using recursion. The factorial of a non-negative integer n is the product of all positive integers less than or equal to n.\n\n2. Function to check if a string is a palindrome:" }, { "type": "code", "language": "javascript", "content": "function isPalindrome(str) {\n  const cleanStr = str.toLowerCase().replace(/[^a-z0-9]/g, '');\n  return cleanStr === cleanStr.split('').reverse().join('');\n}" }, { "type": "text", "content": "<br><br>This function checks if a given string is a palindrome. It first removes all non-alphanumeric characters and converts the string to lowercase. Then it compares the cleaned string with its reverse to determine if it's a palindrome." }] }]
const conversation = ref([]);
const open = ref(false);
const hoveredApi = ref(null);

const apiEndpoints = {
    openAI: 'http://localhost:3000/generate',
    anthropic: 'http://localhost:3000/anthropic'
};

"Of course! What kind of list do you need? Here are a few examples to get you started:\n\n1. Grocery list\n2. To-do list\n3. Travel packing list\n4. Book recommendations\n5. Movie recommendations\n\nJust let me know what you're looking for, and I'll help you create the perfect list!"

const currentApiEndpoint = computed(() => apiEndpoints[selectedApi.value]);

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
    const listPattern = /(?:^|\n)(\d+\.\s.*|[-*]\s.*)/g;
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let lastIndex = 0;
    const parts = [];

    content = content.replace(listPattern, (match, p1) => {
        const listItem = p1.trim();
        const isNumberedList = /^\d+\.\s/.test(listItem);
        const listType = isNumberedList ? 'ol' : 'ul';
        return `<${listType}><li>${listItem}</li></${listType}>`;
    });

    // Handle new lines
    content = content.replace(/\n/g, '<br>');

    content.replace(codeBlockRegex, (match, language, code, offset) => {
        // Add text before code block
        if (offset > lastIndex) {
            parts.push({ type: 'text', content: content.slice(lastIndex, offset) });
        }
        // Add code block
        parts.push({ type: 'code', language: language || 'plaintext', content: code.trim() });
        lastIndex = offset + match.length;
    });

    // Add remaining text after last code block
    if (lastIndex < content.length) {
        parts.push({ type: 'text', content: content.slice(lastIndex) });
    }

    return parts;
};


const formatMessage2 = (content) => {
    const listPattern = /(?:^|\n)(\d+\.\s.*|[-*]\s.*)/g;
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let lastIndex = 0;
    const parts = [];

    // Function to process text content
    const processText = (text) => {
        // Format lists
        text = text.replace(listPattern, (match, p1) => {
            const listItem = p1.trim();
            const isNumberedList = /^\d+\.\s/.test(listItem);
            const listType = isNumberedList ? 'ol' : 'ul';
            return `<${listType}>${listItem}`;
        });

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
const formatMessage3 = (content) => {
    const listPattern = /(?:^|\n)(\d+\.\s.*|[-*]\s.*)/g;
    const codeBlockRegex = /(\w+)?\n([\s\S]*?)```/g;
    const boldPattern = /\*\*(.*?)\*\*/g;
    const italicPattern = /\*(.*?)\*/g;
    const linkPattern = /\[(.*?)\]\((.*?)\)/g;

    let lastIndex = 0;
    const parts = [];

    // Function to process text content
    const processText = (text) => {
        // Format lists
        text = text.replace(listPattern, (match, p1) => {
            const listItem = p1.trim();
            const isNumberedList = /^\d+\.\s/.test(listItem);
            const listType = isNumberedList ? 'ol' : 'ul';
            return `<${listType}>${listItem}`;
        });

        // Format bold
        text = text.replace(boldPattern, '$1');

        // Format italic
        text = text.replace(italicPattern, '$1');

        // Format links
        text = text.replace(linkPattern, '$1');

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
const formatMessage4 = (content) => {
    console.log('format 4')
    const listPattern = /(?:^|\n)(\d+\.\s.*|[-*]\s.*)/g;
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
    const boldPattern = /\*\*(.*?)\*\*/g;
    const italicPattern = /\*(.*?)\*/g;
    const linkPattern = /\[(.*?)\]\((.*?)\)/g;

    let lastIndex = 0;
    const parts = [];
    // return [{ type: 'text', content: content }]
    let listCounter = 1;

    "Certainly! Here is the same answer again:\n\n### Grocery List:\n\n1. Apples\n2. Bananas\n3. Carrots\n4. Donuts\n5. Eggs\n\n### JavaScript Function\n\nHere's a JavaScript function that takes in a grocery list array and prints each item:\n\n```javascript\n// Define the grocery list array\nconst groceryList = ['Apples', 'Bananas', 'Carrots', 'Donuts', 'Eggs'];\n\n// Function to print each item in the grocery list\nfunction printGroceryList(list) {\n    console.log(\"Grocery List:\");\n    list.forEach((item, index) => {\n        console.log(`${index + 1}. ${item}`);\n    });\n}\n\n// Call the function with the grocery list\nprintGroceryList(groceryList);\n```\n\n### Explanation:\n\n1. **Array Definition:** We first define a constant array named `groceryList` that contains our list of grocery items.\n2. **Function Definition:** We then define a function `printGroceryList` that takes an array as an argument.\n3. **Printing Items:** Inside the function, we use `console.log` to print \"Grocery List:\" as a header. We then use the `forEach` method to iterate over each item in the array, printing each item along with its index (starting from 1 for human-friendly numbering).\n4. **Function Call:** Finally, we call the `printGroceryList` function and pass the `groceryList` array to it.\n\nWhen you run this JavaScript code, it will print out each item in the grocery list, formatted nicely with numbers."

    "\n\n### Grocery List:\n\n1. Apples\n2. Bananas\n3. Carrots\n4. Donuts\n5. Eggs\n\n### JavaScript Function\n\nHere's a JavaScript function that takes in a grocery list array and prints each item:\n\n```"

    "javascript\n// Define the grocery list array\nconst groceryList = ['Apples', 'Bananas', 'Carrots', 'Donuts', 'Eggs'];\n\n// Function to print each item in the grocery list\nfunction printGroceryList(list) {\n    console.log(\"Grocery List:\");\n    list.forEach((item, index) => {\n        console.log(`${index + 1}. ${item}`);\n    });\n}\n\n// Call the function with the grocery list\nprintGroceryList(groceryList);\n```"


    // Function to process text content
    const processText = (text) => {
        // Format lists
        // text = text.replace(listPattern, (match, p1) => {
        //     const listItem = p1.trim();
        //     const isNumberedList = /^\d+\.\s/.test(listItem);
        //     const listType = isNumberedList ? 'ol' : 'ul';
        //     const itemContent = listItem.replace(/^\d+\.\s|-\s/, '');
        //     if (isNumberedList) {
        //         return `<${listType}><li>${listCounter++}. ${itemContent}</li>`;
        //     }
        //     return `<${listType}><li>${itemContent}</li>`;
        // });

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


// function formatMessage(text) {
//     // Define regex patterns for lists and code blocks
//     const listPattern = /(?:^|\n)(\d+\.\s.*|[-*]\s.*)/g;
//     const codeBlockPattern = /```([a-z]*)\n([\s\S]*?)```/g;

//     // Format code blocks with syntax highlighting
//     text = text.replace(codeBlockPattern, (match, language, code) => {
//         // const highlightedCode = hljs.highlight(language, code).value;
//         console.log(code)
//         return `<pre><div class="code-block-header"><span>${language}</span><button class="copy-btn">Copy code</button></div><div class="code-block-body"><code class="language-${language}">${code}</code></div></pre>`;
//     });

//     // Format lists
//     text = text.replace(listPattern, (match, p1) => {
//         const listItem = p1.trim();
//         const isNumberedList = /^\d+\.\s/.test(listItem);
//         const listType = isNumberedList ? 'ol' : 'ul';
//         return `<${listType}><li>${listItem}</li></${listType}>`;
//     });

//     // Handle new lines
//     text = text.replace(/\n/g, '<br>');

//     return text;
// }

const submitData = async () => {
    if (!userInput.value.trim()) {
        error.value = 'Please enter a prompt before submitting.';
        return;
    }

    error.value = '';
    isLoading.value = true;

    conversation.value.push({ role: 'user', content: [{ type: 'text', content: userInput.value }] });

    try {
        const res = await fetch(currentApiEndpoint.value, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: conversation.value.map(msg => ({
                    role: msg.role,
                    content: msg.content.map(part => part.content).join('\n')
                }))
            }),
        });

        if (!res.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await res.json();
        const formattedContent = formatMessage4(data.result);
        conversation.value.push({ role: 'assistant', content: formattedContent });
        userInput.value = '';
    } catch (err) {
        console.error('Error:', err);
        error.value = 'An error occurred while submitting. Please try again.';
    } finally {
        isLoading.value = false;
    }
};

</script>

<template>
    <div class="bg-white shadow sm:rounded-lg -2xl mx-auto mt-10">
        <div class="px-4 py-5 sm:p-6">
            <h2 class="text-2xl font-bold mb-4 text-gray-900">{{ greeting }}</h2>
            <div class="mb-4">
                <label id="api-select-label" class="block text-sm font-medium text-gray-700">Select API</label>
                <div class="relative mt-1">
                    <button @click="toggleDropdown" type="button" aria-haspopup="listbox" :aria-expanded="open"
                        aria-labelledby="api-select-label"
                        class="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <span class="block truncate">{{ selectedApi === 'openAI' ? 'OpenAI' : 'Anthropic' }}</span>
                        <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd"
                                    d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                    clip-rule="evenodd" />
                            </svg>
                        </span>
                    </button>

                    <ul v-if="open"
                        class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                        tabindex="-1" role="listbox" aria-labelledby="api-select-label"
                        aria-activedescendant="api-option-openAI">
                        <li v-for="api in ['openAI', 'anthropic']" :key="api" :id="`api-option-${api}`"
                            @click="selectApi(api)" @mouseover="hoveredApi = api" @mouseout="hoveredApi = null"
                            role="option" :class="[
                'cursor-default select-none relative py-2 pl-3 pr-9',
                selectedApi === api ? 'text-indigo-600' :
                    (hoveredApi === api ? 'text-white bg-indigo-600' : 'text-gray-900')
            ]">
                            <span :class="{ 'font-semibold': selectedApi === api, 'font-normal': selectedApi !== api }"
                                class="block truncate">
                                {{ api === 'openAI' ? 'OpenAI' : 'Anthropic' }}
                            </span>
                            <span v-if="selectedApi === api"
                                class="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                    fill="currentColor" aria-hidden="true">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                            </span>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="space-y-4 mb-4 m-h-64 overflow-y-auto conversation">
                <div v-for="(message, index) in conversation" :key="index" class="flex relative group">
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

<style scoped>
/* Add any component-specific styles here */
</style>
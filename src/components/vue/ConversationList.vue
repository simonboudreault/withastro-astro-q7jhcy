<template>
  <div>
    <h1>Conversations</h1>
    <button @click="fetchData">Fetch Data</button>
    <div v-for="(item, index) in conversations" :key="index" class="block px-4 py-2 text-gray-800 hover:bg-gray-100">
      <button @click="setCurrentSession(item)">{{ item.label || 'no label' }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from '@nanostores/vue'
import { $sessions, setSessions, setCurrentSession } from '../../store/session'

// const props = defineProps(['postId'])

const sessions = useStore($sessions)
const props = defineProps({
  baseURL: {
    type: String,
    required: true
  }
});

// const baseURL = 'http://localhost:3000';
const conversations = ref(sessions);

function log() {
  console.log('log');
}

async function fetchData() {
  console.log('fetch data');
  try {
    const response = await fetch(`${props.baseURL}/api/session/get`);
    const data = await response.json();
    console.log(data);


    setSessions(data.data);

    conversations.value = data.data;
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

</script>
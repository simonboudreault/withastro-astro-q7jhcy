<script setup>
import { useStore } from '@nanostores/vue'
import { $sessions } from '../../store/session'

// const props = defineProps(['postId'])

const sessions = useStore($sessions)
function logSessions() {
    console.log(sessions.value)
}
</script>

<template>
    <div>
        <h1>STORE !!</h1>
        <button @click="logSessions">log</button>
        <div v-for="session in sessions">
            {{ session.label }}
        </div>
    </div>
</template>

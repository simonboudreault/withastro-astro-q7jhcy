<script setup>
import { useStore } from '@nanostores/vue'
import { $persistentUser, setPersistentUser } from '../../store/user';



const persistentUser = useStore($persistentUser)
function log() {
    console.log(persistentUser.value.email)
    setPersistentUser({ id: 'log id', email: 'new email' })
}
</script>

<template>
    <div>
        <h1>STORE !!</h1>
        <button @click="log">log</button>
        <div>
            {{ persistentUser.email }}
        </div>
    </div>
</template>

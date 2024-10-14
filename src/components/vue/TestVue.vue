<template>
    <div>
        <button @click="getUser" class="p-10 bg-orange-300">get use </button>
    </div>
</template>
<script setup>
import { ref } from 'vue'
const getUser = async () => {
    const res = await fetch('/api/auth/get-user')
    const user = await res.json()
    console.log(user)


}
// function logTest() {
//     console.log('test')
//     const user = getSupabaseUser()
//     console.log(user)
// }
</script>
<style></style>
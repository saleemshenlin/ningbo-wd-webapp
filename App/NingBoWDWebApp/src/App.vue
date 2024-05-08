<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onBeforeMount(async () => {
    router.replace('/login')
})
</script>
<template>
    <router-view></router-view>
</template>

<style lang="scss" scoped></style>

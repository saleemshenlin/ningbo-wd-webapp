<template>
    <DhiNotFound :goHome="goHome" />
</template>

<script lang="ts" setup>
import { DhiNotFound } from 'dhi-dss-mf-layout/layout-not-found'
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
    router.push('/')
}
</script>
<script lang="ts">
export default {
    name: 'not-found',
}
</script>

<style lang="scss" scoped>
.container {
    position: relative;
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
    overflow: hidden;
}
</style>

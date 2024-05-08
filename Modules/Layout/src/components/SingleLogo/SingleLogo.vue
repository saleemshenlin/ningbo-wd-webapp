<script setup lang="ts">
import logoImg from '../../assets/dhi_logo.svg'
const props = withDefaults(
    defineProps<{
        imgUrl: string
        height: number
        width: number
    }>(),
    {
        imgUrl: () => logoImg,
        height: () => 60,
        width: () => 60,
    },
)
</script>

<template>
    <a-image :height="props.height" :width="props.width" :src="imgUrl" :preview="false" />
</template>

<style lang="scss"></style>

<script setup lang="ts">
import Logo from '../SingleLogo/SingleLogo.vue'

export interface IProps {
    imgUrl: string
    height: number
    width: number
    title: string
}

const props = withDefaults(defineProps<IProps>(), {
    title: () => 'dhi-app-title-with-logo',
    imgUrl: () => '',
    height: () => 60,
    width: () => 60,
})
</script>

<template>
    <div class="app-title_logo">
        <Logo
            class="app-logo"
            :img-url="props.imgUrl"
            :height="props.height"
            :width="props.width"
        />
        <div class="app-title">{{ props.title }}</div>
    </div>
</template>

<style lang="scss">
.app-title_logo {
    display: flex;
    .app-logo,
    .app-title {
        line-height: 0.85rem;
    }

    .app-title {
        font-size: 0.32rem;
        font-weight: bold;
        color: var(--color-text-1);
        height: 0.85rem;
    }
}
</style>

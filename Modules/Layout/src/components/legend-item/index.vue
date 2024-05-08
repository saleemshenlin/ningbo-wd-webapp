<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
export interface IProps {
    data: Record<string, any>[]
    title: string
    unit: string
}
const props = withDefaults(defineProps<IProps>(), {
    data: () => [],
    title: '',
    unit: '',
})
</script>

<template>
    <div>
        <div class="legend-header" v-if="title !== ''">
            <span> {{ props.title }}</span>
            <span> {{ props.unit }}</span>
        </div>
        <div class="legend-item" v-for="item in props.data" :key="(item.description as string)">
            <span
                class="legend-icon"
                :style="{
                    backgroundColor: `rgb(${item.red}, ${item.green}, ${item.blue})`,
                }"
            >
            </span>
            <span class="legend-font">{{ item.description }}</span>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>

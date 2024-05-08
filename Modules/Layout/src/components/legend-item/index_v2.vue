<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
    defineProps<{
        data: Record<string, any>[]
        title: string
        unit: string
        gradient: boolean
        valueFormatter: (value: number) => string | number
    }>(),
    {
        data: () => [],
        title: '',
        unit: '',
        gradient: false,
        valueFormatter: (val: number) => val,
    },
)

const legendBackground = computed(() => {
    if (props.gradient) {
        const color = props.data.reduce((color: string, item: Record<string, any>) => {
            const rgb: string = `rgb(${item.red}, ${item.green}, ${item.blue})`
            return `${color}, ${rgb}`
        }, 'linear-gradient(to right ')
        return color + ')'
    } else {
        return 'transparent'
    }
})

const getLegendItemBackground = (item: Record<string, any>, index: number) => {
    if (props.gradient) {
        return 'transparent'
    } else {
        return `rgb(${item.red}, ${item.green}, ${item.blue})`
    }
}

const getLegendItemAlign = (item: Record<string, any>, index: number) => {
    if (!props.gradient) {
        return 'center'
    } else if (index === 0) {
        return 'left'
    } else if (index === props.data.length - 1) {
        return 'right'
    } else {
        return 'center'
    }
}

const getDescription = (item: Record<string, any>, index: number) => {
    if (!props.gradient) {
        return item.description
    } else if (index === 0) {
        return props.valueFormatter(item.minValue)
    } else if (index === props.data.length - 1) {
        return props.valueFormatter(item.minValue)
    } else {
        return props.valueFormatter(item.minValue)
    }
}
</script>

<template>
    <div>
        <div class="legend-header" v-if="title !== ''">
            <span> {{ props.title }}</span>
            <span> {{ props.unit && props.unit.length > 0 ? `(${props.unit})` : '' }}</span>
        </div>
        <div
            class="legend-group"
            :class="{ 'legend-group--gradient': props.gradient }"
            :style="{
                background: legendBackground,
            }"
        >
            <div
                class="legend-item"
                v-for="(item, index) in props.data"
                :key="(item.description as string)"
            >
                <span
                    class="legend-item"
                    :style="{
                        background: getLegendItemBackground(item, index),
                        textAlign: getLegendItemAlign(item, index),
                        width: props.gradient ? '30px' : 'auto',
                    }"
                    >{{ getDescription(item, index) }}</span
                >
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>

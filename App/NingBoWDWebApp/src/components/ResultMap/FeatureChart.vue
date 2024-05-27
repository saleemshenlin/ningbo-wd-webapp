<script setup lang="ts">
import { computed } from 'vue'
import mapFeatureInfo from '@/assets/icon/map-feature-info.svg'
import { junctionResultItems, pipeResultItems, tankResultItems } from './config'
import type { ActiveFeatureType } from './config'
import FeatureChartItem from './FeatureChartItem.vue'
import { WDModelResultEnum } from 'dhi-dss-api-store/result-service'

const props = withDefaults(
    defineProps<{
        feature: ActiveFeatureType | null
        fetchTSResult: (
            modelId: string,
            dataType: WDModelResultEnum,
        ) => Promise<{ t: string[]; v: number[] }>
    }>(),
    {
        feature: null,
        fetchTSResult: () => Promise.resolve({ t: [], v: [] }),
    },
)

const showAttributes = computed(() => {
    if (props.feature === null) {
        return []
    } else if (props.feature.type === 'junction') {
        return junctionResultItems
    } else if (props.feature.type === 'pipe') {
        return pipeResultItems
    } else if (props.feature.type === 'tank') {
        return tankResultItems
    } else {
        return []
    }
})

const title = computed(() => {
    if (props.feature === null) {
        return ''
    } else if (props.feature.type === 'junction') {
        return '节点'
    } else if (props.feature.type === 'pipe') {
        return '管道'
    } else if (props.feature.type === 'tank') {
        return '水池'
    } else {
        return ''
    }
})

const componentShown = computed(() => {
    return props.feature !== null && !['device'].includes(props.feature.type)
})
</script>

<template>
    <div class="feature-chart" v-if="componentShown">
        <div class="feature-chart-item" v-for="item in showAttributes" :key="item.key">
            <div class="header">
                <a-image :height="20" :width="20" :src="mapFeatureInfo" :preview="false" />
                {{ title }}{{ item.label }}变化曲线
            </div>
            <div class="chart-content">
                <FeatureChartItem
                    :feature="props.feature"
                    :item="item"
                    :fetchTSResult="props.fetchTSResult"
                />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import './style.scss';
</style>

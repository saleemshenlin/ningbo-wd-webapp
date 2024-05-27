<script setup lang="ts">
import { computed } from 'vue'
import {
    ActiveFeatureType,
    alarmShowAttributes,
    junctionShowAttributes,
    pipeShowAttributes,
    tankShowAttributes,
    needFormatDateKey,
    needFormatUnitKey,
    formatUnit,
    needFormatLabelKey,
    formatLabel,
} from './config'
import mapFeatureInfo from '@/assets/icon/map-feature-info.svg'
import { Helper } from '@dhicn/helper'
import { isNumber } from 'lodash'
import { MinuteFormat01Result01 } from '@dhicn/helper/date-formatter'

const props = withDefaults(
    defineProps<{
        feature: ActiveFeatureType | null
    }>(),
    {
        feature: null,
    },
)

const getAttributes = (key: string) => {
    const attributeValue = props.feature?.attributes[key]
    if (needFormatUnitKey(key)) {
        return formatUnit(key, props.feature?.attributes!)
    } else if (needFormatLabelKey(key)) {
        return formatLabel(attributeValue)
    } else if (needFormatDateKey(key)) {
        return MinuteFormat01Result01(attributeValue)
    } else if (isNumber(attributeValue)) {
        return Helper.toFixed(attributeValue)
    } else if (attributeValue === undefined || attributeValue === null || attributeValue === '') {
        return '-'
    } else {
        return attributeValue
    }
}

const showAttributes = computed(() => {
    if (props.feature === null) {
        return []
    } else if (props.feature.type === 'junction') {
        return junctionShowAttributes
    } else if (props.feature.type === 'pipe') {
        return pipeShowAttributes
    } else if (props.feature.type === 'tank') {
        return tankShowAttributes
    } else if (props.feature.type === 'alarm') {
        return alarmShowAttributes
    } else {
        return []
    }
})

const title = computed(() => {
    if (props.feature === null) {
        return ''
    } else if (props.feature.type === 'junction') {
        return '节点相关信息'
    } else if (props.feature.type === 'pipe') {
        return '管道相关信息'
    } else if (props.feature.type === 'tank') {
        return '水池相关信息'
    } else if (props.feature.type === 'alarm') {
        return '报警预警'
    } else {
        return ''
    }
})

const componentShown = computed(() => {
    return props.feature !== null && !['device', 'alarm'].includes(props.feature.type)
})
</script>

<template>
    <div class="feature-info" v-if="componentShown">
        <div class="header">
            <a-image :height="20" :width="20" :src="mapFeatureInfo" :preview="false" />
            {{ title }}
        </div>
        <div class="feature-content">
            <template v-for="(row, index) in showAttributes" :key="row.key">
                <div class="cell">
                    <div class="label">{{ row.label }}</div>
                    <div class="value">{{ getAttributes(row.key) }}</div>
                </div>
                <a-divider v-if="index < showAttributes.length - 1" direction="vertical" />
            </template>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import './style.scss';
</style>

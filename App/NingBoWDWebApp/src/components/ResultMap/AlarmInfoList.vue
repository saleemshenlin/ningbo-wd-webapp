<script setup lang="ts">
import { computed, Ref, ref } from 'vue'
import {
    ActiveFeatureType,
    alarmShowAttributes,
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

const $alarmInfo: Ref<HTMLDivElement | null> = ref(null)

const props = withDefaults(
    defineProps<{
        features: ActiveFeatureType[]
    }>(),
    {
        features: () => [],
    },
)

const getAttributes = (key: string, feature: ActiveFeatureType) => {
    const attributeValue = feature?.attributes[key]
    if (needFormatUnitKey(key)) {
        return formatUnit(key, feature?.attributes!)
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
    return alarmShowAttributes
})

const computeAlarmAdviser = (attrs: Record<string, any>) => {
    if (attrs.alarmDataType === 'Pressure') {
        return '压力异常'
    } else if (attrs.alarmDataType === 'Flow') {
        return Math.abs(attrs.measureValue) - Math.abs(attrs.modelValue) > 0
            ? '流量偏高'
            : '流量偏低'
    }
}

const computeAlarmAdviserClass = (attrs: Record<string, any>) => {
    if (attrs.alarmDataType === 'Pressure') {
        return 'pressure'
    } else if (attrs.alarmDataType === 'Flow') {
        return Math.abs(attrs.measureValue) - Math.abs(attrs.modelValue) > 0
            ? 'flow-up'
            : 'flow-down'
    }
}

const title = computed(() => {
    return '预警信息'
})

const scrollTo = (id: string) => {
    if ($alarmInfo.value !== null) {
        const $cell = $alarmInfo.value.querySelector(`#${id}`)
        if ($cell !== undefined && $cell !== null) {
            $cell.scrollIntoView({ behavior: 'smooth' })
            $cell.classList.add('active')
            setTimeout(() => {
                $cell.classList.remove('active')
            }, 3000)
        }
    }
}

const computeFeatureContentClass = (attrs: Record<string, any>) => {
    const tag = computeAlarmAdviser(attrs)
    if (tag === '流量偏高') {
        return 'feature-content feature-content-flow-up'
    } else {
        return 'feature-content'
    }
}

defineExpose({
    scrollTo,
})
</script>

<template>
    <div ref="$alarmInfo" class="alarm-info">
        <div class="header">
            <a-image :height="20" :width="20" :src="mapFeatureInfo" :preview="false" />
            {{ title }}
            <a-tag color="orangered" bordered>检查预警处的压力计、支线流量计，或巡检爆漏</a-tag>
        </div>
        <div class="feature-content-wrapper">
            <div
                class="feature-content-cell"
                v-for="feature in props.features"
                :key="feature.attributes['indicatorName']"
            >
                <div
                    :class="computeFeatureContentClass(feature.attributes)"
                    :id="feature.attributes['indicatorName']"
                >
                    <template v-for="row in showAttributes" :key="row.key">
                        <div class="cell">
                            <div class="label">{{ row.label }}</div>
                            <div class="value">{{ getAttributes(row.key, feature) }}</div>
                        </div>
                        <a-divider direction="vertical" />
                    </template>
                    <div class="cell">
                        <div class="adviser">
                            <div :class="computeAlarmAdviserClass(feature.attributes)">
                                {{ computeAlarmAdviser(feature.attributes) }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import './style.scss';
</style>

<script setup lang="ts">
import { computed } from 'vue'
import { ActiveFeatureType, pressureResultItem, flowResultItem } from './config'
import mapFeatureInfo from '@/assets/icon/map-feature-info.svg'
import {
    CurrentOnlineModelData,
    DeviceIndicatorInfo,
    DeviceIndicatorPara,
    OnlineModelData,
} from '@dhicn/domain-paas-sdk-ts/wd-domain'
import { groupBy, isNumber, isString } from 'lodash'
import { Helper } from '@dhicn/helper'
import StationChartItem from './StationChartItem.vue'
import { MinuteFormat01Result01 } from '@dhicn/helper/date-formatter'

const props = withDefaults(
    defineProps<{
        feature: ActiveFeatureType | null
        indicators: Array<CurrentOnlineModelData & DeviceIndicatorInfo>
        fetchTSResult: (device: DeviceIndicatorPara[]) => Promise<OnlineModelData | null>
        loading: boolean
    }>(),
    {
        feature: null,
        indicators: () => [],
        fetchTSResult: ((device: DeviceIndicatorPara[]) => {}) as any,
        loading: false,
    },
)

const title = computed(() => {
    if (props.feature === null) {
        return ''
    } else if (props.feature.type === 'device') {
        let currentTime: string | Date = new Date()
        if (props.indicators.length > 0) {
            currentTime = props.indicators[0].currentTime as string
        }
        return `${props.feature.attributes.label}(${MinuteFormat01Result01(currentTime)})`
    } else {
        return ''
    }
})

const componentShown = computed(() => {
    return props.feature !== null && ['device'].includes(props.feature.type)
})

const formatName = (record: CurrentOnlineModelData & DeviceIndicatorInfo) => {
    const unit = isString(record.unit) && record.unit.length > 0 ? `(${record.unit})` : ''
    return record.showName + unit
}

const formatValue = (value: number, type?: string) => {
    if (type !== undefined && type === 'WaterQuality') {
        return '-'
    }
    return isNumber(value) ? Helper.toFixed(value) : '-'
}

const getItem = (indicator: CurrentOnlineModelData & DeviceIndicatorInfo) => {
    return indicator.type === 'Pressure' ? pressureResultItem : flowResultItem
}

const filterHDIndicatorsGroup = computed(() => {
    return groupBy(
        props.indicators
            .filter((indicator) => ['Pressure', 'Flow'].includes(indicator.type as string))
            .sort((a, b) => {
                return a.type!.localeCompare(b.type!, 'en')
            }),
        'showName',
    )
})

const fetchTSData = (indicators: Array<CurrentOnlineModelData & DeviceIndicatorInfo>) => {
    return (deviceId: string) => {
        const propsList = indicators.map((indicator) => ({
            id: indicator.id,
            deviceId,
            indicator: indicator.indicator,
            type: indicator.type,
        }))
        return props.fetchTSResult(propsList)
    }
}
</script>

<template>
    <div class="station-info">
        <div class="feature-info" v-if="componentShown">
            <div class="header">
                <a-image :height="20" :width="20" :src="mapFeatureInfo" :preview="false" />
                {{ title }}
            </div>
            <div class="feature-content">
                <a-table
                    :data="indicators"
                    :loading="loading"
                    style="width: 100%"
                    :pagination="false"
                >
                    <template #columns>
                        <a-table-column title="指标名称" align="center">
                            <template #cell="{ record }"> {{ formatName(record) }} </template>
                        </a-table-column>
                        <a-table-column title="实测值" align="right">
                            <template #cell="{ record }">
                                {{ formatValue(record.measureData) }}
                            </template>
                        </a-table-column>
                        <a-table-column title="模拟值" align="right">
                            <template #cell="{ record }">
                                {{ formatValue(record.modelData, record.type) }}
                            </template>
                        </a-table-column>
                    </template>
                </a-table>
            </div>
        </div>
        <div
            class="feature-chart"
            v-if="componentShown && Object.keys(filterHDIndicatorsGroup).length > 0"
            :style="{
                height: `calc(100vh - 64px - 16px - 155px - 41px * ${indicators.length})`,
            }"
        >
            <div
                class="feature-chart-item"
                v-for="showName in Object.keys(filterHDIndicatorsGroup)"
                :key="showName"
            >
                <div class="header">
                    <a-image :height="20" :width="20" :src="mapFeatureInfo" :preview="false" />
                    {{ showName }}预测
                </div>
                <div class="chart-content">
                    <StationChartItem
                        :device="filterHDIndicatorsGroup[showName][0].deviceId"
                        :item="getItem(filterHDIndicatorsGroup[showName][0])"
                        :fetchTSResult="fetchTSData(filterHDIndicatorsGroup[showName])"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import './style.scss';
</style>

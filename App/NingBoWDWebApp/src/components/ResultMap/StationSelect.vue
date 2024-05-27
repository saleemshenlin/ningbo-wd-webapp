<script setup lang="ts">
import { Ref, computed, ref, watch } from 'vue'
import mapFeatureInfo from '@/assets/icon/map-feature-info.svg'
import type {
    DeviceIndicatorInfo,
    OnlineModelData,
    DeviceIndicatorPara,
} from '@dhicn/domain-paas-sdk-ts/wd-domain'
import {
    WDModelResultCN,
    WDModelResultEnum,
    WDModelResultType,
    WDModelResultUnit,
} from 'dhi-dss-api-store/result-service'
import StationChartItem from './StationChartItem.vue'
import { groupBy } from 'lodash'

const props = withDefaults(
    defineProps<{
        devices: Array<DeviceIndicatorInfo>
        item: WDModelResultType
        fetchTSResult: (device: DeviceIndicatorPara[]) => Promise<OnlineModelData | null>
    }>(),
    {
        devices: () => [] as Array<DeviceIndicatorInfo>,
        item: 'Pressure',
        fetchTSResult: ((device: DeviceIndicatorPara[]) => {}) as any,
    },
)

const max = 3

const deviceGroup = computed(() => {
    return groupBy(props.devices, 'showName')
})

const initDeviceList = () => {
    const deviceGroupValue = deviceGroup.value
    return props.devices.length > 0 && Object.keys(deviceGroupValue).length > max
        ? [
              Object.keys(deviceGroupValue)[0],
              Object.keys(deviceGroupValue)[1],
              Object.keys(deviceGroupValue)[2],
          ]
        : []
}

const selectedDevices: Ref<Array<string>> = ref(initDeviceList())

const resultItem = computed(() => {
    return {
        key: WDModelResultEnum[props.item],
        label: WDModelResultCN[WDModelResultEnum[props.item]],
        unit: WDModelResultUnit[WDModelResultEnum[props.item]],
    }
})

const title = computed(() => {
    if (resultItem.value === null) {
        return ''
    } else if (resultItem.value.key === WDModelResultEnum.Pressure) {
        return '压力预测'
    } else if (resultItem.value.key === WDModelResultEnum.Flow) {
        return '流量预测'
    } else {
        return ''
    }
})

const getDeviceInfo = (deviceShowName: string) => {
    return deviceGroup.value[deviceShowName]
}

const fetchTSData = async (deviceShowName: string) => {
    const indicators = getDeviceInfo(deviceShowName)
    const propsList = indicators.map((indicator) => ({
        id: indicator.id,
        deviceId: indicator.deviceId,
        indicator: indicator.indicator,
        type: indicator.type,
    }))
    return props.fetchTSResult(propsList)
}

watch(
    () => props.devices,
    () => {
        selectedDevices.value = initDeviceList()
    },
)
</script>

<template>
    <div class="station-select" v-if="props.item !== null">
        <div class="header">
            <a-image :height="20" :width="20" :src="mapFeatureInfo" :preview="false" />
            {{ title }} - 主要站点模拟选择(最多支持选{{ max }}个)
        </div>
        <div class="select-content">
            <a-select
                style="margin-top: 8px"
                multiple
                :max-tag-count="2"
                :limit="max"
                v-model="selectedDevices"
            >
                <a-option
                    v-for="device in Object.keys(deviceGroup)"
                    :key="device"
                    :value="device"
                    :label="device!"
                />
            </a-select>
        </div>
    </div>
    <div class="feature-chart select-chart" v-if="selectedDevices.length > 0">
        <div class="feature-chart-item" v-for="device in selectedDevices" :key="device">
            <div class="header">
                <a-image :height="20" :h="20" :src="mapFeatureInfo" :preview="false" />
                {{ device }}
            </div>
            <div class="chart-content">
                <StationChartItem
                    :device="device"
                    :item="resultItem"
                    :fetchTSResult="fetchTSData"
                />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import './style.scss';
</style>

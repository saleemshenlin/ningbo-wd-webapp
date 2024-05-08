<script setup lang="ts">
import { isEmpty } from 'lodash'
import { ref } from 'vue'
import { DateTitle, ChartCategory, chartProps } from './config'
import { AreaChart } from '@dhicn/chart/area'
import { Helper } from '@dhicn/helper'
import {
    SecondFormat01,
    SecondFormat03,
    HourMinuteFormat01,
    DayFormat00,
} from '@dhicn/helper/date-formatter'
import type * as WDApi from '@dhicn/domain-paas-sdk-ts/wd-domain'
import { IWDDevice, IChartItem } from './type'
import { WDModelResultType } from '../ResultMap/config'
import dayjs from 'dayjs'

interface IDeviceTSData {
    title: string
    dataType: string
    devices: Array<IWDDevice>
    fetchTSData: (device: IWDDevice) => Promise<WDApi.OnlineModelData[]>
    format: (item: 'label' | 'unit', key: WDModelResultType) => string
}

const props = withDefaults(defineProps<IDeviceTSData>(), {
    devices: () => [],
    title: () => '',
    dataType: () => '',
    fetchTSData: () => Promise.resolve([]),
    format: (item: any, key: any) => key,
})

const activeDevice = ref<string>(props.devices[0].id)
const chartData = ref<Array<{ time: any; value: number; category: string }>>([])
const getDeviceInfo = (deviceId: string) => {
    const deviceInfo = props.devices.find((device: any) => device.id === deviceId)
    return { ...deviceInfo! }
}

const collateTsData = (sourceData: WDApi.OnlineModelData[]) => {
    let measureTsData: IChartItem[] = []
    let modelTsData: IChartItem[] = []
    if (isEmpty(sourceData)) {
        return []
    }
    if (isEmpty(sourceData[0].measureTsData)) {
        measureTsData = []
    } else {
        measureTsData = sourceData[0].measureTsData!.t!.map((item: string, index: number) => {
            return {
                time: dayjs(item, SecondFormat01).toDate(),
                value: Helper.toFixed(sourceData[0].measureTsData!.v![index]),
                category: ChartCategory[0],
            }
        })
    }
    if (isEmpty(sourceData[0].modelTsData)) {
        modelTsData = []
    } else {
        modelTsData = sourceData[0].modelTsData!.t!.map((item: string, index: number) => {
            return {
                time: dayjs(item, SecondFormat03).toDate(),
                value: Helper.toFixed(sourceData[0].modelTsData!.v![index]),
                category: ChartCategory[1],
            }
        })
    }
    const res = [...measureTsData, ...modelTsData]
    return res
}

const makeOptionLabel = (device: IWDDevice) => {
    return isEmpty(props.title) ? device.showName : `${props.title}-${device.showName}`
}

const formatFunc = (type: string, value: number | string) => {
    // console.log('type:', type, value)
    return `${type}: ${value}`
}

const areaStyleFunc = (
    category: { time: any; value: number; category: string },
    colors: string[],
) => {
    const props = chartProps[category.category]
    return {
        fill: props.fillColor(colors[props.colorIndex]),
    }
}
const lineStyleFunc = (colors: string[]) => {
    return {
        style: (category: { time: any; value: number; category: string }) => {
            const props = chartProps[category.category]
            return props.lineStyle
        },
        color: (category: { time: any; value: number; category: string }) => {
            const props = chartProps[category.category]
            return props.lineColor(colors[props.colorIndex])
        },
    }
}

const doUpdate = (
    deviceId:
        | string
        | number
        | boolean
        | Record<string, any>
        | (string | number | boolean | Record<string, any>)[] = activeDevice.value,
) => {
    props.fetchTSData(getDeviceInfo(deviceId as string)).then((res: any) => {
        chartData.value = collateTsData(res.data)
    })
}

doUpdate()

defineExpose({
    doUpdate,
})
</script>

<template>
    <div class="wd-device-tsdata">
        <div class="title_row">
            <a-select v-model="activeDevice" size="small" @change="doUpdate">
                <a-option
                    v-for="device in props.devices"
                    :key="device.id"
                    :value="device.id"
                    :label="makeOptionLabel(device)"
                />
            </a-select>
            <span class="title_date">
                {{ `${DateTitle}:${dayjs().format(DayFormat00)}` }}
            </span>
        </div>
        <a-divider />
        <area-chart
            :data="chartData"
            :isDark="false"
            :type="props.format('label', dataType as WDModelResultType)"
            :unit="props.format('unit', dataType as WDModelResultType)"
            :formatFunc="formatFunc"
            :areaStyleFunc="areaStyleFunc"
            :lineStyleFunc="lineStyleFunc"
            :timeFormat="HourMinuteFormat01"
        />
    </div>
</template>
<style lang="scss">
.info-title {
    font-size: 20px;
    line-height: 36px;
    height: 36px;
    padding: 0px 12px;
    background-color: rgb(var(--primary-6));
    color: var(--color-white);
}
.wd-device-tsdata {
    height: 160;
    margin-bottom: 10px;
    .title_row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .arco-select-view-single {
            width: 200px;
        }
        .title_date {
            color: rgb(var(--primary-6));
            margin-right: 8px;
        }
    }
    .arco-divider-horizontal {
        margin: 4px 0;
    }
    .arco-select-view-single.arco-select-view-size-small {
        width: auto;
        background-color: rgb(var(--primary-6));
        color: var(--color-white);
        border-radius: 0;

        .arco-select-view-suffix {
            color: var(--color-white);
        }
        .arco-select-view-input,
        .arco-select-view-value {
            font-size: 20px;
            line-height: 26px;
            padding-top: 0;
            padding-bottom: 0;
        }
    }
    .chart_component {
        height: 144px;
    }
}
</style>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ChartCategory, ChartDataTypeWithDate, ResultItemType, chartProps } from './config'
import { AreaChart } from '@dhicn/chart/area'
import { Helper } from '@dhicn/helper'
import { SecondFormat01, SecondFormat03, HourMinuteFormat01 } from '@dhicn/helper/date-formatter'
import { OnlineModelData } from '@dhicn/domain-paas-sdk-ts/wd-domain'
import { isEmpty } from 'lodash'
import dayjs from 'dayjs'

const props = withDefaults(
    defineProps<{
        device: string
        item: ResultItemType | null
        fetchTSResult: (deviceId: string) => Promise<OnlineModelData | null>
    }>(),
    {
        device: '',
        item: null,
        fetchTSResult: () => Promise.resolve({} as any),
    },
)

const chartData = ref<ChartDataTypeWithDate[]>([])

const formatChartLabelUnit = (key: 'label' | 'unit') => {
    return key === 'unit' ? props.item?.unit : props.item?.label
}

const colors10 = [
    '#6791f3',
    '#80d4aa',
    '#FFC100',
    '#9FB40F',
    '#76523B',
    '#DAD5B5',
    '#0E8E89',
    '#E19348',
    '#F383A2',
    '#247FEA',
]

const chartConfig = reactive({
    data: [],
    autoFit: true,
    isStack: false,
    appendPadding: 0,
    smooth: false,
    xField: 'time',
    yField: 'value',
    seriesField: 'category',
    legend: {
        position: 'top-right',
        itemHeight: 18,
    } as any,
    areaStyle: (category: any) => {
        const props = chartProps[category.category]
        return {
            fill: props.fillColor(colors10[props.colorIndex]),
        }
    },
    line: {
        style: (category: { time: any; value: number; category: string }) => {
            const props = chartProps[category.category]
            return props.lineStyle
        },
        color: (category: { time: any; value: number; category: string }) => {
            const props = chartProps[category.category]
            return props.lineColor(colors10[props.colorIndex])
        },
    } as any,
    xAxis: {
        type: 'time',
        mask: HourMinuteFormat01,
        nice: false,
    },
    yAxis: {
        title: {
            text: formatChartLabelUnit('unit'),
            position: 'center',
        },
    },
})

const collateTsData = (sourceData: OnlineModelData) => {
    let measureTsData: ChartDataTypeWithDate[] = []
    let modelTsData: ChartDataTypeWithDate[] = []
    if (isEmpty(sourceData)) {
        return []
    }
    if (isEmpty(sourceData.measureTsData)) {
        measureTsData = []
    } else {
        measureTsData = sourceData.measureTsData!.t!.map((item: string, index: number) => {
            return {
                time: dayjs(item, SecondFormat01).toDate(),
                value: Helper.toFixed(sourceData.measureTsData!.v![index]),
                category: ChartCategory[0],
            }
        })
    }
    if (isEmpty(sourceData.modelTsData)) {
        modelTsData = []
    } else {
        modelTsData = sourceData.modelTsData!.t!.map((item: string, index: number) => {
            return {
                time: dayjs(item, SecondFormat03.replace('d', 'D').replace('a', 'A')).toDate(),
                value: Helper.toFixed(sourceData.modelTsData!.v![index]),
                category: ChartCategory[1],
            }
        })
    }
    logger.debug('collateTsData', measureTsData, modelTsData)
    const res = [...measureTsData, ...modelTsData]
    return res
}

const doUpdate = () => {
    props.fetchTSResult(props.device).then((res) => {
        if (res !== null) {
            chartData.value = collateTsData(res)
        } else {
            chartData.value = []
        }
    })
}

doUpdate()
</script>

<template>
    <area-chart :data="chartData" :options="chartConfig" />
</template>

<style lang="scss" scoped>
@import './style.scss';
</style>

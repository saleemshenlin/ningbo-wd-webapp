<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import type { ActiveFeatureType, ChartDataType, ResultItemType } from './config'
import { LineChart } from '@dhicn/chart/line'
import { Helper } from '@dhicn/helper'
import { WDModelResultEnum } from 'dhi-dss-api-store/result-service'
import { HourMinuteFormat01 } from '@dhicn/helper/date-formatter'

const props = withDefaults(
    defineProps<{
        feature: ActiveFeatureType | null
        item: ResultItemType | null
        fetchTSResult: (
            modelId: string,
            dataType: WDModelResultEnum,
        ) => Promise<{ t: string[]; v: number[] }>
    }>(),
    {
        feature: null,
        item: null,
        fetchTSResult: () => Promise.resolve({ t: [], v: [] }),
    },
)

const chartData = ref<ChartDataType[]>([])

const chartConfig = reactive({
    data: [],
    autoFit: true,
    isStack: false,
    appendPadding: 0,
    smooth: false,
    xField: 'time',
    yField: 'value',
    seriesField: 'category',
    theme: 'default',
    legend: false as any,
    xAxis: {
        type: 'time',
        mask: HourMinuteFormat01,
        nice: false,
    },
    yAxis: {
        title: {
            text: '',
        },
    },
    tooltip: {
        formatter: (datum: any) => {
            return {
                name: datum.category,
                value: '',
            }
        },
    } as any,
})

const changeChartConfig = (activeItem: ResultItemType) => {
    chartConfig.yAxis.title.text = `${activeItem.label}(${activeItem.unit})`
    chartConfig.tooltip.formatter = (datum: any) => {
        return {
            name: datum.category,
            value: `${Helper.toFixed(datum.value)} ${activeItem.label}(${activeItem.unit})`,
        }
    }
}

const markChartData = async () => {
    if (props.item !== null && props.feature !== null) {
        changeChartConfig(props.item)
        const { t, v } = await props.fetchTSResult(
            props.feature.attributes.MUID,
            props.item.key as WDModelResultEnum,
        )
        if (t.length > 0) {
            // 装载数据
            const minLength = t.length > v.length ? v.length : t.length
            const dataSet: ChartDataType[] = []
            for (let index = 0; index < minLength; index++) {
                dataSet.push({
                    time: t[index],
                    value:
                        props.item.key === WDModelResultEnum.Pressure ? v[index] / 100 : v[index],
                    category: props.item.label,
                })
            }
            chartData.value = dataSet
            // console.log('markChartData :>> ', chartData.value)
        }
    }
}

watch(
    () => props.feature,
    () => {
        markChartData()
    },
)

onMounted(() => {
    markChartData()
})
</script>

<template>
    <line-chart v-if="chartData.length > 0" :data="chartData" :options="chartConfig"></line-chart>
</template>

<style lang="scss" scoped>
@import './style.scss';
</style>

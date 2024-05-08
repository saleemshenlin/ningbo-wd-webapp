<script setup lang="ts">
import { Helper } from '@dhicn/helper'
import { isEmpty } from 'lodash'
import { onMounted, ref, reactive } from 'vue'
import { LineChart } from '@dhicn/chart/line'

type ChartDataType = { time: string; value: number; category: string }
type ResultItemType = { key: number; label: string; unit: string }

interface IProps {
    geometry: Record<string, any>
    attributes: Record<string, any>
    resultItems: ResultItemType[]
    showAttributes: {
        key: string
        label: string
    }[]
    fetchTSResult: (modelId: string, dataType: number) => Promise<{ t: string[]; v: number[] }>
}
const props = withDefaults(defineProps<IProps>(), {
    geometry: () => ({}),
    attributes: () => ({}),
    showAttributes: () => [],
    fetchTSResult: () => Promise.resolve({ t: [], v: [] }),
})

const chartData = ref<ChartDataType[]>([])
const activeItemKey = ref(0)

const getAttributes = (key: string) => {
    const attribute = props.attributes[key]
    if (!isNaN(parseFloat(attribute))) {
        return Helper.toFixed(attribute)
    } else if (isEmpty(attribute)) {
        return '-'
    } else {
        return attribute
    }
}

const chartConfig = reactive({
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
    },
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

const markChartData = async (key: string | number | boolean) => {
    const activeItem = props.resultItems.find((item: ResultItemType) => item.key === key)
    changeChartConfig(activeItem!)
    const { t, v } = await props.fetchTSResult(props.attributes.MUID, key as number)
    if (t.length > 0) {
        // 装载数据
        const minLength = t.length > v.length ? v.length : t.length
        const dataSet: ChartDataType[] = []
        for (let index = 0; index < minLength; index++) {
            dataSet.push({
                time: t[index],
                value: v[index],
                category: activeItem!.label,
            })
        }
        chartData.value = dataSet
        // console.log('markChartData :>> ', chartData.value)
    }
}

onMounted(() => {
    if (props.resultItems.length > 0) {
        activeItemKey.value = props.resultItems[0].key
    }
    markChartData(activeItemKey.value)
})
</script>
<template>
    <div class="popup-content_feature">
        <div class="feature-info">
            <div class="feature-info-raw" v-for="row in showAttributes" :key="row.key">
                <div class="label">{{ row.label }}</div>
                <div class="value">{{ getAttributes(row.key) }}</div>
            </div>
        </div>
        <div class="select-result_type">
            <a-radio-group v-model="activeItemKey" type="button" @change="markChartData">
                <a-radio v-for="item in resultItems" :key="item.key" :value="item.key">{{
                    item.label
                }}</a-radio>
            </a-radio-group>
        </div>
        <div class="chart-container">
            <line-chart
                v-if="chartData.length > 0"
                :data="chartData"
                :optionsConfig="chartConfig"
            ></line-chart>
        </div>
    </div>
</template>

<style lang="scss">
@import './popup.scss';
</style>

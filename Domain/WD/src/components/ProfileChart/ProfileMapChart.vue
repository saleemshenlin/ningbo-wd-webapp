<script setup lang="ts">
import { AreaChart } from '@dhicn/chart/area'
import { onMounted, reactive, toRefs, watch } from 'vue'

export interface IData {
    x: number
    y: number | number[]
    category: 'pipe' | 'profile'
}

interface IProps {
    data: IData[]
    unit?: string
}
const props = withDefaults(defineProps<IProps>(), {
    unit: () => '',
})
const { data, unit } = toRefs(props)

const getMin = () => {
    return data.value.reduce((min: number, curr: IData) => {
        const val = isNaN((curr.y as number[])[0]) ? (curr.y as number) : (curr.y as number[])[0]
        return val < min ? val : min
    }, 999999)
}

const getAnnotations = () => {
    return data.value.reduce((list: any[], curr: IData, index: number) => {
        if (curr.category === 'pipe') {
            return [
                ...list,
                {
                    type: 'line',
                    id: 'line' + index,
                    /** 起始位置 */
                    start: [curr.x, (curr.y as number[])[0]],
                    /** 结束位置 */
                    end: [curr.x, (curr.y as number[])[1]],
                    style: {
                        lineWidth: 3,
                    },
                },
            ]
        }
        return list
    }, [])
}

const option = reactive({
    data: data.value,
    xField: 'x',
    yField: 'y',
    autoFit: true,
    seriesField: 'category',
    isStack: false,
    legend: false as any,
    tooltip: {
        customItems: (originalItems: any) => {
            return originalItems.map((item: any) => {
                if (item.name === 'pipe') {
                    return {
                        ...item,
                        name: '管道',
                    }
                } else if (item.name === 'profile') {
                    return {
                        ...item,
                        name: '剖面',
                    }
                }
                return item
            })
        },
    },
    xAxis: {
        type: 'linear',
        nice: true,
    },
    yAxis: {
        title: {
            text: unit.value,
            position: 'center',
            spacing: 0.05,
        },
        type: 'linear',
        nice: true,
        min: getMin(),
    },
    annotations: getAnnotations(),
})

watch(
    () => data.value,
    (newVal) => {
        option.yAxis.min = getMin()
        option.annotations = getAnnotations()
    },
)
</script>

<template>
    <AreaChart :data="props.data" :options="option"></AreaChart>
</template>

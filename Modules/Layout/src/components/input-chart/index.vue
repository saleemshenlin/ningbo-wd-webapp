<template>
    <div class="input-chart">
        <dhi-input-table
            class="dhi-input-table"
            :loading="loading"
            :table-data="tableData"
            :columns-list="columnsList"
            :input-keys="['value']"
            @change="onChange"
        ></dhi-input-table>
        <div class="line-chart">
            <div v-if="chartTitle" class="label">{{ chartTitle }}</div>
            <LineChart :data="chartDataList" :options="lineOptionsConfig"></LineChart>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, computed } from 'vue'
import { TableColumnData } from '@arco-design/web-vue'
import { DhiInputTable } from '../input-table/v1/index'
import { LineChart } from '@dhicn/chart/line'
import { lineOptionFn } from '@dhicn/chart'
import { Helper } from '@dhicn/helper'
import { MonthMinuteMask01, minuteFormat02 } from '@dhicn/helper/date-formatter'
import dayjs from 'dayjs'
export interface IProps {
    loading?: boolean
    columnsList: TableColumnData[]
    tableData: {
        time: string
        value: number
    }[]
    chartTitle?: string
}
const props = withDefaults(defineProps<IProps>(), {
    loading: () => false,
})
const emit = defineEmits(['change'])
const onChange = ({ table }: { table: any[] }) => {
    emit('change', table)
}

const chartDataList = computed(() => {
    return props.tableData.map((item: { time: string; value: number }) => {
        return {
            time: dayjs(item.time).toDate(),
            value: item.value,
            category: 'cat',
        }
    })
})
const lineOptionsConfig = reactive({
    ...lineOptionFn(),
    legend: false as any,
    data: [],
    xAxis: {
        type: 'timeCat',
        mask: MonthMinuteMask01,
        nice: true,
    },
    yAxis: {
        title: {
            text: '数值',
            position: 'end',
        },
        grid: null,
    },
    tooltip: {
        showTitle: false,
        formatter: (datum: any) => {
            return {
                name: datum.time ? dayjs(datum.time).format(minuteFormat02) : '',
                value: Helper.toFixed(datum.value),
            }
        },
        itemTpl: `
            <li class="g2-tooltip-list-item">
              <span class="g2-tooltip-marker" style="background-color: {color};"></span>
              <span class="g2-tooltip-name">{name}</span>
              <span class="g2-tooltip-value">{value}</span>
            </li>
          `,
    },
})
</script>
<script lang="ts">
export default {
    name: 'input-chart',
}
</script>

<style lang="scss" scoped>
.input-chart {
    height: inherit;
    .dhi-input-table {
        height: calc(100% - 240px);
    }
    .line-chart {
        .label {
            margin: 20px 0;
            font-size: 14px;
            font-weight: 700;
            line-height: 20px;
        }
        :deep(.chart_component) {
            height: 200px;
        }
    }
}
</style>

<template>
    <div class="input-table">
        <a-table
            :loading="loading"
            :columns="columnsList"
            :data="reactiveTable"
            :pagination="false"
            :sticky-header="100"
            :scrollbar="true"
            :bordered="false"
            :scroll="scroll"
        >
            <template v-for="name in inputKeys" :key="name" #[name]="{ record }">
                <div class="input-cell">
                    <a-input-number
                        v-model="record[name]"
                        :precision="getPrecision(name)"
                        :min="getMin(name)"
                        :max="getMax(name)"
                        @change="onValueChange(record)"
                    />
                    <span v-if="withUnit">{{ record.unit || '' }}</span>
                </div>
            </template>
            <template v-for="name in statusKeys" :key="name" #[name]="{ record }">
                <div style="cursor: pointer">
                    <a-tag
                        :color="record[name] ? 'green' : 'red'"
                        @click="onStatusChange(record, name)"
                        >{{
                            record[name]
                                ? statusKeyTextMap[name].active
                                : statusKeyTextMap[name].inactive
                        }}</a-tag
                    >
                </div>
            </template>
        </a-table>
    </div>
</template>

<script lang="ts" setup>
import { ref, Ref, watch, reactive } from 'vue'
import { TableColumnData } from '@arco-design/web-vue'

export interface TextMap {
    active: '' // 开启状态的文字描述
    inactive: '' // 关闭状态的文字描述
}

export interface IProps {
    columnsList: TableColumnData[]
    tableData: Record<string, any>[]
    inputKeys?: string[] // 需要进行输入的字段列表
    statusKeys?: string[] // 需要进行状态变化的字段列表
    statusKeyTextMap: Record<string, TextMap> // 状态字段的文本描述映射
    loading?: boolean
    withUnit?: boolean // 是否需要单位
    precisionMap?: Record<string, number> // 精度(单个)
    precision?: number // 精度(所有的)
    // min?: Map<string, number> // 最小值
    inputRange?: Map<string, [number, number]> // 最小值
}

const emit = defineEmits(['change'])
const props = withDefaults(defineProps<IProps>(), {
    loading: () => false,
    withUnit: () => false,
    precision: () => 2,
    inputKeys: () => [],
    statusKeys: () => [],
    statusKeyTextMap: () => ({}),
})

const getPrecision = (name: string) => {
    if (props.precisionMap) {
        return props.precisionMap[name] ?? props.precision ?? 2
    }
    return props.precision ?? 2
}

const getMin = (name: string) => {
    const exist = props.inputRange ? props.inputRange.get(name) : undefined
    if (exist && !isNaN(exist[0])) {
        return exist[0]
    } else {
        return Number.NEGATIVE_INFINITY
    }
}
const getMax = (name: string) => {
    const exist = props.inputRange ? props.inputRange.get(name) : undefined
    if (exist && !isNaN(exist[1])) {
        return exist[1]
    } else {
        return Number.POSITIVE_INFINITY
    }
}

const reactiveTable: Record<string, any>[] = reactive([])
watch(
    () => props.tableData,
    (val) => {
        reactiveTable.splice(0, reactiveTable.length, ...val)
    },
    {
        immediate: true,
        deep: true,
    },
)
const scroll = { x: '100%', y: '100%' }
const onValueChange = (record: any) => {
    console.log('InputTable on ValueChange', record, reactiveTable)
    const paload = {
        record,
        table: reactiveTable,
    }
    emit('change', paload)
}
const onStatusChange = (record: any, name: string) => {
    record[name] = !record[name]
    const paload = {
        record,
        table: reactiveTable,
    }
    console.log('InputTable on StatusChange', record, name, reactiveTable)
    emit('change', paload)
}
</script>
<script lang="ts">
export default {
    name: 'input-table',
}
</script>

<style lang="scss" scoped>
.input-table {
    .input-cell {
        display: flex;
        align-items: center;
        white-space: nowrap;
    }
}
</style>

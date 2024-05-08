<script setup lang="ts">
import { TableColumnData } from '@arco-design/web-vue'
import { Helper } from '@dhicn/helper'
import { isString } from 'lodash'
type DateItemType = { label: string; unit: string; id: string }
type ResultItemType = { measureData: number; modelData: number; id: string }

interface IProps {
    dataItems: DateItemType[]
    resultSet: ResultItemType[]
    showModel: boolean
}
const props = withDefaults(defineProps<IProps>(), {
    dataItems: () => [],
    resultSet: () => [],
    showModel: () => true,
})

const formatNumber = (num: number) =>
    !isNaN(parseFloat(num.toString())) ? Helper.toFixed(num) : '-'

const tableData = props.dataItems.map((item: DateItemType) => {
    const resultData = props.resultSet.find(
        (resultItem: ResultItemType) => resultItem.id === item.id,
    )
    // console.log('item :>> ', item, resultData, props)
    if (resultData === undefined) {
        const unitFormatter = isString(item.unit) && item.unit !== '' ? `(${item.unit})` : ''
        return {
            item: `${item.label}${unitFormatter}`,
            model: '-',
            measure: '-',
        }
    }
    return {
        item: `${item.label}(${item.unit})`,
        model: formatNumber(resultData.modelData),
        measure: formatNumber(resultData.measureData),
    }
})

const tableColumns: TableColumnData[] = [
    {
        title: '数据项',
        dataIndex: 'item',
        align: 'center',
        slotName: 'item',
    },
    {
        title: '实测值',
        dataIndex: 'measure',
        align: 'center',
        slotName: 'measure',
    },
]

if (props.showModel) {
    tableColumns.push({
        title: '模拟值',
        dataIndex: 'model',
        align: 'center',
        slotName: 'model',
    })
}
</script>
<template>
    <div class="popup-content light">
        <a-table
            :bordered="false"
            :columns="tableColumns"
            :data="tableData"
            :pagination="false"
        ></a-table>
    </div>
</template>

<style lang="scss" scoped>
.popup-content {
    border: none;
    width: 100%;
    height: 100%;
    border-radius: 4px;
}
</style>

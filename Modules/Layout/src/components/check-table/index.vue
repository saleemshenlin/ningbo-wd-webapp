<template>
    <div class="check-table">
        <a-table
            :columns="columnsList"
            :data="reactiveTable"
            :pagination="false"
            :sticky-header="100"
            :scrollbar="true"
            :bordered="false"
            :scroll="scroll"
        >
            <template #[checkKey]="{ record }">
                <a-checkbox v-model="record[checkKey]" @change="onSelectChange(record)"></a-checkbox
            ></template>
        </a-table>
    </div>
</template>

<script lang="ts" setup>
// eslint-disable-next-line no-unused-vars
import { ref, Ref, watch, reactive } from 'vue'
import { TableColumnData } from '@arco-design/web-vue'
const emit = defineEmits(['change'])

const props = withDefaults(
    defineProps<{
        columnsList: TableColumnData[]
        tableData: Record<string, any>[]
        checkKey: string // 需要进行勾选的字段
        loading?: boolean
    }>(),
    { loading: () => false },
)
const reactiveTable: Record<string, any>[] = reactive([])
watch(
    () => props.tableData,
    (val) => {
        reactiveTable.splice(0, reactiveTable.length, ...val)
    },
)
const scroll = { x: '100%', y: '100%' }
const onSelectChange = (record: any) => {
    console.log('check table selected change', record, reactiveTable)
    const paload = {
        record,
        table: reactiveTable,
    }
    emit('change', paload)
}
</script>
<script lang="ts">
export default {
    name: 'check-table',
}
</script>

<style lang="scss" scoped>
.check-table {
}
</style>

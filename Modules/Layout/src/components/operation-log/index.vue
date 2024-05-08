<template>
    <div class="operation-log">
        <a-space>
            <a-row>{{ dateLabel }}</a-row>
            <a-space>
                <a-range-picker
                    :allow-clear="false"
                    v-model="rangeValue"
                    @change="timeChange"
                    style="width: 250px"
                />
            </a-space>
        </a-space>
        <a-divider />
        <div class="log-table" ref="logTable">
            <a-table
                :columns="columnsList"
                :data="logData"
                :loading="loading"
                :scrollbar="true"
                :bordered="false"
                :pagination="false"
                :scroll="scroll"
            >
            </a-table>
            <a-pagination
                :total="logPage.total"
                show-total
                show-page-size
                :current="logPage.pageIndex"
                :page-size="logPage.pageSize"
                :page-size-options="pageSizeOptions"
                @change="pageChange"
                @page-size-change="pageSizeChange"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import { isEmpty, isUndefined } from 'lodash'
import { ref, Ref, onBeforeMount, computed } from 'vue'
import { TableColumnData, TableData } from '@arco-design/web-vue'

export interface IProps {
    dateLabel: string
    columnsList: TableColumnData[]
    formatConstance: string
    pageSizeOptions: number[]
    fetchData: (
        startTime: string,
        endTime: string,
        pageIndex: number,
        pageSize: number,
    ) => Promise<Record<string, any>>
}
const props = withDefaults(defineProps<IProps>(), {
    formatConstance: () => 'yyyy-MM-dd',
    pageSizeOptions: () => [10, 20, 30, 50, 100],
})

const rangeValue: Ref<string[]> = ref([])
const loading = ref(false)
const logData: Ref<TableData[]> = ref([])
const logPage: Ref<Record<string, number>> = ref({ total: 0, pageIndex: 1, pageSize: 10 })
const timeChange = (value: (Date | string | number | undefined)[] | undefined) => {
    if (!isUndefined(rangeValue.value[1]) && !isEmpty(rangeValue.value[1])) {
        fetchData(rangeValue.value[0], rangeValue.value[1])
    }
}

const fetchData = async (startTime: string, endTime: string) => {
    logData.value = []
    loading.value = true
    const data = await props
        .fetchData(
            `${startTime}T00:00:00`,
            `${endTime}T23:59:59`,
            logPage.value.pageIndex,
            logPage.value.pageSize,
        )
        .finally(() => {
            loading.value = false
        })
    logPage.value = {
        total: data.totalCount ?? 0,
        pageIndex: data.pageIndex ?? 1,
        pageSize: data.pageSize ?? 10,
    }

    logData.value = data.list?.sort((a: any, b: any) => {
        return dayjs(b.operateTime).unix() - dayjs(a.operateTime).unix()
    })!
}
const initTime = () => {
    const endTime = dayjs().format(props.formatConstance)
    const startTime = dayjs().add(-7, 'day').format(props.formatConstance)
    rangeValue.value = [startTime, endTime]
    fetchData(rangeValue.value[0], rangeValue.value[1])
}

const logTable = ref()
const scroll = computed(() => {
    const columnsLength = props.columnsList.length
    const xLength = 180 + 120 + (columnsLength > 2 ? columnsLength - 2 : 0) * 120
    const tableLength = logTable.value?.clientWidth ?? 0
    return {
        x: xLength > tableLength ? xLength : '100%',
        y: '100%',
    }
})

const pageChange = (pageIndex: number) => {
    logPage.value.pageIndex = pageIndex
    fetchData(rangeValue.value[0], rangeValue.value[1])
}

const pageSizeChange = (pageSize: number) => {
    if (pageSize === logPage.value.pageSize) return
    logPage.value.pageSize = pageSize
    fetchData(rangeValue.value[0], rangeValue.value[1])
}

onBeforeMount(() => {
    initTime()
})
</script>
<script lang="ts">
export default {
    name: 'operation-log',
}
</script>

<style lang="scss" scoped>
.operation-log {
    height: 100%;
    position: relative;
    .log-table {
        height: calc(100% - 90px);
        display: flex;
        flex-direction: column;
        :deep(.arco-pagination) {
            margin-right: 10px;
            margin-top: 5px;
            justify-content: end;
        }
    }

    :deep(.arco-table-tfoot) {
        overflow: hidden;
    }
}
</style>

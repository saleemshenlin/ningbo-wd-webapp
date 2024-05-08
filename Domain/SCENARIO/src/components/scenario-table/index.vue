<template>
    <div class="scenario-table">
        <div class="header">
            <!-- 增加名称 -->
            <div class="header-search">
                <a-space>
                    <slot name="searchLabel" />

                    <a-input
                        :style="{ width: '320px' }"
                        :placeholder="searchHolder"
                        allow-clear
                        @change="filterTable"
                    />
                </a-space>
            </div>
            <div class="header-action">
                <slot name="headerAction"></slot>
            </div>
        </div>
        <div class="table-container" ref="tableContainerRef">
            <!-- :sticky-header="100" -->
            <a-table
                :loading="props.loading"
                :columns="columns"
                :data="tableData"
                :pagination="false"
                :scrollbar="true"
                :bordered="false"
                :scroll="scroll"
                row-key="id"
            >
                <!-- 序号 slot -->
                <template #index="{ record, rowIndex }">
                    <slot name="index" :record="record" :index="rowIndex"></slot>
                </template>
                <template #createTime="{ record }">
                    <span>{{ dayjs(record.createTime ?? '').format(props.formatType) }}</span>
                </template>
                <template #startEnd="{ record }">
                    <span>{{ dayjs(record.startTime ?? '').format(props.formatType) }}</span>
                    -
                    <span>{{ dayjs(record.endTime ?? '').format(props.formatType) }}</span>
                </template>
                <!-- 附件slot -->
                <template #fileName="{ record }">
                    <slot name="fileName" :record="record" />
                </template>
                <template #calcState="{ record }">
                    <slot name="calcState" :record="record">
                        <a-tag color="green"> 计算成功 </a-tag>
                    </slot>
                </template>
                <template #action="{ record }">
                    <slot name="action" :record="record">
                        <a-space size="small">
                            <a-link
                                type="text"
                                size="small"
                                v-if="btnsConfig.cacl"
                                @click="onCalc(record)"
                                >计算</a-link
                            >
                            <a-link
                                type="text"
                                size="small"
                                status="success"
                                v-if="btnsConfig.edit"
                                @click="props.cbConfig?.editCb(record)"
                                >编辑</a-link
                            >
                            <a-link
                                type="text"
                                size="small"
                                status="success"
                                v-if="btnsConfig.see"
                                @click="props.cbConfig?.seeCb(record)"
                                >查看</a-link
                            >
                            <a-link
                                type="text"
                                size="small"
                                v-if="btnsConfig.log"
                                @click="onLog(record)"
                                >日志</a-link
                            >
                            <a-link
                                type="text"
                                size="small"
                                status="danger"
                                v-if="btnsConfig.delete"
                                @click="onDelete(record)"
                                >删除</a-link
                            >
                        </a-space>
                    </slot>
                </template>
            </a-table>
        </div>
    </div>
</template>

<script lang="ts" setup>
// eslint-disable-next-line no-unused-vars
import { ref, watch, reactive } from 'vue'
import {
    TABLE_MIN_WIDTH,
    ScenarioColumns,
    labelConfig,
    ActionBtnsConfig,
    ApiConfig,
    CbConfig,
} from '../../config'
import type { Scenario } from '@dhicn/domain-paas-sdk-ts/scenario-service'
import type { TableColumnData } from '@arco-design/web-vue'
import dayjs from 'dayjs'
import { minuteFormat02 } from '@dhicn/helper/date-formatter'
export interface IProps {
    loading: boolean // 数据加载状态
    scenarioList: Scenario[] // 表格数据
    apiConfig?: ApiConfig // 接口配置
    cbConfig?: CbConfig // 回调配置
    btnsConfig?: ActionBtnsConfig // 操作栏功能按钮控制
    columns?: TableColumnData[] // 表格列配置
    // 时间格式化类别
    formatType?: string
}
const { searchHolder } = labelConfig

const props = withDefaults(defineProps<IProps>(), {
    loading: () => false,
    btnsConfig: () => ({
        cacl: true,
        edit: true,
        see: true,
        log: true,
        delete: true,
    }),
    apiConfig: () => ({
        queryState: (ids: string[]) => Promise.resolve([]),
        queryLog: (id: string) => Promise.resolve({}),
        deleteScenario: (ids: string[]) => Promise.resolve(false),
        runModel: (id: string) => Promise.resolve({}),
        cancelModel: (ids: string[]) => Promise.resolve({}),
        queryCompareScenarios: (id: string) => Promise.resolve([]),
        queryModelProcess: () => Promise.resolve({}),
    }),
    cbConfig: () => ({
        editCb: (record: Scenario) => {},
        seeCb: (record: Scenario) => {},
    }),
    columns: () => ScenarioColumns,
    formatType: () => minuteFormat02,
})

const scroll = ref({
    x: TABLE_MIN_WIDTH,
    y: '100%',
})

const tableData: Scenario[] = reactive([])

watch(
    () => props.scenarioList,
    (val) => {
        if (val) {
            tableData.splice(0, tableData.length, ...val)
        }
    },
    {
        immediate: true,
    },
)

const filterTable = (str: string) => {
    if (!str) {
        tableData.splice(0, tableData.length, ...props.scenarioList)
    } else {
        const arr = props.scenarioList.filter((item: Scenario) => {
            return item.scenarioName?.includes(str) || item.description?.includes(str)
        })
        tableData.splice(0, tableData.length, ...arr)
    }
}

const onCalc = (record: Scenario) => {}
const onLog = (record: Scenario) => {}
const onDelete = (record: Scenario) => {}

// 监听dom尺寸变化，调整表格展示情况
const objResizeObserver = new ResizeObserver(function (entries) {
    const entry = entries[0]
    const cr = entry.contentRect
    // console.log('cr----', cr)
    if (cr.width > TABLE_MIN_WIDTH) {
        scroll.value = {
            x: cr.width,
            y: '100%',
        }
    } else {
        scroll.value = {
            x: TABLE_MIN_WIDTH,
            y: '100%',
        }
    }
})
const tableContainerRef = ref<HTMLElement>()
watch(tableContainerRef, (val) => {
    if (val) {
        objResizeObserver.observe(val)
    }
})
</script>
<script lang="ts">
export default {
    name: 'scenario-table',
}
</script>

<style lang="scss" scoped>
.scenario-table {
    height: 100%;
    .header {
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 35px;
    }
    .table-container {
        height: calc(100% - 32px - 35px);
    }
}
</style>

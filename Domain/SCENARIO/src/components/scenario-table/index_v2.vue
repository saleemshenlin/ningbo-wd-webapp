<template>
    <div class="scenario-table">
        <div class="header">
            <a-input
                :style="{ width: '320px' }"
                :placeholder="searchHolder"
                allow-clear
                @change="filterTable"
                :disabled="compareIdList.length > 0"
            />
            <div class="header-action">
                <slot name="headerAction"></slot>
            </div>
        </div>
        <div class="table-container" ref="tableContainerRef">
            <a-table
                :loading="props.loading"
                :columns="props.showContrast ? ScenarioColumnsWithCheckbox : ScenarioColumns"
                :data="tableData"
                :pagination="false"
                :sticky-header="100"
                :scrollbar="true"
                :bordered="false"
                :scroll="scroll"
                @cell-click="onCellClick"
                @sorter-change="onSortChange"
            >
                <template #selected="{ record }">
                    <a-checkbox
                        v-model="record.selected"
                        :disabled="isQueryComparing || getStatusById(record.id) !== 0"
                        @change="onSelectChange(record)"
                    ></a-checkbox
                ></template>
                <template #createTime="{ record }">
                    <span>{{ dayjs(record.createTime ?? '').format(minuteFormat02) }}</span>
                </template>
                <template #startEnd="{ record }">
                    <span>{{ dayjs(record.startTime ?? '').format(minuteFormat02) }}</span>
                    -
                    <span>{{ dayjs(record.endTime ?? '').format(minuteFormat02) }}</span>
                </template>
                <template #calcState="{ record }">
                    <a-tag :color="calcStateMap[getStatusById(record.id)]?.color">
                        {{ calcStateMap[getStatusById(record.id)]?.text }}
                        {{ getWaitNoById(record.id) }}
                        {{ getProgressById(record.id) }}
                    </a-tag>
                </template>
                <template #action="{ record }">
                    <a-space size="small" v-if="statusList.length">
                        <a-link
                            type="text"
                            size="small"
                            v-if="btnsConfig.cacl"
                            @click="onCalc(record)"
                            >{{
                                [1, 2, -3].includes(getStatusById(record.id))
                                    ? cancelText
                                    : calcText
                            }}</a-link
                        >
                        <a-link
                            type="text"
                            size="small"
                            status="success"
                            v-if="btnsConfig.edit"
                            :disabled="[1, 2, -3].includes(getStatusById(record.id))"
                            @click="props.cbConfig?.editCb && props.cbConfig?.editCb(record)"
                            >{{ editText }}</a-link
                        >
                        <a-link
                            type="text"
                            size="small"
                            status="success"
                            v-if="btnsConfig.see"
                            :disabled="getStatusById(record.id) !== 0"
                            @click="props.cbConfig?.seeCb && props.cbConfig?.seeCb(record)"
                            >{{ seeText }}</a-link
                        >
                        <a-popover
                            position="left"
                            :title="labelConfig.logTitle"
                            trigger="click"
                            v-if="btnsConfig.log"
                            @popup-visible-change="onLogVisibleChange"
                        >
                            <a-link
                                type="text"
                                size="small"
                                :disabled="[1, 3].includes(getStatusById(record.id))"
                                @click="onLog(record)"
                                >{{ logText }}</a-link
                            >
                            <template #content>
                                <a-spin :loading="logLoading">
                                    <p style="white-space: pre-line">
                                        {{ logMessage || labelConfig.noLogTip }}
                                    </p>
                                </a-spin>
                            </template>
                        </a-popover>
                        <a-popconfirm
                            v-if="btnsConfig.delete"
                            :content="confirmDelete"
                            @ok="onDelete(record)"
                        >
                            <a-link
                                type="text"
                                size="small"
                                status="danger"
                                :disabled="[1, 2, -3].includes(getStatusById(record.id))"
                                >{{ deleteText }}</a-link
                            >
                        </a-popconfirm>
                    </a-space>
                </template>
            </a-table>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, Ref, watch, reactive, onUnmounted, computed } from 'vue'
import {
    TABLE_MIN_WIDTH,
    ScenarioColumnsWithCheckbox,
    ScenarioColumns,
    labelConfig,
    calcStateMap,
    ALLOW_CLICK_DATAINDEX_LIST,
    ActionBtnsConfig,
    ApiConfig,
    CbConfig,
    TableDataItem,
} from '../../config'
import dayjs from 'dayjs'
import { minuteFormat02 } from '@dhicn/helper/date-formatter'
import { Message } from '@arco-design/web-vue'
import type { CalculateStatusOutput } from '@dhicn/domain-paas-sdk-ts/model-driver-service'
import { SecondFormat01 } from '@dhicn/helper/date-formatter'

const {
    searchHolder,
    confirmDelete,
    calcText,
    cancelText,
    seeText,
    editText,
    logText,
    deleteText,
    delSuccessTip,
} = labelConfig

const compareList = defineModel<TableDataItem[]>({ default: [] })

const props = withDefaults(
    defineProps<{
        loading: boolean // 数据加载状态
        scenarioList: TableDataItem[] // 表格数据
        apiConfig?: ApiConfig // 接口配置
        cbConfig?: CbConfig // 回调配置
        showContrast?: boolean // 是否显示选择方案对比列
        btnsConfig?: ActionBtnsConfig // 操作栏功能按钮控制
        formatType?: string
        loopGap?: {
            all: number // 所有方案的状态更新间隔
            single: number // 单个方案的状态更新间隔
        }
    }>(),
    {
        loading: () => false,
        formatType: SecondFormat01,
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
            runModel: (id: string, templateScenarioId: string) => Promise.resolve({}),
            cancelModel: (ids: string[]) => Promise.resolve({}),
            queryCompareScenarios: (id: string) => Promise.resolve([]),
            queryModelProcess: () => Promise.resolve({}),
        }),
        cbConfig: () => ({
            editCb: () => {},
            seeCb: () => {},
        }),
        loopGap: () => ({
            all: 5000,
            single: 1000,
        }),
    },
)

const scroll = ref({
    x: TABLE_MIN_WIDTH,
    y: '100%',
})

const tableData: TableDataItem[] = reactive([])
const statusList: Ref<CalculateStatusOutput[]> = ref([])

const deletedIdList: Ref<string[]> = ref([]) // 已删除方案id列表
const undeletedScenarioList = computed(() => {
    return props.scenarioList.filter((item) => !deletedIdList.value.includes(item.id))
})

const isQueryComparing = ref(false) // 是否正在查询对比方案
const compareIdList: Ref<string[]> = ref([]) // 可对比方案id列表（不代表用户都勾选，只是后端返回的可以进行对比的方案id列表）

const restoreTableData = () => {
    compareIdList.value = []
    tableData.splice(0, tableData.length, ...undeletedScenarioList.value).map((item) => {
        item.selected = false
        return item
    })
}

watch(
    tableData,
    () => {
        const selectedList = tableData.filter((item) => item.selected)
        if (!selectedList.length && compareIdList.value.length && props.showContrast) {
            // console.warn('在可对比的方案列表中，没有选中任何方案，table数据重置')
            restoreTableData()
        }
        compareList.value = selectedList
    },
    {
        deep: true,
    },
)

const queryCompare = (id: string) => {
    if (compareIdList.value.length > 1) {
        // console.warn('已经有对比方案了,不再查询！')
        return
    }
    isQueryComparing.value = true
    props.apiConfig.queryCompareScenarios &&
        props.apiConfig
            .queryCompareScenarios(id)
            .then((res) => {
                // console.log('compare', res)
                compareIdList.value = res || []
                if (!compareIdList.value.length) {
                    // console.warn('没有对比方案！,数据异常！')
                    // 表格数据还原展示
                    restoreTableData()
                    return
                }
                if (compareIdList.value.length === 1) {
                    // console.warn('只有一个方案，无法对比！')
                    Message.info(labelConfig.noCompareTip)
                    restoreTableData()
                    return
                }
                // 有可对比的方案，过滤展示的对比方案
                const selectedIdList = tableData
                    .filter((item) => item.selected)
                    .map((item) => item.id)
                const filterList = undeletedScenarioList.value
                    .filter((item) => compareIdList.value.includes(item.id))
                    .map((item) => {
                        if (selectedIdList.includes(item.id)) {
                            item.selected = true
                        } else {
                            item.selected = false
                        }
                        return item
                    })
                tableData.splice(0, tableData.length, ...filterList)
            })
            .finally(() => {
                isQueryComparing.value = false
            })
}

const getStatusById = (id: string) => {
    const item = statusList.value.find((item) => item.scenarioId === id)
    // "0": "Computed",
    // "1": "Waiting",
    // "2": "Computing",
    // "3": "UnCompute",
    // "-3": "Cancelling",
    // "-2": "Canceled",
    // "-1": "Failed"
    return item?.status as number
}

const onCellClick = (record: any, column: any) => {
    // console.log('on Cell Click', record, column)
    if (isQueryComparing.value || getStatusById(record.id) !== 0) {
        // console.warn('正在查询对比方案或者方案未计算完成，不可点击！')
        return
    }
    if (props.showContrast && ALLOW_CLICK_DATAINDEX_LIST.includes(column?.dataIndex)) {
        record.selected = !record.selected
        if (record.selected) {
            queryCompare(record.id)
        }
    }
}
const onSortChange = (dataIndex: string, direction: string) => {
    // console.log('on Sort Change', dataIndex, direction)
    if (dataIndex === 'createTime') {
        // 创建时间
        if (direction === 'ascend') {
            const ascendList = tableData.sort(
                (a, b) => dayjs(a.createTime!).unix() - dayjs(b.createTime!).unix(),
            )
            tableData.splice(0, tableData.length, ...ascendList)
        }
        if (direction === 'descend') {
            const descendList = tableData.sort(
                (a, b) => dayjs(b.createTime!).unix() - dayjs(a.createTime!).unix(),
            )
            tableData.splice(0, tableData.length, ...descendList)
        }
    }
    if (dataIndex === 'time') {
        // 起止时间
        if (direction === 'ascend') {
            const ascendList = tableData.sort(
                (a, b) => dayjs(a.startTime!).unix() - dayjs(b.startTime!).unix(),
            )
            tableData.splice(0, tableData.length, ...ascendList)
        }
        if (direction === 'descend') {
            const descendList = tableData.sort(
                (a, b) => dayjs(b.startTime!).unix() - dayjs(a.startTime!).unix(),
            )
            tableData.splice(0, tableData.length, ...descendList)
        }
    }
    if (dataIndex === 'calcState') {
        // 计算状态
        if (direction === 'ascend') {
            const ascendList = tableData.sort((a, b) => getStatusById(a.id) - getStatusById(b.id))
            tableData.splice(0, tableData.length, ...ascendList)
        }
        if (direction === 'descend') {
            const descendList = tableData.sort((a, b) => getStatusById(b.id) - getStatusById(a.id))
            tableData.splice(0, tableData.length, ...descendList)
        }
    }
}
const onSelectChange = (record: TableDataItem) => {
    // console.log('onSelect Change', record)
    if (record.selected) {
        queryCompare(record.id)
    }
}

watch(
    () => props.showContrast,
    (show) => {
        if (!show) {
            // 取消对比，表格数据还原展示
            restoreTableData()
        }
    },
)

const getWaitNoById = (id: string) => {
    const status = getStatusById(id)
    if (status === 1) {
        const item = statusList.value.find((item) => item.scenarioId === id)
        return item?.waitingNo || 0
    }
    return ''
}
const getProgressById = (id: string) => {
    const status = getStatusById(id)
    if (status === 2) {
        const item = statusList.value.find((item) => item.scenarioId === id)
        const percent = item?.progress || 0
        return `${percent}%`
    }
    return ''
}

/** 更新所有方案计算状态 */
const updateAllStatus = () => {
    if (!props?.apiConfig?.queryState) {
        return
    }
    const ids = undeletedScenarioList.value.map((item) => item.id)
    props.apiConfig.queryState(ids).then((list) => {
        // // console.log('status List', list)
        statusList.value = list || []
    })
}

// 所有方案的状态更新timer
const loopAllTimer: Ref<number | null> = ref(null)

const loopCaclStatus = () => {
    if (loopAllTimer.value) {
        clearInterval(loopAllTimer.value)
    }
    // console.log('loopCaclStatus', props.loopGap.all)
    updateAllStatus()
    loopAllTimer.value = setInterval(() => {
        updateAllStatus()
    }, props.loopGap.all)
}

watch(
    () => props.scenarioList,
    (val) => {
        if (val && val.length) {
            tableData.splice(0, tableData.length, ...val)
            loopCaclStatus()
        }
    },
)

// 单方案的状态更新timer组成的map
const loopItemMap: Record<string, number> = reactive({})
/** 更新单个方案的计算状态 */
const updateSingleStatus = (id: string) => {
    if (!props?.apiConfig?.queryState) {
        return
    }
    props.apiConfig.queryState([id]).then((list) => {
        const item = list?.[0]
        // // console.log('single status item', item)
        if (item) {
            if (item.status === 0) {
                // console.log('single status item finished ,no loop')
                loopItemMap[id] && clearInterval(loopItemMap[id])
            }
            const index = statusList.value.findIndex((item) => item.scenarioId === id)
            if (index > -1) {
                statusList.value.splice(index, 1, item)
            }
        }
    })
}
const loopSingleCaclStatus = (id: string) => {
    if (loopItemMap[id]) {
        clearInterval(loopItemMap[id])
    }
    loopItemMap[id] = setInterval(() => {
        updateSingleStatus(id)
    }, props.loopGap.single)
}

watch(
    statusList,
    () => {
        // 找出所有计算中/排队中/取消中的方案，开启单方案的状态更新timer
        const ids = statusList.value
            .filter((item) => {
                return [1, 2, -3].includes(item.status!)
            })
            .map((item) => item.scenarioId)
        // // console.log('computed,wating,caceling s ids', ids)
        ids.forEach((id) => {
            id && loopSingleCaclStatus(id)
        })
    },
    {
        deep: true,
    },
)

onUnmounted(() => {
    if (loopAllTimer.value) {
        clearInterval(loopAllTimer.value)
    }
    Object.keys(loopItemMap).forEach((key) => {
        if (loopItemMap[key]) {
            clearInterval(loopItemMap[key])
        }
    })
})

const filterTable = (str: string) => {
    if (!str) {
        tableData.splice(0, tableData.length, ...undeletedScenarioList.value)
    } else {
        const arr = undeletedScenarioList.value.filter((item) => {
            return item.scenarioName?.includes(str) || item.description?.includes(str)
        })
        tableData.splice(0, tableData.length, ...arr)
    }
}

const onCalc = (record: TableDataItem) => {
    const status = getStatusById(record.id)
    // console.log('calc record', status, record)
    if (status == null) {
        // console.warn('status is null')
        return
    }
    if ([1, 2, -3].includes(status)) {
        // 排队/计算/取消中
        if (status === 3) {
            // console.warn('caceling, please wait')
            return
        }
        if (props?.apiConfig?.cancelModel) {
            props.apiConfig.cancelModel([record.id]).then((res) => {
                // console.log('cancel res', res)
                const { hasError, message } = res || {}
                if (!hasError) {
                    updateSingleStatus(record.id)
                } else {
                    Message.error(message || '')
                }
            })
        }
    } else {
        if (props?.apiConfig?.runModel) {
            props.apiConfig.runModel(record.id, record.inheritedScenario!).then((res) => {
                // console.log('run res', res)
                const { hasError, message } = res || {}
                if (!hasError) {
                    updateSingleStatus(record.id)
                } else {
                    Message.error(message || '')
                }
            })
        }
    }
}

const logMessage = ref('')
const onLogVisibleChange = (visible: boolean) => {
    if (!visible) {
        logMessage.value = ''
    }
}
const logLoading = ref(false)
const onLog = async (record: TableDataItem) => {
    // console.log('log record', record)
    if (props!.apiConfig!.queryLog) {
        try {
            logLoading.value = true
            const { message } = await props!.apiConfig!.queryLog(record.id)
            try {
                if (!message) return
                logMessage.value =
                    JSON.parse(message)
                        .map((item: any) => {
                            const { Time, Message, ErrorMsg } = item
                            return `${dayjs(Time).format(props.formatType)} : ${
                                ErrorMsg !== '' ? ErrorMsg : Message
                            }`
                        })
                        .join('\n') || ''
            } catch (error) {
                logMessage.value = ''
                console.warn('parse message error', error)
            }
        } catch (error) {
            logMessage.value = ''
        } finally {
            logLoading.value = false
        }
    }
}
const onDelete = (record: TableDataItem) => {
    // console.log('delete record', record)
    if (props?.apiConfig?.deleteScenario) {
        props.apiConfig.deleteScenario([record.id]).then((delRes) => {
            // console.log('del scenario Res', delRes)
            if (delRes) {
                // 删除成功
                const index = tableData.findIndex((item) => item.id === record.id)
                if (index > -1) {
                    deletedIdList.value.push(record.id)
                    tableData.splice(index, 1)
                }
                Message.success(delSuccessTip)
            }
        })
    }
}

// 监听dom尺寸变化，调整表格展示情况
const objResizeObserver = new ResizeObserver(function (entries) {
    const entry = entries[0]
    const cr = entry.contentRect
    // // console.log('cr----', cr)
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

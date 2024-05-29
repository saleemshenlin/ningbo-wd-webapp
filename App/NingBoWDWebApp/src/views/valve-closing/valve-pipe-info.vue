<script setup lang="ts">
import { Ref, onUnmounted, reactive, ref, watch } from 'vue'
import { TablePipeColumns, TableValveColumns } from './config'
import { labelConfig } from '@/constant/labelConfig'
import { VALVE_CLOSING_TIME_FORMAT } from '@/constant'
import { useValveClosingAnalysisStore } from '@/store/ValveClosingAnalysis'
import { ILoading } from './types'
import { IconLocation } from '@arco-design/web-vue/es/icon'
import * as WDApi from '@dhicn/domain-paas-sdk-ts/wd-domain'
import { Message, TableData } from '@arco-design/web-vue'

interface IProps {
    loading: ILoading
    queryValve: () => void
}

const props = withDefaults(defineProps<IProps>(), {
    loading: () => ({
        loadingPipe: false,
        loadingValve: false,
    }),
    queryValve: () => [],
})

const valveClosingAnalysisStore = useValveClosingAnalysisStore()

const {
    labelValveTimeRange,
    labelValvePipeTableTitle,
    labelValveTableTitle,
    labelBtnSelectPipe,
    labelBtnQueryValve,
    deleteText,
} = labelConfig

const scroll = reactive({
    x: '400',
})

/** 选择管道 按钮 */
const selectPipe = () => {
    valveClosingAnalysisStore.isMapEdit = true
    valveClosingAnalysisStore.valveInfo.valveTableData = []
}

/** 删除管道 */
const deletePipe = (record: Record<string, any>) => {
    console.log('deletePipe', record)
    const index = valveClosingAnalysisStore.valveInfo.pipeTableData.findIndex(
        (item: any) => item.MUID === record.MUID,
    )
    if (index > -1) {
        valveClosingAnalysisStore.valveInfo.pipeTableData.splice(index, 1)
        Message.error('删除成功!')
    }
}
const selectRow: Ref<WDApi.GisValveInfo> = ref({})

/** 选中阀门列表当前行 */
const rowClass = ({ raw }: { raw: WDApi.GisValveInfo }) => {
    // console.log('rowClass', raw, selectRow.value === raw)
    return selectRow.value === raw ? 'selected-row' : ''
}

const rowClick = (record: TableData) => {
    // console.log('rowClick', record)
    selectRow.value = record as WDApi.GisValveInfo
}

onUnmounted(() => {
    valveClosingAnalysisStore.hasSubScenario = false
})

watch(
    // 监听起始时间、结束时间变化
    () => [
        valveClosingAnalysisStore.valveInfo.beginTime,
        valveClosingAnalysisStore.valveInfo.endTime,
    ],
    (newVal) => {
        if (
            newVal[0] === '' ||
            newVal[1] === '' ||
            newVal[0] === undefined ||
            newVal[1] === undefined
        ) {
            return
        }
        // 比较时间大小,如果起始时间大于结束时间,则互相替换
        if (newVal[0] > newVal[1]) {
            valveClosingAnalysisStore.valveInfo.beginTime = newVal[1]
            valveClosingAnalysisStore.valveInfo.endTime = newVal[0]
        }
        valveClosingAnalysisStore.valveInfo.timeRange = newVal as string[]
    },
)

const popupVisibleChange = (val: boolean) => {
    const elements = document.querySelectorAll(
        '.arco-timepicker-footer-btn-wrapper button:first-child',
    ) as unknown as HTMLElement[]
    elements?.forEach((item) => {
        item.style.visibility = val ? 'hidden' : 'visible'
    })
}

const changeBeginTime = (
    timeString: string | (string | undefined)[] | undefined,
    time: Date | (Date | undefined)[] | undefined,
) => {
    console.log('changeBeginTime', timeString)
    valveClosingAnalysisStore.valveInfo.beginTime = timeString as string
}

const changeEndTime = (
    timeString: string | (string | undefined)[] | undefined,
    time: Date | (Date | undefined)[] | undefined,
) => {
    console.log('changeEndTime', timeString)
    valveClosingAnalysisStore.valveInfo.endTime = timeString as string
}
</script>
<template>
    <div class="pipe-valve-info">
        <div class="time-range">
            <span class="time-title">{{ labelValveTimeRange }}</span>
            <div class="time-comp">
                <a-space>
                    <a-time-picker
                        v-model="valveClosingAnalysisStore.valveInfo.beginTime"
                        :format="VALVE_CLOSING_TIME_FORMAT"
                        :style="{ width: '150px' }"
                        :allowClear="false"
                        :step="{
                            minute: 5,
                        }"
                        :disabled="valveClosingAnalysisStore.hasSubScenario"
                        @change="changeBeginTime"
                        @popup-visible-change="popupVisibleChange"
                    ></a-time-picker>
                    <span :style="{ width: '20px', textAlign: 'center' }"> - </span>
                    <a-time-picker
                        v-model="valveClosingAnalysisStore.valveInfo.endTime"
                        :format="VALVE_CLOSING_TIME_FORMAT"
                        :style="{ width: '150px' }"
                        :allowClear="false"
                        :step="{
                            minute: 5,
                        }"
                        :disabled="valveClosingAnalysisStore.hasSubScenario"
                        @change="changeEndTime"
                        @popup-visible-change="popupVisibleChange"
                    ></a-time-picker>
                </a-space>
            </div>
        </div>

        <!-- 管道选择 -->
        <div class="pipe-info">
            <div class="title">
                <span class="titleFont">{{ labelValvePipeTableTitle }}</span>
                <div>
                    <a-space>
                        <a-button
                            type="primary"
                            @click="selectPipe"
                            :disabled="
                                valveClosingAnalysisStore.isMapEdit ||
                                valveClosingAnalysisStore.hasSubScenario
                            "
                        >
                            {{ labelBtnSelectPipe }}</a-button
                        >
                        <a-button
                            type="outline"
                            @click="props.queryValve"
                            :disabled="
                                !valveClosingAnalysisStore.isMapEdit ||
                                valveClosingAnalysisStore.hasSubScenario
                            "
                            >{{ labelBtnQueryValve }}</a-button
                        >
                    </a-space>
                </div>
            </div>
            <a-table
                class="table-data"
                :loading="props.loading.loadingPipe"
                :columns="TablePipeColumns"
                :data="valveClosingAnalysisStore.valveInfo.pipeTableData"
                :pagination="false"
                :bordered="false"
                :scroll="scroll"
                :scrollbar="true"
                :sticky-header="100"
            >
                <template #Action="{ record }">
                    <a-button
                        type="text"
                        status="danger"
                        @click="deletePipe(record)"
                        :disabled="
                            !valveClosingAnalysisStore.isMapEdit ||
                            valveClosingAnalysisStore.hasSubScenario
                        "
                    >
                        {{ deleteText }}
                    </a-button>
                </template>
            </a-table>
        </div>
        <!-- 阀门列表 -->
        <div class="valve-info">
            <span class="title-valve">{{ labelValveTableTitle }}</span>
            <a-table
                class="table-data"
                :data="valveClosingAnalysisStore.valveInfo.valveTableData"
                :loading="props.loading.loadingValve"
                :columns="TableValveColumns"
                :pagination="false"
                :bordered="false"
                :scroll="scroll"
                :scrollbar="true"
                :sticky-header="100"
                :row-class="rowClass"
                @row-click="rowClick"
            >
                <template #location="{ record }">
                    <a-button
                        type="text"
                        @click="valveClosingAnalysisStore.activeValve = record"
                        :disabled="valveClosingAnalysisStore.hasSubScenario"
                    >
                        <template #icon>
                            <icon-location :style="{ color: 'blue' }" />
                        </template>
                    </a-button>
                </template>
            </a-table>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.pipe-valve-info {
    display: flex;
    flex-direction: column;
    padding: 10px;
    gap: 10px;
    height: 100%;

    .titleFont {
        font-style: normal;
        font-weight: 700;
        font-size: 16px;
        line-height: 20px;
        color: #1d2129;
    }

    .time-range {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 30px;
        .time-title {
            font-style: normal;
            font-weight: 700;
            font-size: 16px;
            line-height: 20px;
            color: #1d2129;
        }
        .time-comp {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 350px;
        }
    }
    .pipe-info,
    .valve-info {
        display: flex;
        flex-direction: column;
        height: calc(50% - 40px);

        :deep(.arco-table-th) {
            font-weight: 400;
            font-size: 16px;
            line-height: 22px;
            color: #1d2129;
        }
        .title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px 0;
            height: 30px;
        }
        .title-valve {
            height: 30px;
            font-style: normal;
            font-weight: 700;
            font-size: 16px;
            line-height: 20px;
            padding: 5px 0;
            color: #1d2129;
        }

        .table-data {
            height: calc(100% - 40px);
        }
    }
}
:deep(.selected-row) {
    td {
        background-color: #e8f7ff !important;
    }
}
</style>

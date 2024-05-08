import { getLangTextByKey } from './i18n/index'
import type { TableColumnData } from '@arco-design/web-vue'
import type { Scenario } from '@dhicn/domain-paas-sdk-ts/scenario-service'
import type {
    CalculateStatusOutput,
    CalculateLogsOutput,
    ModelOperationResult,
    CancelResult,
} from '@dhicn/domain-paas-sdk-ts/model-driver-service'

export const ScenarioColumns: TableColumnData[] = [
    {
        title: '方案名称',
        width: 150,
        dataIndex: 'scenarioName',
        fixed: 'left',
    },
    {
        title: '创建人',
        width: 120,
        dataIndex: 'creatorName',
        tooltip: true,
        ellipsis: true,
    },
    {
        title: '创建时间',
        width: 150,
        dataIndex: 'createTime',
        slotName: 'createTime',
    },
    {
        title: '计算起止时间',
        width: 310,
        dataIndex: 'time',
        slotName: 'startEnd',
    },
    {
        title: '描述',
        dataIndex: 'description',
        width: 340,
        tooltip: { position: 'right', 'content-class': 'long_toop_tip' },
        ellipsis: true,
    },
    {
        title: '计算状态',
        width: 150,
        dataIndex: 'calcState',
        slotName: 'calcState',
    },
    {
        title: '操作',
        width: 280,
        dataIndex: 'action',
        slotName: 'action',
        fixed: 'right',
    },
]

export const ScenarioColumnsWithCheckbox: TableColumnData[] = [
    {
        title: '',
        width: 50,
        dataIndex: 'selected',
        slotName: 'selected',
        fixed: 'left',
    },
    ...ScenarioColumns,
]
export const ALLOW_CLICK_DATAINDEX_LIST = ['scenarioName']
export interface ActionBtnsConfig {
    cacl: boolean // 计算
    edit: boolean // 编辑
    see: boolean // 查看
    log: boolean // 日志
    delete: boolean // 删除
}

export interface ApiConfig {
    queryState?: (ids: string[]) => Promise<CalculateStatusOutput[]> // 查询计算状态
    queryLog?: (id: string) => Promise<CalculateLogsOutput> // 查询日志
    deleteScenario?: (ids: string[]) => Promise<boolean> // 删除方案
    runModel?: (id: string, templateScenarioId: string) => Promise<ModelOperationResult> // 计算
    cancelModel?: (ids: string[]) => Promise<CancelResult> // 取消计算
    queryCompareScenarios?: (id: string) => Promise<string[]> // 查询可与指定方案可比较的方案id列表
    queryModelProcess?: Function // 查询计算的进度
}
export interface CbConfig {
    editCb: (record: Scenario) => void // 编辑回调
    seeCb: (record: Scenario) => void // 查看回调
}

export const TABLE_MIN_WIDTH = 1500
export const labelConfig = {
    searchHolder: getLangTextByKey('ScenarioTable.searchHolder'),
    noCompareTip: getLangTextByKey('ScenarioTable.noCompareTip'),
    calcText: getLangTextByKey('ScenarioTable.calcText'),
    cancelText: getLangTextByKey('Common.Cancel'),
    editText: getLangTextByKey('Common.Edit'),
    seeText: getLangTextByKey('Common.SeeText'),
    logText: getLangTextByKey('ScenarioTable.logText'),
    deleteText: getLangTextByKey('Common.Delete'),
    confirmDelete: getLangTextByKey('ScenarioTable.confirmDelete'),
    delSuccessTip: getLangTextByKey('ScenarioTable.delSuccessTip'),
    logTitle: getLangTextByKey('ScenarioTable.logTitle'),
    noLogTip: getLangTextByKey('ScenarioTable.noLogTip'),
}

export type ScenarioTableState = 'table' | 'new' | 'edit' | 'result'

export interface IScenarioBaseInfo {
    name: string // 方案名称
    description: string // 方案描述
    date: string // 方案开始时间
    modelTemplate?: string // 模型模板
}

// export const getLangTextByKey = (key: string): string => {
//     // TODO 多语言的时候再迁移
//     // TODO 临时注释掉

//     const msgMap: Record<string, string> = {
//         'ScenarioTable.scenarioName': '方案名称',
//         'ScenarioTable.creatorName': '创建人',
//         'ScenarioTable.createTime': '创建时间',
//         'ScenarioTable.startEndTime': '计算起止时间',
//         'ScenarioTable.calcState': '计算状态',
//         'ScenarioTable.searchHolder': '请输入搜索关键字',
//         'ScenarioTable.calcText': '计算',
//         'ScenarioTable.logText': '日志',
//         'ScenarioTable.confirmDelete': '确定删除该方案吗？',
//         'ScenarioTable.delSuccessTip': '删除成功',
//         'ScenarioTable.logTitle': '模型计算日志',
//         'ScenarioTable.noLogTip': '暂无日志',
//         'ScenarioTable.noCompareTip': '没有可以对比的方案哦～',
//         'ScenarioTable.calcSuccess': '计算成功',
//         'ScenarioTable.lineNum': '当前排队',
//         'ScenarioTable.calcProgress': '计算进度',
//         'ScenarioTable.notCalc': '未计算',
//         'ScenarioTable.aborting': '取消中',
//         'ScenarioTable.aborted': '已取消',
//         'ScenarioTable.calcFailed': '计算失败',
//     }
//     return msgMap[key]
// }

export const editScenarioText = '方案列表'
export const editScenarioNew = '新建方案'
export const addScenarioText = '添加方案'
export const editNewScenarioText = '方案名称'
export const nameTip = '请填写方案名称'
export const editNewScenarioDescription = '方案描述'
export const descriptionTip = '请填写方案描述'
export const scenarioDateText = '方案日期'
export const modelTemplateText = '模型模板'
export const submitText = '配置'
export const submitText2 = '模拟验证'
export const cancelText = '取消'
export const logText = '日志'
export const deleteText = '删除'
export const editText = '编辑'
export const calcText = '计算'
export const seeText = '查看'
export const cancelCommitText = '确定取消吗?'
export const logTitle = getLangTextByKey('ScenarioTable.logTitle')
export const noLogTip = getLangTextByKey('ScenarioTable.noLogTip')
export const confirmDelete = getLangTextByKey('ScenarioTable.confirmDelete')

export const BaseInfoLimit = {
    max_scenario_name_length: 199,
    max_scenario_description_length: 1999,
}

export type TableDataItem = Scenario & {
    selected?: boolean
}

/**
 *  获取计算信息
 *  "0": "Computed",
 *  "1": "Waiting",
 *  "2": "Computing",
 *  "3": "UnCompute",
 *  "-3": "Cancelling",
 *  "-2": "Canceled",
 *  "-1": "Failed"
 */
export const calcStateMap: Record<string, { color: string; text: string }> = {
    '0': {
        color: 'green',
        text: getLangTextByKey('ScenarioTable.calcSuccess'),
    },
    '1': {
        color: 'blue',
        text: getLangTextByKey('ScenarioTable.lineNum'),
    },
    '2': {
        color: 'cyan',
        text: getLangTextByKey('ScenarioTable.calcProgress'),
    },
    '3': {
        color: 'gray',
        text: getLangTextByKey('ScenarioTable.notCalc'),
    },
    '-3': {
        color: 'orange',
        text: getLangTextByKey('ScenarioTable.aborting'),
    },
    '-2': {
        color: 'orangered',
        text: getLangTextByKey('ScenarioTable.aborted'),
    },
    '-1': {
        color: 'red',
        text: getLangTextByKey('ScenarioTable.calcFailed'),
    },
}

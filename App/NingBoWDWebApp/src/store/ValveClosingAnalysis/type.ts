import * as WDApi from '@dhicn/domain-paas-sdk-ts/wd-domain'
import { Scenario } from '@dhicn/domain-paas-sdk-ts/scenario-service'

export interface IState {
    isMapEdit: boolean
    valveInfo: IValveInfo
    recordValveInfo: IValveInfo
    editSubTag: boolean
    hasSubScenario: boolean
    activeValve: WDApi.GisValveInfo | null
}

export interface IValveInfo {
    timeRange: string[] // 关阀时间段
    pipeTableData: any // 管网数据
    valveTableData: WDApi.GisValveInfo[] | undefined // 关阀数据
    beginTime?: string // 开始时间
    endTime?: string // 结束时间
}

export interface ICompareList extends Scenario {
    parentId?: string
    children?: ICompareList[]
    selected?: boolean
    number?: string
}

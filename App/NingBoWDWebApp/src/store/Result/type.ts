import { ClassifyLegendInfo } from '@dhicn/domain-paas-sdk-ts/model-configuration'
import { StyleObject } from '@dhicn/domain-paas-sdk-ts/result-service'
import type { Scenario } from '@dhicn/domain-paas-sdk-ts/scenario-service'

export interface ResultState {
    scenario: Scenario | null
    loading: boolean
    timeSeriesList: ITimeSeriesList
    resultStyle: StyleObject | null
    classifyLegendList: ClassifyLegendInfo[]
}

export interface ITimeSeriesList {
    time?: string[]
    iDs?: string[]
    data?: number[][]
    gis?: string
    key?: string
}

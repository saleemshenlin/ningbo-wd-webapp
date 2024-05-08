import type { Scenario, Library } from '@dhicn/domain-paas-sdk-ts/scenario-service'
import { ScenarioType } from './config'
import type { TimeseriesBatchForV3Output } from '@dhicn/domain-paas-sdk-ts/iot-service'

export interface IHistoryTSDataset {
    indicator: string
    measureTsData: TimeseriesBatchForV3Output
    modelTsData: TimeseriesBatchForV3Output
    cleanTsData?: TimeseriesBatchForV3Output
}
export interface ScenarioState {
    scenarios: Scenario[]
    loading: boolean
    templateMap: Map<ScenarioType, Scenario>
    libraryMap: Map<ScenarioType, Library>
    historyTSDataMap: Map<string, IHistoryTSDataset>
}

import { Scenario } from '@dhicn/domain-paas-sdk-ts/scenario-service'
export interface ScenarioLabState {
    compareScenarioList: Scenario[]
}
export interface InletDataInput {
    scenarioId: string
    inlet: string
}
export interface ScadaInletInput {
    startTime: string
    endTime: string
    inlet: string
}

export interface FileInletInput {
    excel: File
}

export interface BioTankInput {
    productLine: string
    modelName: string
}

export interface IndicatorStatisticInput {
    scenarioId: string
    productLine: string
    tankNo: string
    modelName: string
}
export interface TsByLineInput {
    scenarioId: string
    productLine: string
    modelName: string
}

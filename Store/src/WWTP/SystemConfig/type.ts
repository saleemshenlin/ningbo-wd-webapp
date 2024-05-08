import * as WwtpApi from '@dhicn/domain-paas-sdk-ts/wwtp-domain'
import type { ModifyModelParameterConfigValueInput } from '@dhicn/domain-paas-sdk-ts/wwtp-infrastructure'
export interface SysConfigState {
    test: string
}

export type AlarmConfigInOut = WwtpApi.AlarmConfigInOut
export type ProcessedSettingDto = WwtpApi.ProcessedSettingDto

export interface InletAlarmInput {
    inlet: string
    modelName: string
}

export type InletParametersOutput = WwtpApi.InletParametersOutput
export type SimIndicatorOutput = WwtpApi.WqSimulationIndicatorOutput
export type SysStatisticConfigInOut = WwtpApi.SysStatisticConfigInOut

export type ModifyModelParaInput = ModifyModelParameterConfigValueInput
export type WqSimIndicatorInput = WwtpApi.WqSimulationIndicatorInput
export type UpdateSysStatisticConfigsInput = WwtpApi.UpdateSysStatisticConfigsInput

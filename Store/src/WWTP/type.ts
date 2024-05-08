import * as WwtpApi from '@dhicn/domain-paas-sdk-ts/wwtp-domain'
import type { BaseProductLineInOut } from '@dhicn/domain-paas-sdk-ts/wwtp-infrastructure'

export interface WWTPState {
    dateNowTime: string
    productLines: Record<string, BaseProductLineInOut[]>
    inWQData: WwtpApi.InletWqOut[]
    outWQData: WwtpApi.OutletWqOut[]
    chemicalCostList: WwtpApi.ChemicalCostPerFlowOutput[]
    entireProcessTSDataset: WwtpApi.EntireProcessWqOut[]
    dataBoards: WwtpApi.DataBoardFullOut[]
    waterInData: WwtpApi.PredictAlarmOut[]
    waterOutData: WwtpApi.PredictAlarmOut[]
    toxicAlarmData: WwtpApi.ToxicAlarmsOutput[]
    modelPrecision: WwtpApi.ModelPrecision[]
    deviceMaintenance: WwtpApi.DeviceMaintenanceOutput[]
    optimOutData: WwtpApi.ModelOptimDto
    hydroEnergyCostList: WwtpApi.EnergyCostOutput[]
}

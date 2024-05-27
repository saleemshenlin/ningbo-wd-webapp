import { DailyFlowInfo } from '@/api/tzwd'
import * as ScenarioApi from '@dhicn/domain-paas-sdk-ts/scenario-service'
import * as WDApi from '@dhicn/domain-paas-sdk-ts/wd-domain'
export interface OnlineState {
    dailyWaterVolumeMap: Record<string, DailyFlowInfo[]>
    flowChartData: WDApi.OnlineModelData
    latestScenario: ScenarioApi.Scenario | null
    hyTankStorage: number
}

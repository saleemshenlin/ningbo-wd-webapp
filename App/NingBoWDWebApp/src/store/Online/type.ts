import * as ScenarioApi from '@dhicn/domain-paas-sdk-ts/scenario-service'
import * as WDApi from '@dhicn/domain-paas-sdk-ts/wd-domain'
export interface IOnlineState {
    flowChartData: WDApi.OnlineModelData
    latestScenario: ScenarioApi.Scenario | null
    template: ScenarioApi.Scenario | null
    library: ScenarioApi.Library | null
}

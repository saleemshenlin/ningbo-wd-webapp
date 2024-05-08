import type { Scenario } from '@dhicn/domain-paas-sdk-ts/scenario-service'

export interface useScenarioManagerApiState {
    template: Scenario | null
    latestScenario: Scenario | null
}

import type { Library, Scenario } from '@dhicn/domain-paas-sdk-ts/scenario-service'
export interface LibraryApiState {
    libraries: Library[]
    latestScenarioMap: Map<string, Scenario>
}

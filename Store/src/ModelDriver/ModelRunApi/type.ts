import { CalculateStatusOutput } from '@dhicn/domain-paas-sdk-ts/model-driver-service'

export interface ModelRunApiStore {
    runningStateEnabled: Boolean
    runningStateMap: Map<string, CalculateStatusOutput>
}

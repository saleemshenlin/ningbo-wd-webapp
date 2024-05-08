import { FloodSensitivePointInfo } from '@dhicn/domain-paas-sdk-ts/model-configuration'
export interface FloodSensitivePointApiState {
    pointMap: Map<string, FloodSensitivePointInfo[]>
}

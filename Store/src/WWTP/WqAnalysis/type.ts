import * as WwtpApi from '@dhicn/domain-paas-sdk-ts/wwtp-domain'
export interface WqAnalysisState {
    wqEntireProcessData: WwtpApi.WqStatisticOutput[]
    wqMicroOrganismData: WwtpApi.MicroOrganismOutput[]
    wqOnlinePointData: WwtpApi.WqOnlinePointOutput[]
}

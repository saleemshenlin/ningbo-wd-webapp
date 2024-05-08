import * as WwtpApi from '@dhicn/domain-paas-sdk-ts/wwtp-domain'
export interface ToxicityMonitorState {
    realTimeLoading: boolean
    realTimeToxicityList: WwtpApi.RealTimeOutput[]
}
export interface ToxicQuery {
    location: string
    inlet: string
}

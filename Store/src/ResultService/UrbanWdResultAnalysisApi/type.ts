import { ITimeSeries } from '../type'
import * as UrbanWdResultAnalysisApi from '@dhicn/domain-paas-sdk-ts/result-service'
export interface UrbanWdResultAnalysisApiState {
    timeSeriesList: ITimeSeries
    profileTableData: IProfileTableData[]
}

export interface IProfileTableData {
    pipeName: string
    upJunction: string
    downJunction: string
    pipeDiameter: number
    pipeLength: number
    Elev: number
    Oid: number
}

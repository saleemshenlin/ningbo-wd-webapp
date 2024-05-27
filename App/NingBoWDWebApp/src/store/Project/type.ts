import type * as IotApi from '@dhicn/domain-paas-sdk-ts/iot-service'
import type { IndicatorInfo } from '@dhicn/domain-paas-sdk-ts/wd-domain'
export interface IProjectState {
    groupList: IotApi.IotGroupConfigOutput[]
    waterLevelIndicators: IndicatorInfo[]
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

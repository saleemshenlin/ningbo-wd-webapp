import type {
    DeviceDetailInfo,
    DeviceIndicatorInfo,
    TankStorageData,
} from '@dhicn/domain-paas-sdk-ts/wd-domain'
export interface OnlineApiState {
    deviceList: DeviceDetailInfo[]
    indicatorList: DeviceIndicatorInfo[]
    tankStorage: TankStorageData[]
}

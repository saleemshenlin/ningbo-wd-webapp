import * as IotApi from '@dhicn/domain-paas-sdk-ts/iot-service'
export interface IotGroupApiState {
    groupList: IIotGroupConfigOutput[]
    groupWithDeviceList: Record<string, IotApi.IotGroupEquipRelOutput[]>
}

interface IIotGroupConfigOutput extends IotApi.IotGroupConfigOutput {
    parentName?: string
}

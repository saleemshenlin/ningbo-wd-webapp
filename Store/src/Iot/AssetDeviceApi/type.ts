import * as IotApi from '@dhicn/domain-paas-sdk-ts/iot-service'
export interface AssetState {
    test?: string
    assetList: IotApi.AssetInfoOutput[]
}

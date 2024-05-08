import * as IotApi from '@dhicn/domain-paas-sdk-ts/iot-service'
import * as WwtpApi from '@dhicn/domain-paas-sdk-ts/wwtp-domain'
import { DataCleanTagConfigOutput } from '@dhicn/domain-paas-sdk-ts/wwtp-infrastructure'

export interface InstrumentMaintenanceState {
    /** 仪表状态列表 */
    DataCleanTagConfig: DataCleanTagConfigOutput[]
    /** 设备列表  */
    DeviceInfoList: IotApi.DeviceInfosOutput[]
    /** 设备/资产的最新的维保信息 */
    DeviceMaintenanceData: IotApi.DeviceMaintenanceOutput[]
    /** 设备/资产的指定时间范围内的维保信息 */
    DeviceMaintenanceInfos: IotApi.DeviceMaintenanceOutput[]
    /** 仪表状态预警记录列表 */
    DeviceMaintenanceWarmingList: WwtpApi.DeviceMaintenanceOutput[]
}

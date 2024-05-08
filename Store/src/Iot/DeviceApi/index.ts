import { defineStore } from 'pinia'
import { DeviceApiState } from './type'
import { showError, logger } from '../../helper/showError'
import {
    AddDeviceInput,
    DeviceApi,
    SaveDeviceAttributeValuesInput,
    UpdateDeviceInput,
} from '@dhicn/domain-paas-sdk-ts/iot-service'
const StoreName = 'DeviceApi'
export const useDeviceApiStore = defineStore(StoreName, {
    state: (): DeviceApiState => ({}),
    actions: {
        /**
         * 批量添加设备
         * /api/v1/iot/batch-add-device
         */
        async batchAddDevice($api: DeviceApi, params: AddDeviceInput[]) {
            try {
                const res = await $api.apiV1IotBatchAddDevicePost(params)
                return res.data
            } catch (error) {
                showError('API', 'batchAddDevice error', error)
                return {}
            }
        },

        /**
         * 添加或更新设备的属性值
         * /api/v1/iot/save-device-attribute-values
         */
        async saveDeviceAttributeValues($api: DeviceApi, params: SaveDeviceAttributeValuesInput) {
            try {
                const res = await $api.apiV1IotSaveDeviceAttributeValuesPost(params)
                return res.data as unknown as boolean
            } catch (error) {
                showError('API', 'saveDeviceAttributeValues error', error)
                return false
            }
        },

        /**
         * 批量添加或更新设备的属性值
         * /api/v1/iot/batch-save-device-attribute-values
         */
        async batchSaveDeviceAttributeValues(
            $api: DeviceApi,
            params: SaveDeviceAttributeValuesInput[],
        ) {
            try {
                const res = await $api.apiV1IotBatchSaveDeviceAttributeValuesPost(params)
                return res.data as unknown as boolean
            } catch (error) {
                showError('API', 'batchSaveDeviceAttributeValues error', error)
                return false
            }
        },

        /**
         * 分页查询设备列表
         * /api/v1/iot/device-list
         * 应用于:系统配置_设备管理
         */
        async getIotDeviceList($api: DeviceApi) {
            try {
                const res = await $api.apiV1IotDeviceListGet(0, 0, undefined, undefined, 10000)
                return res.data
            } catch (error) {
                showError('API', 'getIotDeviceList error', error)
                return {}
            }
        },

        /**
         * 更新一个设备
         * /api/v1/iot/update-device
         */
        async updateDevice($api: DeviceApi, params: UpdateDeviceInput) {
            try {
                const res = await $api.apiV1IotUpdateDevicePost(params)
                return res.data
            } catch (error) {
                showError('API', 'updateDevice error', error)
                return ''
            }
        },

        /**
         * 根据设备ID列表删除设备
         * /api/v1/iot/delete-devices
         */
        async deleteDevices($api: DeviceApi, deviceIds: string[]) {
            try {
                const res = await $api.apiV1IotDeleteDevicesPost({ deviceIds })
                return res.data as unknown as boolean
            } catch (error) {
                showError('API', 'deleteDevices error', error)
                return false
            }
        },

        /**
         * 分页查询设备列表
         * /api/v1/iot/device-list-withoutIndicator
         * 应用于:长治项目,SortProperty要求按照label排序，api文档没更新，参数错quzhihong口述传1
         */
        async getIotDeviceListWithoutIndicator($api: DeviceApi, type: string) {
            try {
                const res = await $api.apiV1IotDeviceListWithoutIndicatorGet(1, 0, type, 1, 100000)
                return res.data.list || []
            } catch (error) {
                showError('API', 'getIotDeviceListWithoutIndicator error', error)
                return []
            }
        },

        /**
         * 按设备属性查询设备
         * /api/v1/iot/device-list/attr
         * 应用于:天津万峰项目,SortProperty要求按照label排序
         */
        async getIotDeviceListWithAttributes($api: DeviceApi, type?: string) {
            try {
                const res = await $api.apiV1IotDeviceListWithoutIndicatorGet(1, 0, type, 1, 100000)
                return res.data.list || []
            } catch (error) {
                showError('API', 'getIotDeviceListWithAttributes error', error)
                return []
            }
        },
    },
})

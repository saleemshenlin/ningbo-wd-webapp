import { defineStore } from 'pinia'
import { DeviceIndicatorApiState } from './type'
import { showError } from '../../helper/showError'
import {
    AddDeviceIndicatorInput,
    DeviceIndicatorApi,
    UpdateDeviceIndicatorInput,
} from '@dhicn/domain-paas-sdk-ts/digital-twin-service'
const StoreName = 'DeviceIndicatorApi'
export const useDeviceIndicatorApiStore = defineStore(StoreName, {
    state: (): DeviceIndicatorApiState => ({}),
    actions: {
        /**
         * 批量增加设备指标信息
         * /api/v1/device-indicator/add
         * 应用于:天津、台州、横琴、李家岩
         */
        async addDeviceIndicator($api: DeviceIndicatorApi, params: AddDeviceIndicatorInput[]) {
            try {
                const res = await $api.apiV1DeviceIndicatorAddPost(params)
                return res.data
            } catch (error) {
                showError(StoreName, 'addDeviceIndicator error', error)
                return false
            }
        },

        /**
         * 删除租户下的所有指标信息
         * /api/v1/device-indicator/remove-all-indicators-by-tenant
         * 应用于:天津、台州、横琴、李家岩
         */
        async removeAllIndicatorsByTenant($api: DeviceIndicatorApi) {
            try {
                const res = await $api.apiV1DeviceIndicatorRemoveAllIndicatorsByTenantPost()
                return res.data
            } catch (error) {
                showError(StoreName, 'removeAllIndicatorsByTenant error', error)
                return false
            }
        },

        /**
         * 根据租户ID获取所有的设备指标数据
         * /api/v1/device-indicator/all
         * 应用于:系统配置_设备指标
         */
        async getAllDeviceIndicator($api: DeviceIndicatorApi) {
            try {
                const res = await $api.apiV1DeviceIndicatorAllGet()
                return res.data
            } catch (error) {
                showError(StoreName, 'getAllDeviceIndicator error', error)
                return []
            }
        },

        /**
         * 删除指标
         * /api/v1/device-indicator/delete
         * 应用于:系统配置_设备指标
         */
        async deleteDeviceIndicator($api: DeviceIndicatorApi, id: string) {
            try {
                const res = await $api.apiV1DeviceIndicatorDeletePost(id)
                return res.data
            } catch (error) {
                showError(StoreName, 'deleteDeviceIndicator error', error)
                return false
            }
        },

        /**
         * 更新设备指标信息
         * /api/v1/device-indicator/update
         * 应用于:系统配置_设备指标
         */
        async updateDeviceIndicator($api: DeviceIndicatorApi, params: UpdateDeviceIndicatorInput) {
            try {
                const res = await $api.apiV1DeviceIndicatorUpdatePost(params)
                return res.data
            } catch (error) {
                showError(StoreName, 'updateDeviceIndicator error', error)
                return {}
            }
        },

        /**
         * 删除设备下的所有指标信息
         * /api/v1/device-indicator/remove-multi-device-indicators
         */
        async removeMultiDeviceIndicators($api: DeviceIndicatorApi, params: string[]) {
            try {
                const res = await $api.apiV1DeviceIndicatorRemoveMultiDeviceIndicatorsPost(params)
                return res.data
            } catch (error) {
                showError(StoreName, 'removeMultiDeviceIndicators error', error)
                return false
            }
        },
    },
})

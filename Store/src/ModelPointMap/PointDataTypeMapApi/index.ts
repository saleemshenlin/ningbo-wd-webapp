import { defineStore } from 'pinia'
import { PointDataTypeMapApiState } from './type'
import { showError } from '../../helper/showError'
import { PointDataTypeMapApi } from '@dhicn/domain-paas-sdk-ts/digital-twin-service'
const StoreName = 'PointDataTypeMapApi'
export const usePointDataTypeMapApiStore = defineStore(StoreName, {
    state: (): PointDataTypeMapApiState => ({}),
    actions: {
        /**
         * 获取模型点位数据类型与设备指标之间的映射关系列表
         * /api/v1/point-data-type-map/list
         * 应用于:李家岩
         */
        async fetchPointDataTypeMapList(
            $api: PointDataTypeMapApi,
            templateId: string,
            deviceIndicatorId: string,
            modelDataType: string,
            modelPointId: string,
        ) {
            try {
                const res = await $api.apiV1PointDataTypeMapListGet(
                    templateId,
                    deviceIndicatorId,
                    modelDataType,
                    modelPointId,
                )
                return res.data
            } catch (error) {
                showError(StoreName, 'fetch Point Data Type Map List', error)
                return []
            }
        },
    },
})

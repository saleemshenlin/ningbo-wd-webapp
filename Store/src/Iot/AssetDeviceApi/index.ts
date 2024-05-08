import { defineStore } from 'pinia'
import { AssetState } from './type'
import { showError, logger } from '../../helper/showError'
import {
    AddAssetInput,
    AddDeviceInput,
    AssetApi,
    AssetRelationsInput,
    DeleteAssetsInput,
    DeviceApi,
    GetSubAssetsInputV11,
    SaveDeviceAttributeValuesInput,
    UpdateAssetInput,
} from '@dhicn/domain-paas-sdk-ts/iot-service'
const StoreName = 'AssetApi'
export const useAssetApiStore = defineStore(StoreName, {
    state: (): AssetState => ({
        assetList: [], // 资产列表
    }),
    actions: {
        /**
         * 获得所有资产 资产设备指标录入和查询
         * /api/v1/iot/asset-list
         * 应用于:天津生态城项目、系统配置项目
         */
        async fetchGetAllAssetData($api: AssetApi) {
            try {
                const res = await $api.apiV1IotAssetListGet(3, 0, undefined, undefined, 10000)
                this.assetList = res.data.list ?? []
                return res.data ?? {}
            } catch (error) {
                showError('API', 'fetchGetAllAssetData error', error)
                return {}
            }
        },

        /**
         * 批量添加资产信息
         * /api/v1/iot/batch-add-asset
         * 应用于:资产模型配置
         */
        async batchAddAsset($api: AssetApi, params: AddAssetInput[]) {
            try {
                const res = await $api.apiV1IotBatchAddAssetPost(params)
                logger.debug('批量添加资产信息>>', res)
                return res.data
            } catch (error) {
                showError('API', 'batchAddAsset error', error)
                return {}
            }
        },

        /**
         * 构建资产、设备之间的从属关系
         * /api/v1/iot/asset-relations
         * 应用于:资产模型配置
         */
        async fetchAssetRelations($api: AssetApi, params: AssetRelationsInput) {
            try {
                const res = await $api.apiV1IotAssetRelationsPost(params)
                logger.debug('获得资产关系>>', res)
                return res.data
            } catch (error) {
                showError('API', 'fetchAssetRelations error', error)
                return {}
            }
        },

        /**
         * 更新一条资产信息
         * /api/v1/iot/update-asset
         * 应用于:系统配置_设备
         */
        async updateAsset($api: AssetApi, params: UpdateAssetInput) {
            try {
                const res = await $api.apiV1IotUpdateAssetPost(params)
                logger.debug('更新一条资产信息>>', res)
                return res.data
            } catch (error) {
                showError('API', 'updateAsset error', error)
                return ''
            }
        },

        /**
         * 批量删除资产
         * /api/v1/iot/delete-assets
         * 应用于:系统配置_设备
         */
        async deleteAssets($api: AssetApi, assetIds: string[]) {
            try {
                const res = await $api.apiV1IotDeleteAssetsPost({ assetIds })
                logger.debug('批量删除资产>>', res)
                return res.data as unknown as boolean
            } catch (error) {
                showError('API', 'deleteAssets error', error)
                return false
            }
        },

        /**
         * 分页查询设备列表
         * /api/v1/iot/device-list
         */
        async getIotDeviceList(
            $api: DeviceApi,
            sortProperty: number = 0,
            sortOrder: number = 0,
            type: string,
            pageIndex: number = 1,
            pageSize: number = 10000,
        ) {
            try {
                const res = await $api.apiV1IotDeviceListGet(
                    sortProperty,
                    sortOrder,
                    type,
                    pageIndex,
                    pageSize,
                )
                return res.data
            } catch (error) {
                showError('API', 'getIotDeviceList error', error)
                return {}
            }
        },

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
         * 移除资产、设备之间的从属关系
         * /api/v1/iot/delete-asset-relations
         * 应用于:系统配置_资产删除
         */
        async deleteAssetRelations($api: AssetApi, params: AssetRelationsInput) {
            try {
                const res = await $api.apiV1IotDeleteAssetRelationsPost(params)
                logger.debug('移除资产、设备之间的从属关系>>', res)
                return res.data as unknown as boolean
            } catch (error) {
                showError('API', 'deleteAssetRelations error', error)
                return false
            }
        },

        /**
         * /api/v1.1/iot/asset/query-sub-assets
         * 获取子资产
         * 应用于:万峰
         */
        async querySubAssets($api: AssetApi, params: GetSubAssetsInputV11) {
            try {
                const res = await $api.apiV11IotAssetQuerySubAssetsPost(params)
                logger.debug('获取子资产>>', res)
                return res.data
            } catch (error) {
                showError('API', 'querySubAssets error', error)
                return []
            }
        },
    },
})

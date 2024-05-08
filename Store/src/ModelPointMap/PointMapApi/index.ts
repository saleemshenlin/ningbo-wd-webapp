import { defineStore } from 'pinia'
import { PointMapApiState } from './type'
import { showError } from '../../helper/showError'
import {
    AddKeyPointInput,
    AddRealityModelRelationInput,
    PointMapApi,
    UpdateKeyPointInput,
} from '@dhicn/domain-paas-sdk-ts/digital-twin-service'
const StoreName = 'PointMapApi'
export const usePointMapApiStore = defineStore(StoreName, {
    state: (): PointMapApiState => ({}),
    actions: {
        /**
         * 添加资产/设备与模型点位之间的映射关系
         * /api/v1/add-reality-model-relations
         * 应用于:天津、台州、横琴、李家岩
         */
        async addRealityModelRelations($api: PointMapApi, params: AddRealityModelRelationInput[]) {
            try {
                const res = await $api.apiV1AddRealityModelRelationsPost(params)
                return res.data
            } catch (error) {
                showError(StoreName, 'addRealityModelRelations error', error)
                return false
            }
        },

        /**
         * 根据条件查询资产/设备与模型点位之间的映射关系
         * /api/v1/search-reality-model-relations
         * 应用于:天津、台州、横琴、李家岩、系统配置
         */
        async searchRealityModelRelations(
            $api: PointMapApi,
            entityId: string | undefined,
            entityType: number | undefined,
            modelPointId: string | undefined,
            templateId: string,
        ) {
            try {
                const res = await $api.apiV1SearchRealityModelRelationsGet(
                    entityId,
                    entityType,
                    modelPointId,
                    templateId,
                )
                return res.data
            } catch (error) {
                showError(StoreName, 'searchRealityModelRelations error', error)
                return []
            }
        },

        /**
         * 添加关键点位
         * /api/v1/add-key-points
         * 应用于:天津
         */
        async addKeyPoints($api: PointMapApi, params: AddKeyPointInput[]) {
            try {
                const res = await $api.apiV1AddKeyPointsPost(params)
                return res.data
            } catch (error) {
                showError(StoreName, 'addKeyPoints error', error)
                return false
            }
        },

        /**
         * 删除关键点位
         * /api/v1/delete-key-points
         * 应用于:天津
         */
        async deleteKeyPoints($api: PointMapApi, params: string[]) {
            try {
                const res = await $api.apiV1DeleteKeyPointsPost(params)
                return res.data
            } catch (error) {
                showError(StoreName, 'deleteKeyPoints error', error)
                return false
            }
        },

        /**
         * 获取关键点位的详细信息
         * /api/v1/get-key-point-details
         * 应用于:天津
         */
        async getKeyPointDetails($api: PointMapApi, id: string) {
            try {
                const res = await $api.apiV1GetKeyPointDetailsGet(id)
                return res.data
            } catch (error) {
                showError(StoreName, 'getKeyPointDetails error', error)
                return {}
            }
        },

        /**
         * 修改关键点位信息
         * /api/v1/update-key-point
         * 应用于:系统配置_配置
         */
        async updateKeyPoint($api: PointMapApi, params: UpdateKeyPointInput[]) {
            try {
                const res = await $api.apiV1UpdateKeyPointPost(params)
                return res.data
            } catch (error) {
                showError(StoreName, 'updateKeyPoint error', error)
                return false
            }
        },

        /**
         * 根据ID或者名称，搜索关键点位
         * /api/v1/query/key-points
         * 应用于:天津
         */
        async queryKeyPoints($api: PointMapApi, id?: string, showName?: string) {
            try {
                const res = await $api.apiV1QueryKeyPointsGet(id, showName)
                return res.data
            } catch (error) {
                showError(StoreName, 'queryKeyPoints error', error)
                return []
            }
        },
    },
})

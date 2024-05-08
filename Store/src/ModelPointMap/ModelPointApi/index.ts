import { defineStore } from 'pinia'
import { ModelPointApiState } from './type'
import { showError } from '../../helper/showError'
import {
    ModelPointApi,
    QueryModelPointByConditionInput,
    QueryModelPointByIdsInput,
    QueryModelPointByTypeInput,
    QueryPageModelPointByTypeInput,
} from '@dhicn/domain-paas-sdk-ts/digital-twin-service'
const StoreName = 'ModelPointApi'
export const useModelPointApiStore = defineStore(StoreName, {
    state: (): ModelPointApiState => ({}),
    actions: {
        /**
         * 根据属性获取模型点位的详细信息
         * /api/v1/model-point/search-by-condition
         * 应用于:天津
         */
        async searchByCondition($api: ModelPointApi, params: QueryModelPointByConditionInput) {
            try {
                const res = await $api.apiV1ModelPointSearchByConditionPost(params)
                return res.data
            } catch (error) {
                showError(StoreName, 'searchByCondition error', error)
                return []
            }
        },

        /**
         * 根据ID列表获取对应模型点位的信息
         * /api/v1/model-point/list-by-ids
         * 应用于:天津、台州、横琴、李家岩
         */
        async listByIds($api: ModelPointApi, templateScenarioId: string, modelId: string) {
            try {
                const res = await $api.apiV1ModelPointAttributesGet(templateScenarioId, modelId)
                return res.data
            } catch (error) {
                showError(StoreName, 'listByIds error', error)
                return {}
            }
        },

        /**
         * 根据模型点位id获取模型点位的详细信息
         * /api/v1/model-point/search-by-model-id
         * 应用于:天津、台州、横琴、李家岩
         */
        async searchByModelId($api: ModelPointApi, params: QueryModelPointByIdsInput) {
            try {
                const res = await $api.apiV1ModelPointSearchByModelIdPost(params)
                return res.data
            } catch (error) {
                showError(StoreName, 'searchByModelId error', error)
                return []
            }
        },

        /**
         * 根据点位类型获取模型点位的详细信息
         * /api/v1/model-point/search-by-type
         * 应用于:天津
         */
        async searchByType($api: ModelPointApi, params: QueryModelPointByTypeInput) {
            try {
                const res = await $api.apiV1ModelPointSearchByTypePost(params)
                return res.data
            } catch (error) {
                showError(StoreName, 'searchByType error', error)
                return []
            }
        },

        /**
         * 根据点位类型获取模型点位的详细信息
         * /api/v1/model-point/page-search-by-type
         * 应用于:天津
         */
        async pageSearchByType($api: ModelPointApi, params: QueryPageModelPointByTypeInput) {
            try {
                const res = await $api.apiV1ModelPointPageSearchByTypePost(params)
                return res.data
            } catch (error) {
                showError(StoreName, 'pageSearchByType error', error)
                return {}
            }
        },
    },
})

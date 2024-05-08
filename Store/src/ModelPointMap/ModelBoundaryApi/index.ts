import {
    DeleteBoundaryByTemplateInput,
    ModelBoundaryApi,
    ModelBoundaryConfigFormatInput,
} from '@dhicn/domain-paas-sdk-ts/digital-twin-service'
import { defineStore } from 'pinia'
import { showError } from '../../helper/showError'
import { ModelBoundaryState } from './type'

const StoreName = 'ModelBoundaryApi'

export const useModelBoundaryApiStore = defineStore(StoreName, {
    state: (): ModelBoundaryState => ({
        test: '',
    }),
    actions: {
        /**
         * 根据模板方案id获取边界条件配置信息
         * /api/v2/get-boundary-configs
         * @param $api
         * @param templateScenarioId 模板方案的ID
         * 应用项目:系统配置、竹园、长治
         */
        async fetchBoundaryConfig($api: ModelBoundaryApi, templateScenarioId: string) {
            try {
                const res = await $api.apiV2GetBoundaryConfigsGet(templateScenarioId)
                return res.data
            } catch (error) {
                showError(StoreName, 'fetch Boundary Config', error)
                return []
            }
        },

        /**
         * 获取所有边界条件配置信息
         * /api/v2/getall
         * 应用于:李家岩
         */
        async fetchAllBoundaryConfig($api: ModelBoundaryApi) {
            try {
                const res = await $api.apiV2GetallGet()
                return res.data
            } catch (error) {
                showError(StoreName, 'fetch All Boundary Config', error)
                return []
            }
        },

        /**
         * 根据ID列表删除边界条件配置信息
         * /api/v2/delete-boundary-configs
         * 应用于:李家岩
         */
        async deleteBoundaryConfig($api: ModelBoundaryApi, ids: string[]) {
            try {
                const res = await $api.apiV2DeleteBoundaryConfigsPost(ids)
                return res.data
            } catch (error) {
                showError(StoreName, 'delete Boundary Config', error)
                return []
            }
        },

        /**
         * 根据模板方案ID删除边界条件配置信息
         * /api/v2/delete-by-templateid
         * 应用于:李家岩
         */
        async deleteBoundaryConfigByTemplateId(
            $api: ModelBoundaryApi,
            params: DeleteBoundaryByTemplateInput,
        ) {
            try {
                const res = await $api.apiV2DeleteByTemplateidPost(params)
                return res.data
            } catch (error) {
                showError(StoreName, 'delete Boundary Config By TemplateId', error)
                return 0
            }
        },

        /**
         * 修改模型边界条件配置信息
         * /api/v2/update-model-boundary-config
         * 应用于:李家岩
         */
        async updateModelBoundaryConfig(
            $api: ModelBoundaryApi,
            params: ModelBoundaryConfigFormatInput[],
        ) {
            try {
                const res = await $api.apiV2UpdateModelBoundaryConfigPost(params)
                return res.data
            } catch (error) {
                showError(StoreName, 'update Model Boundary Config', error)
                return false
            }
        },
    },
})

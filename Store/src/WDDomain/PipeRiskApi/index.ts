import { defineStore } from 'pinia'
import { PipeRiskApiState } from './type'
import { showError, logger } from '../../helper/showError'
import * as WDApi from '@dhicn/domain-paas-sdk-ts/wd-domain'
const StoreName = 'PipeRiskApi'
export const usePipeRiskApiStore = defineStore(StoreName, {
    state: (): PipeRiskApiState => ({}),
    actions: {
        /**
         * 获取所有爆管风险权重信息
         * /api/v1/domain-wd/pipe-risk/weight/all
         * 应用于:天津项目:系统设置-风险评估参数设置
         */
        async getPipeRiskFactorWeight($api: WDApi.PipeRiskApi) {
            try {
                const res = await $api.apiV1DomainWdPipeRiskWeightAllGet()
                return res.data
            } catch (error) {
                showError('API', 'getPipeRiskFactorWeight', error)
                return false
            }
        },

        /**
         * 风险评估参数设置 - 更新管道风险因子权重
         * /api/v1/domain-wd/pipe-risk/weight/update
         * 应用于:天津项目:系统设置-风险评估参数设置
         */
        async updatePipeRiskFactorWeight(
            $api: WDApi.PipeRiskApi,
            params: WDApi.UpdatePipeRiskWeightInput[],
        ) {
            try {
                const res = await $api.apiV1DomainWdPipeRiskWeightUpdatePost(params)
                return res.data
            } catch (error) {
                showError('API', 'updatePipeRiskFactorWeight', error)
                return false
            }
        },

        /**
         * 风险评估参数设置 - 根据权重Id获取爆管风险参数信息
         * /api/v1/domain-wd/pipe-risk/para/get-by-weight-id
         * 应用于:天津项目:系统设置-风险评估参数设置
         */
        async getPipeRiskInfoById($api: WDApi.PipeRiskApi, id: string) {
            try {
                const res = await $api.apiV1DomainWdPipeRiskParaGetByWeightIdGet(id)
                return res.data
            } catch (error) {
                showError('API', 'getPipeRiskFactorById', error)
                return false
            }
        },

        /**
         * 风险评估参数设置 - 更新爆管风险参数信息
         * /api/v1/domain-wd/pipe-risk/para/update
         * 应用于:天津项目:系统设置-风险评估参数设置
         */
        async updatePipeRiskInfoById(
            $api: WDApi.PipeRiskApi,
            params: WDApi.UpdatePipeRiskParamInput[],
        ) {
            try {
                const res = await $api.apiV1DomainWdPipeRiskParaUpdatePost(params)
                return res.data
            } catch (error) {
                showError('API', 'updatePipeRiskFactorById', error)
                return false
            }
        },

        /**
         * 获取全管网管道风险结果
         * /api/v1/domain-wd/pipe-risk/result/get-all-pipe-risk
         * 应用于:天津项目:风险评估
         */
        async getPipeRiskResult($api: WDApi.PipeRiskApi, id: string) {
            try {
                const res = await $api.apiV1DomainWdPipeRiskResultGetAllPipeRiskGet(id)
                logger.debug('获取全管网管道风险结果', res.data)
                return res.data
            } catch (error) {
                showError('API', 'getPipeRiskResult', error)
                return false
            }
        },

        /**
         * 风险评估计算
         * /api/v1/domain-wd/pipe-risk/calculate
         * 应用于:天津项目:风险评估
         */
        async riskAssessmentCalculation($api: WDApi.PipeRiskApi, id: string) {
            try {
                const res = await $api.apiV1DomainWdPipeRiskCalculateGet(id)
                logger.debug('风险评估计算', res.data)
                return res.data
            } catch (error) {
                showError('API', 'riskAssessmentCalculation', error)
                return false
            }
        },

        /**
         * 批量新增爆管风险权重
         * /api/v1/domain-wd/pipe-risk/weight/add
         * 应用于:天津项目:系统设置-权重设置
         */
        async addPipeRiskWeight($api: WDApi.PipeRiskApi, params: WDApi.AddPipeRiskWeightInput[]) {
            try {
                const res = await $api.apiV1DomainWdPipeRiskWeightAddPost(params)
                return res.data
            } catch (error) {
                showError('API', 'addPipeRiskWeight', error)
                return false
            }
        },

        /**
         * 删除权重信息
         * /api/v1/domain-wd/pipe-risk/weight/delete
         * 应用于:天津项目:系统设置-权重设置
         */
        async deletePipeRiskWeight($api: WDApi.PipeRiskApi, id: string[]) {
            try {
                const res = await $api.apiV1DomainWdPipeRiskWeightDeletePost(id)
                return res.data
            } catch (error) {
                showError('API', 'deletePipeRiskWeight', error)
                return false
            }
        },

        /**
         * 批量新增爆管风险参数信息
         * /api/v1/domain-wd/pipe-risk/para/add
         * 应用于:天津项目:系统设置-权重设置
         */
        async addPipeRiskParam(
            $api: WDApi.PipeRiskApi,
            params: WDApi.AddBrokenPipeRiskParaCfgInput[],
        ) {
            try {
                const res = await $api.apiV1DomainWdPipeRiskParaAddPost(params)
                return res.data
            } catch (error) {
                showError('API', 'addPipeRiskParam', error)
                return false
            }
        },

        /**
         * 删除参数配置信息
         * /api/v1/domain-wd/pipe-risk/para/delete
         *  应用于:天津项目:管道风险
         */
        async deletePipeRiskParam($api: WDApi.PipeRiskApi, id: string[]) {
            try {
                const res = await $api.apiV1DomainWdPipeRiskParaDeletePost(id)
                return res.data
            } catch (error) {
                showError('API', 'deletePipeRiskParam', error)
                return false
            }
        },
    },
})

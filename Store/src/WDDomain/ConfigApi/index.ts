import { defineStore } from 'pinia'
import { ConfigState } from './type'
import { showError } from '../../helper/showError'
import * as WDApi from '@dhicn/domain-paas-sdk-ts/wd-domain'
const StoreName = 'ConfigApi'
export const useConfigApiStore = defineStore(StoreName, {
    state: (): ConfigState => ({}),
    actions: {
        /**
         * 根据资产类型获取设备指标配置信息
         * /api/v1/domain-wd/config/indicator/list
         * 应用于:天津项目_系统设置_测点设置、台州
         */
        async getIndicatorConfigList($api: WDApi.IndicatorConfigApi, params: string[]) {
            try {
                const res = await $api.apiV1DomainWdConfigIndicatorListPost(params)
                return res.data
            } catch (error) {
                showError('API', 'getPipeMeasuringPoint', error)
                return []
            }
        },

        /**
         * 保存资产类型获取设备指标配置信息（包含自定义属性）
         * /api/v1/domain-wd/config/indicator/save
         * 应用于:天津项目_系统设置_测点设置
         */
        async saveIndicatorConfig(
            $api: WDApi.IndicatorConfigApi,
            params: WDApi.SaveIndicatorConfigInput[],
        ) {
            try {
                const res = await $api.apiV1DomainWdConfigIndicatorSavePost(params)
                return res.data
            } catch (error) {
                showError('API', 'savePipeMeasuringPoint', error)
                return false
            }
        },

        /**
         * 获取所有精度配置
         * /api/v1/domain-wd/config/accuracy/all
         * 应用于:天津项目_系统设置_精度设置
         */
        async getAccuracyConfig($api: WDApi.AccuracyConfigApi) {
            try {
                const res = await $api.apiV1DomainWdConfigAccuracyAllGet()
                return res.data
            } catch (error) {
                showError('API', 'getPrecisionConfigData', error)
                return []
            }
        },

        /**
         * 批量更新精度配置信息
         * /api/v1/domain-wd/config/accuracy/update
         * 应用于:天津项目_系统设置_精度设置
         */
        async updateAccuracyConfig(
            $api: WDApi.AccuracyConfigApi,
            params: WDApi.AccuracyConfigDto[],
        ) {
            try {
                const res = await $api.apiV1DomainWdConfigAccuracyUpdatePost(params)
                return res.data as unknown as boolean
            } catch (error) {
                showError('API', 'savePrecisionConfigData', error)
                return false
            }
        },

        /**
         * 批量新增精度配置信息
         * /api/v1/domain-wd/config/accuracy/add
         * 应用于:暂无应用
         */
        async addAccuracyConfig(
            $api: WDApi.AccuracyConfigApi,
            params: WDApi.AddAccuracyConfigInput[],
        ) {
            try {
                const res = await $api.apiV1DomainWdConfigAccuracyAddPost(params)
                return res.data
            } catch (error) {
                showError('API', 'addAccuracyConfig', error)
                return false
            }
        },

        /**
         * 删除精度配置信息
         * /api/v1/domain-wd/config/accuracy/delete
         * 应用于:暂无应用
         */
        async deleteAccuracyConfig($api: WDApi.AccuracyConfigApi, params: string[]) {
            try {
                const res = await $api.apiV1DomainWdConfigAccuracyDeletePost({ ids: params })
                return res.data
            } catch (error) {
                showError('API', 'deleteAccuracyConfig', error)
                return false
            }
        },
    },
})

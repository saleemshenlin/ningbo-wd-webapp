import { showError } from '../../helper/showError'
import { ThresholdApiState } from './type'
import { defineStore } from 'pinia'
import {
    ThresholdApi,
    UpdateFloodingThresholdInput,
} from '@dhicn/domain-paas-sdk-ts/model-configuration'

const StoreName = 'ThresholdApi'
export const useThresholdApiStore = defineStore(StoreName, {
    state: (): ThresholdApiState => ({
        thresholds: [],
    }),
    getters: {
        /**
         * 获取水深的等级
         * @param state
         */
        getSensitiveWaterDepth: (state) => {
            return (level: number) => {
                const threshold = state.thresholds.find((t) => t.grade === level)
                if (threshold !== undefined) {
                    return threshold.description ?? '--'
                } else {
                    return '--'
                }
            }
        },
    },
    actions: {
        /**
         * 获取风险等级
         * @param $api
         */
        async fetchThresholdByTemplate($api: ThresholdApi) {
            try {
                const res = await $api.apiV1ModelConfigurationThresholdListGet()
                this.thresholds = (res.data! ?? []).sort((a, b) => b.grade! - a.grade!)
                return this.thresholds
            } catch (error) {
                showError(StoreName, 'fetchThresholdByTemplate', error)
                return []
            }
        },
        /**
         * 更新内涝风险等级阈值配置信息 - 单个更新
         * /api/v1/model-configuration/threshold/update
         * @param $api
         * @params UpdateFloodingThresholdInput
         */
        async updateThreshold($api: ThresholdApi, params: UpdateFloodingThresholdInput) {
            try {
                const res = await $api.apiV1ModelConfigurationThresholdUpdatePost(params)
                return res.data
            } catch (error) {
                showError(StoreName, 'updateThreshold', error)
                return null
            }
        },

        /**
         * 更新内涝风险等级阈值配置信息 - 批量更新
         * /api/v1/model-configuration/threshold/batch-update
         * @param $api
         * @params UpdateFloodingThresholdInput[]
         */
        async batchUpdateThreshold($api: ThresholdApi, params: UpdateFloodingThresholdInput[]) {
            try {
                const res = await $api.apiV1ModelConfigurationThresholdBatchUpdatePost(params)
                return res.data
            } catch (error) {
                showError(StoreName, 'batchUpdateThreshold', error)
                return null
            }
        },
    },
})

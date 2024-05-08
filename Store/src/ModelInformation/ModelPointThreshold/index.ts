import { defineStore } from 'pinia'
import { showError } from '../../helper/showError'
import { ModelPointThresholdApiState } from './type'
import { ModelPointThreshlodApi } from '@dhicn/domain-paas-sdk-ts/model-information'

const StoreName = 'ModelPointThreshold'

export const useModelPointThresholdStore = defineStore(StoreName, {
    state: (): ModelPointThresholdApiState => ({
        thresholds: {},
    }),
    actions: {
        /**
         * 获取模型点阈值
         * Get model point threshold
         * /api/v1/model-information/thresholds/all
         * 应用项目:万峰
         * @param $api
         * @param scenarioId
         */
        async fetchThresholdsAll($api: ModelPointThreshlodApi, scenarioId: string) {
            try {
                const res = await $api.apiV1ModelInformationThresholdsAllGet(scenarioId)
                this.thresholds = res.data ?? {}
                return res.data
            } catch (error) {
                showError(StoreName, 'fetchThresholdsAll error', error)
                return {}
            }
        },
    },
})

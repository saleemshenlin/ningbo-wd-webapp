import { defineStore } from 'pinia'
import { WqResultAnalysisApiState } from './type'
import { showError, logger } from '../../helper/showError'
import {
    ModelResultRiverWqInput,
    ModelResultWqTimeseriesInput,
    WqResultAnalysisApi,
} from '@dhicn/domain-paas-sdk-ts/result-service'
const StoreName = 'WqResultAnalysisApi'

export const useWqResultAnalysisApiStore = defineStore(StoreName, {
    state: (): WqResultAnalysisApiState => ({}),
    actions: {
        /**
         * 河道水质动态结果
         * /api/v1/result-analysis/wq/river/dynamic
         * 应用于:长治
         */
        async getRiverDynamicResult($api: WqResultAnalysisApi, params: ModelResultRiverWqInput) {
            try {
                const res = await $api.apiV1ResultAnalysisWqRiverDynamicPost(params)
                logger.debug('getRiverDynamicResult   :>> ', res.data)
                return res.data
            } catch (error) {
                showError(StoreName, 'getRiverDynamicResult', error)
            }
        },
        /**
         * 获取河道单点时间序列结果
         * /api/v1/result-analysis/wq/river/timeseries
         * 应用于:长治(断面模拟)
         */
        async getResultAnalysisWqRiverDynamic(
            $api: WqResultAnalysisApi,
            params: ModelResultWqTimeseriesInput,
        ) {
            try {
                const res = await $api.apiV1ResultAnalysisWqRiverTimeseriesPost(params)
                return res.data
            } catch (error) {
                showError(StoreName, 'getResultAnalysisWqRiverDynamic', error)
            }
        },
    },
})

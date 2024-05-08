import { showError } from '@/helper/showError'
import { defineStore } from 'pinia'
import { MuidTimeSeriesApi, TimeSeriesByMuidsInput } from '@dhicn/domain-paas-sdk-ts/result-service'
import { MuidTimeSeriesApiState } from './type'

const StoreName = 'MuidTimeSeriesApi'

export const useMuidTimeSeriesApiStore = defineStore(StoreName, {
    state: (): MuidTimeSeriesApiState => ({}),
    actions: {
        /**
         * 查询若干个模型点位的滚动计算结果，结果存储于分布式文件系统
         * /api/v1/result/time-series/by-muids-type
         * @param $api
         * @param libraryId
         * @param muids
         * @param type
         * @param startTime
         * @param endTime
         */
        async fetchTimeSeriesByMuidsType($api: MuidTimeSeriesApi, params: TimeSeriesByMuidsInput) {
            try {
                const res = await $api.apiV1ResultTimeSeriesByMuidsTypePost(params)
                return res.data ?? []
            } catch (error) {
                showError(StoreName, 'fetchTimeSeriesByMuidsType error', error)
                return []
            }
        },
    },
})

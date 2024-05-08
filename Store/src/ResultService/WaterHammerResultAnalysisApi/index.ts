import { defineStore } from 'pinia'
import { WaterHammerResultAnalysisApiState } from './type'
import { showError, logger } from '../../helper/showError'
import { WaterHammerResultAnalysisApi } from '@dhicn/domain-paas-sdk-ts/result-service'
const StoreName = 'WaterHammerResultAnalysisApi'
export const useWaterHammerResultAnalysisApiStore = defineStore(StoreName, {
    state: (): WaterHammerResultAnalysisApiState => ({
        // 获得时序数据
        timeSeriesList: {
            time: [],
            iDs: [],
            data: [],
        },
    }),
    actions: {
        /**
         * 根据方案id获取全管网水锤流量模拟结果值
         * /api/v1/result-analysis/water-hammer/flow-dynamic
         * 应用于:李家岩
         */
        async fetchTimeSeriesFlowDynamicData(
            $api: WaterHammerResultAnalysisApi,
            scenarioId: string,
            startTime: string,
            endTime: string,
            frequency: number,
        ) {
            try {
                const res = await $api.apiV1ResultAnalysisWaterHammerFlowDynamicGet(
                    scenarioId,
                    frequency,
                    startTime,
                    endTime,
                )
                this.timeSeriesList = {
                    time: res.data.time ?? [],
                    iDs: res.data.iDs ?? [],
                    data: res.data.data ?? [],
                }
                logger.debug('fetchTimeSeriesAverageWqData   :>> ', this.timeSeriesList)
            } catch (error) {
                showError(StoreName, 'fetchTimeSeriesAverageWqData error', error)
                return {}
            }
        },

        /**
         * 根据方案id获取全管网水锤压力模拟结果值
         * /api/v1/result-analysis/water-hammer/pressure-dynamic
         * 应用于:李家岩
         */
        async fetchTimeSeriesPressureDynamicData(
            $api: WaterHammerResultAnalysisApi,
            scenarioId: string,
            startTime: string,
            endTime: string,
            frequency: number,
        ) {
            try {
                const res = await $api.apiV1ResultAnalysisWaterHammerPressureDynamicGet(
                    scenarioId,
                    frequency,
                    startTime,
                    endTime,
                )
                this.timeSeriesList = {
                    time: res.data.time ?? [],
                    iDs: res.data.iDs ?? [],
                    data: res.data.data ?? [],
                }
                logger.debug('fetchTimeSeriesAverageWqData   :>> ', this.timeSeriesList)
            } catch (error) {
                showError(StoreName, 'fetchTimeSeriesAverageWqData error', error)
                return {}
            }
        },

        /**
         * 根据方案id获取全管网水锤流速模拟结果值
         * /api/v1/result-analysis/water-hammer/velocity-dynamic
         * 应用于:李家岩
         */
        async fetchTimeSeriesVelocityDynamicData(
            $api: WaterHammerResultAnalysisApi,
            scenarioId: string,
            startTime: string,
            endTime: string,
            frequency: number,
        ) {
            try {
                const res = await $api.apiV1ResultAnalysisWaterHammerVelocityDynamicGet(
                    scenarioId,
                    frequency,
                    startTime,
                    endTime,
                )
                this.timeSeriesList = {
                    time: res.data.time ?? [],
                    iDs: res.data.iDs ?? [],
                    data: res.data.data ?? [],
                }
                logger.debug('fetchTimeSeriesAverageWqData   :>> ', this.timeSeriesList)
            } catch (error) {
                showError(StoreName, 'fetchTimeSeriesAverageWqData error', error)
                return {}
            }
        },
    },
})

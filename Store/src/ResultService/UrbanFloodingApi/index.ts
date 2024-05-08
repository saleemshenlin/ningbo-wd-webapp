import { UrbanFloodingApiState } from './type'
import { defineStore } from 'pinia'
import { UrbanFloodingApi, ProcessResultApi } from '@dhicn/domain-paas-sdk-ts/result-service'
import { showError } from '../../helper/showError'

const StoreName = 'UrbanFloodingApi'
export const useUrbanFloodingApiStore = defineStore(StoreName, {
    state: (): UrbanFloodingApiState => ({}),
    actions: {
        /**
         * 获取易涝点统计信息
         * 原接口: /api/v1/result/urban-flooding/sensitive-points-statistics
         * 现接口：/api/v1/result/process/by-data-type
         * sensitive_point_waterdepth_avg
         * sensitive_point_waterdepth_max
         * sensitive_point_waterdepth_min
         * @param $api
         */
        async fetchFloodingSensitivePointsStatistics($api: ProcessResultApi, scenarioId: string) {
            try {
                const resMax = await $api.apiV1ResultProcessTimeseriesByDataTypePost({
                    scenarioId,
                    dataType: 'sensitive_point_waterdepth_max',
                })
                const resMin = await $api.apiV1ResultProcessTimeseriesByDataTypePost({
                    scenarioId,
                    dataType: 'sensitive_point_waterdepth_min',
                })
                const resAvg = await $api.apiV1ResultProcessTimeseriesByDataTypePost({
                    scenarioId,
                    dataType: 'sensitive_point_waterdepth_avg',
                })
                return {
                    min: resMin.data ?? [],
                    max: resMax.data ?? [],
                    avg: resAvg.data ?? [],
                }
            } catch (error) {
                showError(StoreName, 'fetchFloodingSensitivePointsStatistics', error)
                return {
                    min: [],
                    max: [],
                    avg: [],
                }
            }
        },
        /**
         * 获取易涝点风险等级信息
         * 原接口: /api/v1/result/urban-flooding/sensitive-points-risk
         * 现接口：/api/v1/result/process/by-data-type
         * sensitive_point_grade,sensitive_point_flood_area
         * @param $api
         */
        async fetchFloodingSensitivePointsRisk($api: ProcessResultApi, scenarioId: string) {
            try {
                const resGrade = await $api.apiV1ResultProcessByDataTypePost({
                    scenarioId,
                    dataType: 'sensitive_point_grade',
                })
                const resArea = await $api.apiV1ResultProcessByDataTypePost({
                    scenarioId,
                    dataType: 'sensitive_point_flood_area',
                })
                return {
                    grade: resGrade.data ?? [],
                    area: resArea.data ?? [],
                }
            } catch (error) {
                showError(StoreName, 'fetchFloodingSensitivePointsStatistics', error)
                return {
                    grade: [],
                    area: [],
                }
            }
        },
        /**
         * 获取易捞点内的网格的积水信息
         * /api/v1/result/urban-flooding/sensitive-points/grid/water-depth/timeseries
         */
        async fetchFloodingSensitivePointsGridWaterDepthTimeseries(
            $api: UrbanFloodingApi,
            scenarioId: string,
            grid: string,
        ) {
            try {
                const res =
                    await $api.apiV1ResultUrbanFloodingSensitivePointsGridWaterDepthTimeseriesGet(
                        scenarioId,
                        grid,
                    )
                return res.data ?? {}
            } catch (error) {
                showError(StoreName, 'fetchFloodingSensitivePointsGridWaterDepthTimeseries', error)
                return {}
            }
        },
    },
})

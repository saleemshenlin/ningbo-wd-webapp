import { RiverApi, ProcessResultApi } from '@dhicn/domain-paas-sdk-ts/result-service'
import { defineStore } from 'pinia'
import { showError } from '../../helper/showError'

const StoreName = 'RiverApi'

export const useRiverApiStore = defineStore(StoreName, {
    state: (): {} => ({}),
    getters: {},
    actions: {
        /**
         * 获取河道流量水位时间序列
         * @param $api
         * @param scenarioId
         * @param pipeDataType
         * @param startTime
         * @param endTime
         * @param frequency
         */
        async fetchRiverTSResult(
            $api: RiverApi,
            scenarioId: string,
            riverDataType: 'WaterLevel' | 'Discharge',
            riverId: string,
            chainage: number,
        ) {
            try {
                const res = await $api.apiV1ResultRiverTimeseriesGet(
                    scenarioId,
                    riverDataType,
                    riverId,
                    chainage,
                )
                return res.data ?? []
            } catch (error) {
                showError(StoreName, 'fetchRiverTSResult error', error)
            }
        },
        /**
         * 获取闸统计
         * 现通过 /api/v1/result/process/by-data-type gate_total_opentime 闸门累计开启时长
         * 原接口 /api/v1/result/river/gate-statistics
         * 应用于:万峰
         * @param $api
         * @param scenarioId
         */
        async fetchGateStatistic($api: ProcessResultApi, scenarioId: string) {
            try {
                const res = await $api.apiV1ResultProcessByDataTypePost({
                    scenarioId,
                    dataType: 'gate_opentime_total',
                })
                return res.data ?? []
            } catch (error) {
                showError(StoreName, 'fetchGateStatistic error', error)
                return []
            }
        },
    },
})

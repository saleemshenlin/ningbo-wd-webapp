import { ProcessResultApi } from '@dhicn/domain-paas-sdk-ts/result-service'
import { defineStore } from 'pinia'
import { showError } from '../../helper/showError'

const StoreName = 'ProcessResultApi'

export const useProcessResultApiStore = defineStore(StoreName, {
    state: (): {} => ({}),
    getters: {},
    actions: {
        /**
         * 通过数据类型查询结果数据
         * /api/v1/result/process/by-data-type
         * @param $api
         * @param scenarioId
         * @param dataType
         * @returns
         */
        async fetchStatisticsProcessResultByDataType(
            $api: ProcessResultApi,
            scenarioId: string,
            dataType: string,
            modelFeatureIds?: string[],
        ) {
            try {
                const res = await $api.apiV1ResultProcessByDataTypePost({
                    scenarioId,
                    dataType,
                    modelFeatureIds: modelFeatureIds === undefined ? null : modelFeatureIds,
                })
                return res.data ?? []
            } catch (error) {
                showError(StoreName, 'fetchStatisticsProcessResult error', error)
                return []
            }
        },
        /**
         * 通过数据类型来查询二次处理的时序结果数据
         * /api/v1/result/process/timeseries/by-data-type
         * @param $api
         * @param scenarioId
         * @param dataType
         * @returns
         */
        async fetchTSProcessResultByModelId(
            $api: ProcessResultApi,
            scenarioId: string,
            modelFeatureId: string,
            dataTypes?: string[],
        ) {
            try {
                const res = await $api.apiV1ResultProcessTimeseriesByModelFeatureIdPost({
                    scenarioId,
                    modelFeatureId,
                    dataTypes: dataTypes === undefined ? null : dataTypes,
                })
                return res.data ?? []
            } catch (error) {
                showError(StoreName, 'fetchTSProcessResult error', error)
                return []
            }
        },
    },
})

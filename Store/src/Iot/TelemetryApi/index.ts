import { defineStore } from 'pinia'
import { TelemetryApiState } from './type'
import { showError } from '../../helper/showError'
import type {
    SaveTelemetryDataInput,
    TelemetryApi,
    TimeseriesInput,
    LatestTimeSeriesInput,
    TimeseriesBatchForV3Input,
} from '@dhicn/domain-paas-sdk-ts/iot-service'
const StoreName = 'TelemetryApi'
export const useTelemetryApiStore = defineStore(StoreName, {
    state: (): TelemetryApiState => ({}),
    actions: {
        /**
         * 查询iot时序数据
         * /api/v1/iot/timeseries
         * 应用于:李家岩项目
         */
        async getIotTimeseries(
            $api: TelemetryApi,
            deviceId: string,
            keys: string[],
            startTs: string,
            endTs: string,
        ) {
            try {
                const res = await $api.apiV1IotTimeseriesGet(deviceId, keys, startTs, endTs)
                return res.data
            } catch (error) {
                showError(StoreName, 'getIotTimeseries error', error)
                return []
            }
        },

        /**
         * 批量查询iot时序数据
         * /api/v2/iot/timeseries-batch
         * 应用于:天津、台州、横琴
         */
        async getIotTimeseriesBatch($api: TelemetryApi, params: TimeseriesInput[]) {
            try {
                const res = await $api.apiV2IotTimeseriesBatchPost(params)
                return res.data
            } catch (error) {
                showError(StoreName, 'getIotTimeseriesBatch error', error)
                return []
            }
        },

        /**
         * 根据指标获取实测时序数据，要求指标编码在系统中是唯一的
         * /api/v3/iot/timeseries-batch
         * 应用于:长治
         */
        async geV3IotTimeseriesBatchPost($api: TelemetryApi, params: TimeseriesBatchForV3Input[]) {
            try {
                const res = await $api.apiV3IotTimeseriesBatchPost(params)
                return res.data
            } catch (error) {
                showError(StoreName, 'geV3IotTimeseriesBatchPost error', error)
                return []
            }
        },

        /**
         * 批量同步iot时序数据
         * /api/v1/iot/save-telemetry-data-batch
         * 应用于:天津、台州、横琴
         */
        async saveTelemetryDataBatch($api: TelemetryApi, params: SaveTelemetryDataInput[]) {
            try {
                const res = await $api.apiV1IotSaveTelemetryDataBatchPost(params)
                return res.data as unknown as boolean
            } catch (error) {
                showError(StoreName, 'saveTelemetryDataBatch error', error)
                return false
            }
        },

        /**
         * 批量最新一个时刻iot时序数据
         * /api/v1/iot/api/v1/iot/latest-timeseries
         * 应用于:竹园
         * @param $api
         * @param params
         */
        async fetchLatestTelemetryDataBatch($api: TelemetryApi, params: LatestTimeSeriesInput) {
            try {
                const res = await $api.apiV1IotLatestTimeseriesPost(params)
                return res.data ?? []
            } catch (error) {
                showError(StoreName, 'fetchLatestTelemetryDataBatch error', error)
                return []
            }
        },
    },
})

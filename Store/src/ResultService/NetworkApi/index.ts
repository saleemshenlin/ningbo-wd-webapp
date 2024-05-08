import { Frequency } from '../config'
import {
    NetworkApi,
    NetworkStaticLengthInput,
    ProcessResultApi,
} from '@dhicn/domain-paas-sdk-ts/result-service'
import { NetworkApiState } from './type'
import { defineStore } from 'pinia'
import { showError } from '../../helper/showError'

const StoreName = 'NetworkApi'

export const useNetworkApiStore = defineStore(StoreName, {
    state: (): NetworkApiState => ({
        // 获得时序数据
        timeSeriesList: {
            time: [],
            iDs: [],
            data: [],
        },
    }),
    getters: {},
    actions: {
        /**
         * 获取管网动态播放的结果数据
         * @param $api
         * @param scenarioId
         * @param pipeDataType
         * @param startTime
         * @param endTime
         * @param frequency
         */
        async fetchPipeResult(
            $api: NetworkApi,
            scenarioId: string,
            pipeDataType: 'PipeFlow' | 'PipeVelocity' | 'PipeFilling' | 'PipeWaterLevel',
            startTime: string,
            endTime: string,
            frequency: number = Frequency,
        ) {
            try {
                const res = await $api.apiV1ResultNetworkDynamicGet(
                    scenarioId,
                    pipeDataType,
                    frequency,
                    startTime,
                    endTime,
                )
                this.timeSeriesList = {
                    time: res.data.time ?? [],
                    iDs: res.data.iDs ?? [],
                    data: res.data.data ?? [],
                }
            } catch (error) {
                showError(StoreName, 'fetchPipeResult error', error)
            }
        },
        /**
         * 获取管道单点时间序列结果
         * @param $api
         * @param scenarioId
         * @param pipeDataType
         * @param pipeID
         */
        async fetchPipeTSResult(
            $api: NetworkApi,
            scenarioId: string,
            pipeDataType: 'PipeFlow' | 'PipeVelocity' | 'PipeFilling' | 'PipeWaterLevel',
            pipeID: string,
        ) {
            try {
                const res = await $api.apiV1ResultNetworkTimeseriesGet(
                    scenarioId,
                    pipeDataType,
                    pipeID,
                )
                return res.data
            } catch (error) {
                showError(StoreName, 'fetchPipeMultiTSResult error', error)
            }
        },
        /**
         * 获取管道多点时间序列结果
         * @param $api
         * @param scenarioId
         * @param pipeDataType
         * @param pipeID
         */
        async fetchPipeMultiTSResult(
            $api: NetworkApi,
            scenarioId: string,
            pipeDataType: 'PipeFlow' | 'PipeVelocity' | 'PipeFilling' | 'PipeWaterLevel',
            pipeID: string,
        ) {
            try {
                const res = await $api.apiV1ResultNetworkMultipointTimeseriesGet(
                    scenarioId,
                    pipeDataType,
                    pipeID,
                )
                return res.data
            } catch (error) {
                showError(StoreName, 'fetchPipeMultiTSResult error', error)
            }
        },
        /**
         * 获取节点动态播放的结果数据
         * @param $api
         * @param scenarioId
         * @param PipeDataType
         * @param startTime
         * @param endTime
         * @param frequency
         */
        async fetchNodeResult(
            $api: NetworkApi,
            scenarioId: string,
            overflowNodeType: 'Manhole' | 'Outlet',
            startTime: string,
            endTime: string,
            frequency: number = Frequency,
        ) {
            try {
                const res = await $api.apiV1ResultNetworkNodeDynamicGet(
                    scenarioId,
                    overflowNodeType,
                    frequency,
                    startTime,
                    endTime,
                )
                this.timeSeriesList = {
                    time: res.data.time ?? [],
                    iDs: res.data.iDs ?? [],
                    data: res.data.data ?? [],
                }
            } catch (error) {
                showError(StoreName, 'fetchNodeResult error', error)
            }
        },
        /**
         * 获取节点单点时间序列结果
         * @param $api
         * @param scenarioId
         * @param PipeDataType
         * @param startTime
         * @param endTime
         * @param frequency
         */
        async fetchNodeTSResult(
            $api: NetworkApi,
            scenarioId: string,
            overflowNodeType: 'WaterLevel' | 'Overflow',
            nodeId: string,
        ) {
            try {
                const res = await $api.apiV1ResultNetworkNodeTimeseriesGet(
                    scenarioId,
                    overflowNodeType,
                    nodeId,
                )
                return res.data
            } catch (error) {
                showError(StoreName, 'fetchNodeResult error', error)
            }
        },
        /**
         * 获取管道堰高/堰流量时间序列结果
         * @param $api
         * @param scenarioId
         * @param PipeDataType
         * @param startTime
         * @param endTime
         * @param frequency
         */
        async fetchOrificeTSResult(
            $api: NetworkApi,
            scenarioId: string,
            orificeDataType: 'WaterLevel' | 'Discharge',
            nodeId: string,
        ) {
            try {
                const res = await $api.apiV1ResultNetworkOrificeTimeseriesGet(
                    scenarioId,
                    nodeId,
                    orificeDataType,
                )
                return res.data
            } catch (error) {
                showError(StoreName, 'fetchOrificeTSResult error', error)
            }
        },

        /**
         * 获取处理后的模型数据
         * /api/v1/result/network/processed-timeseries
         * 应用于:竹园-预案管理-预案详情-模型数据
         * @param $api
         * @param scenarioId
         * @param modelFeatureIds
         */
        async fetchProcessedTimeSeries(
            $api: NetworkApi,
            scenarioId: string,
            modelFeatureIds?: string[],
        ) {
            try {
                const res = await $api.apiV1ResultNetworkProcessedTimeseriesGet(
                    scenarioId,
                    modelFeatureIds,
                )
                return res.data ?? []
            } catch (error) {
                showError(StoreName, 'fetchProcessedTimeSeries error', error)
                return []
            }
        },

        /**
         * 获取一维管道的长度统计结果
         * /api/v1/result/network/static/length
         * 应用于:万峰
         * @param $api
         * @param NetworkStaticLengthInput
         */
        async fetchPipeLengthStatistic($api: NetworkApi, params: NetworkStaticLengthInput) {
            try {
                const res = await $api.apiV1ResultNetworkStaticLengthPost(params)
                return res.data ?? []
            } catch (error) {
                showError(StoreName, 'fetchPipeLengthStatistic error', error)
                return []
            }
        },
        /**
         * 获取泵站运行统计 累计排放量
         * 现通过 /api/v1/result/process/by-data-type pumpstation_discharge_total
         * 原接口 /api/v1/result/network/pump-statistics
         * 应用于:万峰
         * @param $api
         * @param scenarioId
         */
        async fetchPumpStatistic($api: ProcessResultApi, scenarioId: string) {
            try {
                const res = await $api.apiV1ResultProcessByDataTypePost({
                    scenarioId,
                    dataType: 'pumpstation_discharge_total',
                })
                return res.data ?? []
            } catch (error) {
                showError(StoreName, 'fetchPumpStatistic error', error)
                return []
            }
        },
        /**
         * 获取管道剖面图数据
         * /api/v1/result/network/profile-timeseries
         * 应用于:万峰
         * @param $api
         * @param scenarioId
         */
        async fetchNetworkProfileTSData($api: NetworkApi, scenarioId: string, nodeIds: string[]) {
            try {
                const res = await $api.apiV1ResultNetworkProfileTimeseriesGet(scenarioId, nodeIds)
                return res.data
            } catch (error) {
                showError(StoreName, 'fetchNetworkProfileTSData error', error)
            }
        },
    },
})

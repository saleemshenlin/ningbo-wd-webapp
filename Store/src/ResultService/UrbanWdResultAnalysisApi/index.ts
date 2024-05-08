import { WDModelResultEnum, WDModelStructure, WDModelCompute, Frequency } from '../config'
import {
    UrbanWdResultAnalysisApi,
    GetFilterModelResultInput,
    WdBatchTimeseriesInput,
    WdHistoryModelInput,
    GetTimeStatisticResultInput,
    GetStatisticResultInput,
} from '@dhicn/domain-paas-sdk-ts/result-service'
import { Scenario } from '@dhicn/domain-paas-sdk-ts/scenario-service'
import { UrbanWdResultAnalysisApiState } from './type'
import { defineStore } from 'pinia'
import { showError, logger } from '../../helper/showError'

const StoreName = 'UrbanWdResultAnalysisApi'

export const useUrbanWdResultAnalysisApiStore = defineStore(StoreName, {
    state: (): UrbanWdResultAnalysisApiState => ({
        // 获得时序数据
        timeSeriesList: {
            time: [],
            iDs: [],
            data: [],
        },
        profileTableData: [],
    }),
    getters: {},
    actions: {
        /**
         * 获得剖面图数据
         * /api/v1/result-analysis/urban-wd/profile-timeseries
         * @param $api
         * @param scenarioId
         * @param NodeIDs
         */
        async fetchGetProfileMapData(
            $api: UrbanWdResultAnalysisApi,
            scenarioId: string,
            nodeIDs: string[],
        ) {
            try {
                const res = await $api.apiV1ResultAnalysisUrbanWdProfileTimeseriesGet(
                    scenarioId,
                    nodeIDs,
                )
                return res.data
            } catch (error) {
                showError(StoreName, 'fetchGetProfileMapData error', error)
            }
        },
        /**
         * 获得查询单个管道、节点的模拟结果
         * /api/v1/result-analysis/urban-wd/timeseries
         * @param $api
         * @param scenarioId
         * @param NodeIDs
         */
        async fetchGetModelTSData(
            $api: UrbanWdResultAnalysisApi,
            scenarioId: string,
            modelId: string,
            dataType: WDModelResultEnum,
        ) {
            try {
                const res = await $api.apiV1ResultAnalysisUrbanWdTimeseriesGet(
                    modelId,
                    scenarioId,
                    dataType as any,
                )
                return res.data as {
                    t: string[]
                    v: number[]
                }
            } catch (error) {
                showError(StoreName, 'fetchGetModelTSData error', error)
                return {
                    t: [],
                    v: [],
                }
            }
        },
        /**
         * 获得查询单个结构物的模拟结果
         * /api/v1/result-analysis/urban-wd/structure-timeseries
         * 应用于:天津、台州、李家岩
         * @param $api
         * @param scenarioId
         * @param NodeIDs
         */
        async fetchGetModelTSDataOfStructure(
            $api: UrbanWdResultAnalysisApi,
            scenarioId: string,
            modelId: string,
            featureType: WDModelStructure,
            computeType: WDModelCompute,
            dataType: WDModelResultEnum,
        ) {
            try {
                const res = await $api.apiV1ResultAnalysisUrbanWdStructureTimeseriesGet(
                    modelId,
                    scenarioId,
                    computeType,
                    featureType,
                    dataType as any,
                )
                return res.data as {
                    t: string[]
                    v: number[]
                }
            } catch (error) {
                showError(StoreName, 'fetchGetModelTSData error', error)
                return {
                    t: [],
                    v: [],
                }
            }
        },

        /**
         * 获得动态模拟结果-压力 (Pressure)
         * 根据方案id获取全管网压力模拟结果值
         * /api/v1/result-analysis/urban-wd/pressure-dynamic
         * 应用于:天津、台州、横琴
         */
        async fetchTimeSeriesPressureData(
            $api: UrbanWdResultAnalysisApi,
            scenarioId: string,
            startTime: string,
            endTime: string,
            frequency: number = Frequency,
        ) {
            try {
                const res = await $api.apiV1ResultAnalysisUrbanWdPressureDynamicGet(
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
                logger.debug('fetchTimeSeriesPressureData   :>> ', this.timeSeriesList)
                return this.timeSeriesList
            } catch (error) {
                showError(StoreName, 'fetchTimeSeriesPressureData error', error)
            }
        },
        /**
         * 获得动态模拟结果-流速 (Velocity)
         * /api/v1/result-analysis/urban-wd/velocity-dynamic
         * 应用于:天津、台州、横琴
         */
        async fetchTimeSeriesVelocityData(
            $api: UrbanWdResultAnalysisApi,
            scenarioId: string,
            startTime: string,
            endTime: string,
            frequency: number = Frequency,
        ) {
            try {
                const res = await $api.apiV1ResultAnalysisUrbanWdVelocityDynamicGet(
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
                logger.debug('fetchTimeSeriesVelocityData   :>> ', this.timeSeriesList)
                return this.timeSeriesList
            } catch (error) {
                showError(StoreName, 'fetchTimeSeriesVelocityData error', error)
            }
        },

        /**
         * 根据方案id获取全管网平均水质模拟结果值
         * /api/v1/result-analysis/urban-wd/average-wq-dynamic
         * 应用于:天津、台州、横琴
         */
        async fetchTimeSeriesAverageWqData(
            $api: UrbanWdResultAnalysisApi,
            scenarioId: string,
            startTime: string,
            endTime: string,
            frequency: number = Frequency,
        ) {
            try {
                const res = await $api.apiV1ResultAnalysisUrbanWdAverageWqDynamicGet(
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
                return []
            }
        },

        /**
         * 根据方案id获取全管网平均水龄模拟结果值
         * /api/v1/result-analysis/urban-wd/average-water-age-dynamic
         * 应用于:天津、台州、横琴
         */
        async fetchTimeSeriesAverageWaterAgeData(
            $api: UrbanWdResultAnalysisApi,
            scenarioId: string,
            startTime: string,
            endTime: string,
            frequency: number = Frequency,
        ) {
            try {
                const res = await $api.apiV1ResultAnalysisUrbanWdAverageWaterAgeDynamicGet(
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
                logger.debug('fetchTimeSeriesAverageWaterAgeData   :>> ', this.timeSeriesList)
                return this.timeSeriesList
            } catch (error) {
                showError(StoreName, 'fetchTimeSeriesAverageWaterAgeData error', error)
                return {}
            }
        },

        /**
         * 根据方案id获取全管网平均污染物扩散模拟结果值
         * /api/v1/result-analysis/urban-wd/average-wq-trace-dynamic
         * 应用于:天津、台州、横琴
         */
        async fetchTimeSeriesAverageWqTraceData(
            $api: UrbanWdResultAnalysisApi,
            scenarioId: string,
            startTime: string,
            endTime: string,
            frequency: number = Frequency,
        ) {
            try {
                const res = await $api.apiV1ResultAnalysisUrbanWdAverageWqTraceDynamicGet(
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

                logger.debug('fetchTimeSeriesAverageWqTraceData   :>> ', this.timeSeriesList)
            } catch (error) {
                showError(StoreName, 'fetchTimeSeriesAverageWqTraceData error', error)
                return {}
            }
        },

        /**
         * 根据方案id获取全管网用水量模拟结果值
         * /api/v1/result-analysis/urban-wd/demand-dynamic
         * 应用于:天津、台州、横琴
         */
        async fetchTimeSeriesDemandData(
            $api: UrbanWdResultAnalysisApi,
            scenarioId: string,
            startTime: string,
            endTime: string,
            frequency: number = Frequency,
        ) {
            try {
                const res = await $api.apiV1ResultAnalysisUrbanWdDemandDynamicGet(
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
                logger.debug('fetchTimeSeriesDemandData   :>> ', this.timeSeriesList)
            } catch (error) {
                showError(StoreName, 'fetchTimeSeriesDemandData error', error)
                return {}
            }
        },

        /**
         * 根据方案id获取全管网水头模拟结果值
         * /api/v1/result-analysis/urban-wd/headloss-dynamic
         * 应用于:天津、台州、横琴
         */
        async fetchTimeSeriesHeadlossData(
            $api: UrbanWdResultAnalysisApi,
            scenarioId: string,
            startTime: string,
            endTime: string,
            frequency: number = Frequency,
        ) {
            try {
                const res = await $api.apiV1ResultAnalysisUrbanWdHeadlossDynamicGet(
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

                logger.debug('fetchTimeSeriesHeadlossData   :>> ', this.timeSeriesList)
            } catch (error) {
                showError(StoreName, 'fetchTimeSeriesHeadlossData error', error)
                return {}
            }
        },

        /**
         * 根据方案id获取全管网水头模拟结果值
         * /api/v1/result-analysis/urban-wd/head-dynamic
         * 应用于:天津、台州、横琴
         */
        async fetchTimeSeriesHeadData(
            $api: UrbanWdResultAnalysisApi,
            scenarioId: string,
            startTime: string,
            endTime: string,
            frequency: number = Frequency,
        ) {
            try {
                const res = await $api.apiV1ResultAnalysisUrbanWdHeadDynamicGet(
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

                logger.debug('fetchTimeSeriesHeadData   :>> ', this.timeSeriesList)
            } catch (error) {
                showError(StoreName, 'fetchTimeSeriesHeadData error', error)
                return {}
            }
        },

        /**
         * 根据方案id获取全管网污染物扩散模拟结果值
         * /api/v1/result-analysis/urban-wd/wq-trace-dynamic
         * 应用于:天津、台州、横琴
         */
        async fetchTimeSeriesWqTraceData(
            $api: UrbanWdResultAnalysisApi,
            scenarioId: string,
            startTime: string,
            endTime: string,
            frequency: number = Frequency,
        ) {
            try {
                const res = await $api.apiV1ResultAnalysisUrbanWdWqTraceDynamicGet(
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

                logger.debug('fetchTimeSeriesWqTraceData   :>> ', this.timeSeriesList)
            } catch (error) {
                showError(StoreName, 'fetchTimeSeriesWqTraceData error', error)
                return {}
            }
        },

        /**
         * 根据方案id获取全管网水质模拟结果值
         * /api/v1/result-analysis/urban-wd/wq-dynamic
         * 应用于:天津、台州、横琴
         */
        async fetchTimeSeriesWqData(
            $api: UrbanWdResultAnalysisApi,
            scenarioId: string,
            startTime: string,
            endTime: string,
            frequency: number = Frequency,
        ) {
            try {
                const res = await $api.apiV1ResultAnalysisUrbanWdWqDynamicGet(
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
                logger.debug('fetchTimeSeriesWqData   :>> ', this.timeSeriesList)
            } catch (error) {
                showError(StoreName, 'fetchTimeSeriesWqData error', error)
                return {}
            }
        },

        /**
         * 获得动态模拟结果-管线水龄 (HydroChronology) | 根据方案id获取全管网水龄模拟结果值
         * /api/v1/result-analysis/urban-wd/water-age-dynamic
         * 应用于:天津、台州、横琴
         */
        async fetchTimeSeriesPipeHydroChronologyData(
            $api: UrbanWdResultAnalysisApi,
            scenarioId: string,
            startTime: string,
            endTime: string,
            frequency: number = Frequency,
        ) {
            try {
                const res = await $api.apiV1ResultAnalysisUrbanWdWaterAgeDynamicGet(
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
                logger.debug('fetchTimeSeriesHydroChronologyData   :>> ', this.timeSeriesList)
                return this.timeSeriesList
            } catch (error) {
                showError(StoreName, 'fetchTimeSeriesHydroChronologyData error', error)
            }
        },
        /**
         * 获得动态模拟结果-流量 (Flow)
         * /api/v1/result-analysis/urban-wd/flow-dynamic
         */
        async fetchTimeSeriesFlowData(
            $api: UrbanWdResultAnalysisApi,
            scenarioId: string,
            startTime: string,
            endTime: string,
            frequency: number = Frequency,
        ) {
            try {
                const res = await $api.apiV1ResultAnalysisUrbanWdFlowDynamicGet(
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
                logger.debug('fetchTimeSeriesHydroChronologyData   :>> ', this.timeSeriesList)
                return res.data
            } catch (error) {
                showError(StoreName, 'fetchTimeSeriesFlowData error', error)
            }
        },

        /**
         * 根据方案id获取供水边界模拟结果值
         * /api/v1/result-analysis/urban-wd/trace-supplyrange-dynamic
         * 应用于:天津、横琴
         */
        async fetchTimeSeriesTraceSupplyRangeData(
            $api: UrbanWdResultAnalysisApi,
            scenarioId: string,
            startTime: string,
            endTime: string,
            frequency: number = Frequency,
        ) {
            try {
                const res = await $api.apiV1ResultAnalysisUrbanWdTraceSupplyrangeDynamicGet(
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

                logger.debug('fetchTimeSeriesTraceSupplyRangeData   :>> ', this.timeSeriesList)
            } catch (error) {
                showError(StoreName, 'fetchTimeSeriesTraceSupplyRangeData error', error)
                return {}
            }
        },

        /**
         * 根据模型id获取指定时间范围内的模拟结果值
         * /api/v1/result-analysis/urban-wd/wdresult-history
         * 应用于:天津、台州、李家岩、横琴
         */
        async fetchWdresultHistoryData(
            $api: UrbanWdResultAnalysisApi,
            params: WdHistoryModelInput,
        ) {
            try {
                const res = await $api.apiV1ResultAnalysisUrbanWdWdresultHistoryPost(params)
                return res.data
            } catch (error) {
                showError(StoreName, 'fetchWdresultHistoryData error', error)
            }
        },

        /**
         * 按照时间获取统计结果
         * /api/v1/result-analysis/urban-wd/statistic-result-time-dimension
         * 应用于:天津
         */
        async fetchStatisticResultTimeDimensionData(
            $api: UrbanWdResultAnalysisApi,
            params: GetTimeStatisticResultInput,
        ) {
            try {
                const res = await $api.apiV1ResultAnalysisUrbanWdStatisticResultTimeDimensionPost(
                    params,
                )
                return res.data
            } catch (error) {
                showError(StoreName, 'fetchStatisticResultTimeDimensionData error', error)
                return []
            }
        },

        /**
         * 按照模型id获取统计结果
         * /api/v1/result-analysis/urban-wd/statistic-result-modelid-dimension
         * 应用于:天津
         */
        async fetchStatisticResultModelidDimensionData(
            $api: UrbanWdResultAnalysisApi,
            params: GetStatisticResultInput,
        ) {
            try {
                const res =
                    await $api.apiV1ResultAnalysisUrbanWdStatisticResultModelidDimensionPost(params)
                return res.data
            } catch (error) {
                showError(StoreName, 'fetchStatisticResultModelidDimensionData error', error)
                return []
            }
        },

        /**
         * 根据方案id获取边缘管道信息
         * /api/v1/result-analysis/urban-wd/trace-wq-close-pipe
         * 应用于:横琴
         */
        async fetchTraceWqClosePipeData(
            $api: UrbanWdResultAnalysisApi,
            scenarioId: string,
            startTime: string,
            endTime: string,
            frequency: number = Frequency,
        ) {
            try {
                const res = await $api.apiV1ResultAnalysisUrbanWdTraceWqClosePipeGet(
                    scenarioId,
                    frequency,
                    startTime,
                    endTime,
                )
                return res.data
            } catch (error) {
                showError(StoreName, 'fetchTraceWqClosePipeData error', error)
                return []
            }
        },

        /**
         * 获得时序数据
         * @param $api
         * @param dateType
         */
        async fetchTimeSeriesData(
            $api: UrbanWdResultAnalysisApi,
            scenario: Scenario,
            dateType: string,
        ) {
            logger.debug('fetchTimeSeriesData :>> ', dateType)
            logger.debug('latestScenario :>> ', scenario)
            switch (dateType) {
                case 'Pressure':
                    await this.fetchTimeSeriesPressureData(
                        $api,
                        scenario?.id ?? '',
                        scenario?.startTime ?? '',
                        scenario?.endTime ?? '',
                    )
                    break
                // 流速
                case 'Velocity':
                    await this.fetchTimeSeriesVelocityData(
                        $api,
                        scenario?.id ?? '',
                        scenario?.startTime ?? '',
                        scenario?.endTime ?? '',
                    )
                    break
                case 'HydroChronology':
                    await this.fetchTimeSeriesPipeHydroChronologyData(
                        $api,
                        scenario?.id ?? '',
                        scenario?.startTime ?? '',
                        scenario?.endTime ?? '',
                    )
                    break
                case 'Flow':
                    await this.fetchTimeSeriesFlowData(
                        $api,
                        scenario?.id ?? '',
                        scenario?.startTime ?? '',
                        scenario?.endTime ?? '',
                    )
                    break
                // 水量
                case 'Demand':
                    await this.fetchTimeSeriesDemandData(
                        $api,
                        scenario?.id ?? '',
                        scenario?.startTime ?? '',
                        scenario?.endTime ?? '',
                    )
                    break
                // 水锤
                case 'Headloss':
                    await this.fetchTimeSeriesHeadlossData(
                        $api,
                        scenario?.id ?? '',
                        scenario?.startTime ?? '',
                        scenario?.endTime ?? '',
                    )
                    break
                // 水质
                case 'WQ':
                    await this.fetchTimeSeriesWqData(
                        $api,
                        scenario?.id ?? '',
                        scenario?.startTime ?? '',
                        scenario?.endTime ?? '',
                    )
                    break
                // 水头
                case 'Head':
                    await this.fetchTimeSeriesHeadData(
                        $api,
                        scenario?.id ?? '',
                        scenario?.startTime ?? '',
                        scenario?.endTime ?? '',
                    )
                    break
                // 管网污染物
                case 'WQ_Trace':
                    await this.fetchTimeSeriesWqTraceData(
                        $api,
                        scenario?.id ?? '',
                        scenario?.startTime ?? '',
                        scenario?.endTime ?? '',
                    )
                    break
                // 供水边界
                case 'Trace_SupplyRange':
                    await this.fetchTimeSeriesTraceSupplyRangeData(
                        $api,
                        scenario?.id ?? '',
                        scenario?.startTime ?? '',
                        scenario?.endTime ?? '',
                    )
                    break
                // 平均水质
                case 'Average_WQ':
                    await this.fetchTimeSeriesAverageWqData(
                        $api,
                        scenario?.id ?? '',
                        scenario?.startTime ?? '',
                        scenario?.endTime ?? '',
                    )
                    break
                // 平均水龄
                case 'Average_Water_Age':
                    await this.fetchTimeSeriesAverageWaterAgeData(
                        $api,
                        scenario?.id ?? '',
                        scenario?.startTime ?? '',
                        scenario?.endTime ?? '',
                    )
                    break
                // 平均污染物扩散
                case 'Average_WQ_Trace':
                    await this.fetchTimeSeriesAverageWqTraceData(
                        $api,
                        scenario?.id ?? '',
                        scenario?.startTime ?? '',
                        scenario?.endTime ?? '',
                    )
                    break
                default:
                    break
            }
        },

        /**
         * 获取DMA分区的压力模拟结果
         * /api/v1/result-analysis/urban-wd/dma-pressure
         * 应用于:天津项目_大屏
         */
        async fetchGetDmaPressureData(
            $api: UrbanWdResultAnalysisApi,
            scenarioId: string,
            zoneIds: string[],
        ) {
            try {
                const res = await $api.apiV1ResultAnalysisUrbanWdDmaPressurePost({
                    scenarioId,
                    zoneIds,
                })
                return res.data ?? []
            } catch (error) {
                showError(StoreName, 'fetchGetDmaPressureData error', error)
            }
        },

        /**
         * 获取DMA分区的流量模拟结果
         * /api/v1/result-analysis/urban-wd/dma-flow
         * 应用于:天津项目_大屏
         */
        async fetchGetDmaFlowData(
            $api: UrbanWdResultAnalysisApi,
            scenarioId: string,
            zoneIds: string[],
        ) {
            try {
                const res = await $api.apiV1ResultAnalysisUrbanWdDmaFlowPost({
                    scenarioId,
                    zoneIds,
                })
                return res.data ?? []
            } catch (error) {
                showError(StoreName, 'fetchGetDmaFlowData error', error)
            }
        },

        /**
         * 获得停水用户数据
         * /api/v1/result-analysis/urban-wd/shut-off-users
         * 应用于:天津项目_关阀分析_统计分析
         */
        async fetchScenarioCutOffWaterData($api: UrbanWdResultAnalysisApi, scenarioId: string) {
            try {
                const res = await $api.apiV1ResultAnalysisUrbanWdShutOffUsersGet(scenarioId)
                logger.debug('获得停水用户数据', res.data)
                return res.data ?? [] // 正式
            } catch (error) {
                showError('API', 'fetchScenarioCutOffWaterData', error)
                return []
            }
        },

        /**
         * 按照筛选条件查询模型信息和模拟结果
         * /api/v1/result-analysis/urban-wd/filter-model-result
         * 应用于:天津项目_关阀分析_统计分析
         */
        async fetchScenarioResultFilterData(
            $api: UrbanWdResultAnalysisApi,
            params: GetFilterModelResultInput,
        ) {
            try {
                const res = await $api.apiV1ResultAnalysisUrbanWdFilterModelResultPost(params)
                return res.data ?? [] // 正式
            } catch (error) {
                showError('API', 'fetchScenarioCutOffWaterData', error)
                return []
            }
        },

        /**
         * 根据方案id批量获取单个结构物模拟结果
         * /api/v1/result-analysis/urban-wd/batch-structure-timeseries
         * 应用于:天津项目_关阀分析|辅助调度_方案对比
         */
        async fetchBatchStructureTimeseriesData(
            $api: UrbanWdResultAnalysisApi,
            params: WdBatchTimeseriesInput,
        ) {
            try {
                const res = await $api.apiV1ResultAnalysisUrbanWdBatchStructureTimeseriesPost(
                    params,
                )
                return res.data ?? []
            } catch (error) {
                showError('API', 'fetchBatchStructureTimeseriesData', error)
                return []
            }
        },

        /**
         * 根据方案id批量获取管网模拟结果
         * /api/v1/result-analysis/urban-wd/batch-timeseries
         * 应用于:天津项目_关阀分析|辅助调度_方案对比
         */
        async fetchBatchTimeseriesData(
            $api: UrbanWdResultAnalysisApi,
            params: WdBatchTimeseriesInput,
        ) {
            try {
                const res = await $api.apiV1ResultAnalysisUrbanWdBatchTimeseriesPost(params)
                return res.data ?? []
            } catch (error) {
                showError('API', 'fetchBatchTimeseriesData', error)
                return []
            }
        },
    },
})

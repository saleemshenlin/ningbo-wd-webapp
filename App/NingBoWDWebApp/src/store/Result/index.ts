import { useLegendApiStore } from './../../../../../Store/src/ModelConfiguration/LegendApi/index'
import { ApiHelperExtend } from '@/api/api'
import type { BaseTimeseriesOutput } from '@dhicn/domain-paas-sdk-ts/result-service'
import dayjs from 'dayjs'
import { ITimeSeriesList, ResultState } from './type'
import { defineStore, getActivePinia } from 'pinia'
import { minuteFormat03 } from '@dhicn/helper/date-formatter'
import { Scenario } from '@dhicn/domain-paas-sdk-ts/scenario-service'
import {
    WDModelResultEnum,
    WDModelResultType,
    useUrbanWdResultAnalysisApiStore,
} from 'dhi-dss-api-store/result-service'
import { useUserStore } from '../User'
import { LegendItemDto } from '@dhicn/domain-paas-sdk-ts/model-configuration'
import { toRaw } from 'vue'

export const StoreName = 'result'
export const useResult = defineStore(StoreName, {
    state: (): ResultState => ({
        scenario: null,
        loading: false,
        timeSeriesList: {},
        resultStyle: null,
        classifyLegendList: [],
    }),
    getters: {},
    actions: {
        /**
         * 准备TileServer类型的结果
         * @param $api
         * @param scenarioId
         */
        async prepareTileResult($api: ApiHelperExtend, scenarioId: string) {
            this.loading = true
            try {
                // const rep = await $api.global_result_service.mesh2D.apiV2Result2dDynamicGet(
                //     scenarioId,
                // )
                // if (rep.data) {
                //     const { style, time } = rep.data
                //     const start = dayjs(time!.startTime)
                //     const timeList: string[] = []
                //     for (let index = 0; index < time!.timeNo!; index++) {
                //         timeList.push(
                //             start.add(index * time!.timeStep!, 'second').format(minuteFormat03),
                //         )
                //     }
                //     this.resultStyle = style!
                //     this.timeSeriesList = { time: timeList }
                //     // logger.debug('prepare2DResult result', style)
                // }
            } catch (error) {
                logger.error(StoreName, 'prepare2DResult', error)
            } finally {
                this.loading = false
            }
        },

        /**
         * 获得GeoJSON类型动态播放的结果
         */
        async prepareGeoJSONResult(
            $api: ApiHelperExtend,
            scenario: Scenario,
            resultItem: WDModelResultType,
            gisKey: string,
            isCache: boolean = false,
        ) {
            this.loading = true
            try {
                if (scenario === undefined) return
                const resultKey = `MapResult-${scenario.scenarioCode}-${resultItem}`
                const userStore = useUserStore()
                const cache = (await userStore.localStorage.getItem(resultKey)) as ITimeSeriesList
                if (cache !== null) {
                    if (!isCache) {
                        this.timeSeriesList = cache
                    }
                    // logger.debug('preparePipeResult cache gis', JSON.parse(cache.gis!))
                } else {
                    const domainStore = useUrbanWdResultAnalysisApiStore(getActivePinia())
                    await domainStore.fetchTimeSeriesData(
                        $api.global_result_service.urban_wd,
                        scenario,
                        resultItem,
                    )
                    const { time, data } = domainStore.timeSeriesList
                    if (time && time.length > 0) {
                        //  组成GIS
                        const gisData = (await userStore.localStorage.getItem(gisKey)) as string
                        if (gisData !== null) {
                            const gis = JSON.parse(gisData) as GeoJSON.FeatureCollection
                            gis.features.forEach((f, index) => {
                                for (let timeIndex = 0; timeIndex < time.length; timeIndex++) {
                                    const result = data![timeIndex][index]
                                    f.properties![`r${timeIndex}`] = result
                                }
                            })
                            const gisStr = JSON.stringify(gis)
                            userStore.localStorage.setItem(resultKey, {
                                time: toRaw(time) ?? [],
                                data: [],
                                iDs: [],
                                gis: gisStr,
                                key: resultKey,
                            } as ITimeSeriesList)
                            if (!isCache) {
                                this.timeSeriesList = {
                                    time: time ?? [],
                                    data: [],
                                    iDs: [],
                                    gis: gisStr,
                                    key: resultKey,
                                }
                            }
                        }
                    }
                    logger.debug('preparePipeResult result', this.timeSeriesList)
                }
            } catch (error) {
                logger.error(StoreName, 'preparePipeResult', error)
            } finally {
                this.loading = false
            }
        },
        /**
         * 获取所有结果类型
         * @param $api
         * @param params
         */
        async getAllResultItem($api: ApiHelperExtend) {
            try {
                const userStore = useUserStore()
                const legendStore = useLegendApiStore(getActivePinia())
                const cache = (await userStore.localStorage.getItem('all-legend')) as Map<
                    string,
                    LegendItemDto
                >
                if (cache !== null && cache.size > 0) {
                    legendStore.resultItemMap = cache
                } else {
                    await legendStore.fetchResultItemList(
                        $api.global_model_configuration_service.legend,
                    )
                    const legends = toRaw(legendStore.resultItemMap)
                    userStore.localStorage.setItem('all-legend', legends)
                }
            } catch (error) {
                logger.error(StoreName, 'getAllResult', error)
                return false
            }
        },
        /**
         * 获取某个图例项的等级设置信息
         * @param $api
         * @param params
         */
        async fetchResultLegend($api: ApiHelperExtend, resultItem: string) {
            try {
                const legendStore = useLegendApiStore(getActivePinia())
                const legend = legendStore.resultItemMap.get(resultItem)
                const modelType = legend!.modelType!
                const dataType = legend!.typeName!
                this.classifyLegendList =
                    (await legendStore.fetchClassifyLegendData(
                        $api.global_model_configuration_service.legend,
                        modelType,
                        dataType,
                    )) ?? []
            } catch (error) {
                logger.error(StoreName, 'getLegend', error)
                return false
            }
        },
        /**
         * 查询管网TS数据，PipeFlow;PipeVelocity;
         * @param $api
         * @param scenarioId
         * @param dataType
         * @param muid
         */
        async fetchNetworkTSData(
            $api: ApiHelperExtend,
            scenarioId: string,
            dataType: WDModelResultEnum,
            modelId: string,
        ) {
            try {
                const domainStore = useUrbanWdResultAnalysisApiStore(getActivePinia())

                if (dataType === WDModelResultEnum.Head) {
                    // 水池液位特殊处理
                    return await domainStore.fetchGetModelTSDataOfStructure(
                        $api.global_result_service.urban_wd,
                        scenarioId,
                        modelId,
                        'Tank',
                        'HD',
                        dataType,
                    )
                } else {
                    return await domainStore.fetchGetModelTSData(
                        $api.global_result_service.urban_wd,
                        scenarioId,
                        modelId,
                        dataType,
                    )
                }
            } catch (error) {
                logger.error(StoreName, 'fetchNetworkTSData', error)
                return []
            }
        },
    },
})

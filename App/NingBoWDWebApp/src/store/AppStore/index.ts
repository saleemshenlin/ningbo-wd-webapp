import {
    MODEL_RUN_CFG,
    ScenarioType,
    TestIndicator,
    TestMUID,
    TestResultType,
    TestResultIndicator,
} from './config'
import { useLibraryApiStore } from 'dhi-dss-api-store/scenario'
import { ScenarioState } from './type'
import { defineStore, getActivePinia } from 'pinia'
import { ApiHelperExtend } from '@/api/api'

export const StoreName = 'AppStore'
export const useAppStore = defineStore(StoreName, {
    state: (): ScenarioState => ({
        // 方案库
        scenarios: [],
        loading: false,
        templateMap: new Map(),
        libraryMap: new Map(),
        historyTSDataMap: new Map(),
    }),
    getters: {
        normalScenarioList: (state: ScenarioState) => {
            return state.scenarios
        },
    },
    actions: {
        async fetchTemplates($api: ApiHelperExtend) {
            await this.fetchTemplateByKey($api, 'MIKEPlusFloodModel')
            await this.fetchTemplateByKey($api, 'WWTP')
        },
        async fetchTemplateByKey($api: ApiHelperExtend, key: ScenarioType) {
            try {
                const libraryStore = useLibraryApiStore(getActivePinia())
                // MIKEPlusFloodModel
                const libraries = await libraryStore.fetchLibraryByType(
                    $api.api.scenario.library,
                    MODEL_RUN_CFG[key].BusinessType,
                    MODEL_RUN_CFG[key].LibraryType,
                )
                if (libraries.length > 0) {
                    this.libraryMap.set(key, libraries[0])
                    const templates = await libraryStore.getTemplateList(
                        $api.api.scenario.library,
                        libraries[0].id,
                    )
                    if (templates.filter((t) => t.enabled).length > 0) {
                        this.templateMap.set(key, templates.filter((t) => t.enabled)[0])
                    }
                }
            } catch (error) {
                logger.error(StoreName, 'fetchTemplateByKey', error)
            }
        },
        async fetchScenarioList($api: ApiHelperExtend) {
            try {
                this.loading = true
                const libraryStore = useLibraryApiStore(getActivePinia())
                const scenarioMike = await libraryStore.getScenarioList($api.api.scenario.library, {
                    libraryId: this.libraryMap.get('MIKEPlusFloodModel')!.id,
                    pageIndex: 1,
                    pageSize: 10000,
                })
                const scenarioWwtp = await libraryStore.getScenarioList($api.api.scenario.library, {
                    libraryId: this.libraryMap.get('WWTP')!.id,
                    pageIndex: 1,
                    pageSize: 10000,
                })
                this.scenarios = [...scenarioMike, ...scenarioWwtp]
            } catch (error) {
                logger.error(StoreName, 'fetchScenarioList', error)
            } finally {
                this.loading = false
            }
        },
        async fetchOnlineAndCleanData($api: ApiHelperExtend, startTime: string, endTime: string) {
            try {
                const cleanPromise = $api.api.iot_data
                    .apiDataGetOnlineProcessedDatasByConditionsPost({
                        startTime,
                        endTime,
                        codes: [TestIndicator],
                    })
                    .then((rep) => {
                        const dataSet: {
                            t: string[]
                            v: number[]
                        } = {
                            t: [],
                            v: [],
                        }
                        rep.data.forEach((d) => {
                            dataSet.t.push(d.time!)
                            dataSet.v.push(d.value!)
                        })
                        return dataSet
                    })
                const dataPromise = $api.api.iot_ts
                    .apiV3IotTimeseriesBatchPost([
                        {
                            indicator: TestIndicator,
                            startTs: startTime,
                            endTs: endTime,
                        },
                    ])
                    .then((rep) => {
                        return rep.data
                    })
                Promise.all([cleanPromise, dataPromise]).then(([cleanData, onlineData]) => {
                    const dataSet = {
                        indicator: TestIndicator,
                        modelTsData: cleanData,
                        measureTsData: onlineData[0],
                    }
                    logger.debug('fetchOnlineAndCleanData', dataSet)
                    this.historyTSDataMap.set(TestIndicator, dataSet)
                })
            } catch (error) {
                logger.error(StoreName, 'fetchOnlineAndCleanData', error)
            }
        },
        async fetchResultData(
            $api: ApiHelperExtend,
            startTime: string,
            endTime: string,
            scenarioId: string,
        ) {
            try {
                const resultPromise = $api.api.global_result_service.network
                    .apiV1ResultNetworkPumpTimeseriesGet(scenarioId, TestMUID, TestResultType)
                    .then((rep) => {
                        return rep.data
                    })
                const dataPromise = $api.api.iot_ts
                    .apiV3IotTimeseriesBatchPost([
                        {
                            indicator: TestResultIndicator,
                            startTs: startTime,
                            endTs: endTime,
                        },
                    ])
                    .then((rep) => {
                        return rep.data
                    })

                const cleanPromise = $api.api.iot_data
                    .apiDataGetOnlineProcessedDatasByConditionsPost({
                        startTime,
                        endTime,
                        codes: [TestResultIndicator],
                    })
                    .then((rep) => {
                        const dataSet: {
                            t: string[]
                            v: number[]
                        } = {
                            t: [],
                            v: [],
                        }
                        rep.data.forEach((d) => {
                            dataSet.t.push(d.time!)
                            dataSet.v.push(d.value!)
                        })
                        return dataSet
                    })
                Promise.all([resultPromise, dataPromise, cleanPromise]).then(
                    ([resultData, onlineData, cleanData]) => {
                        const dataSet = {
                            indicator: TestResultIndicator,
                            modelTsData: resultData,
                            measureTsData: onlineData[0],
                            cleanTsData: cleanData,
                        }
                        this.historyTSDataMap.set(TestResultIndicator, dataSet)
                    },
                )
            } catch (error) {
                logger.error(StoreName, 'fetchResultData', error)
            }
        },
        async sendResultData($api: ApiHelperExtend, scenarioId: string) {
            try {
                const points = await $api.api.iot_opc.apiV2OpcUaQueryCommunicationPost()
                const point = points.data.find((p) => p.indicator === TestResultIndicator)
                const tsData = await $api.api.global_result_service.network
                    .apiV1ResultNetworkPumpTimeseriesGet(scenarioId, TestMUID, TestResultType)
                    .then((rep) => {
                        return rep.data
                    })
                if (point !== undefined && tsData.v && tsData.v!.length > 0) {
                    const rep = await $api.api.iot_opc.apiV1OpcUaWriteNodePost({
                        opcFlag: point.opcFlag!,
                        node: point.node!,
                        nodeValue: tsData.v![tsData.v!.length - 1].toString(),
                        dataType: point.dataType! as any,
                    })
                    return rep.data
                }
            } catch (error) {
                logger.error(StoreName, 'fetchResultData', error)
                return false
            }
        },
    },
})

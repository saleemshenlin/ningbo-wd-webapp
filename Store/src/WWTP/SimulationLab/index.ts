import { useLibraryApiStore } from './../../Scenario/LibraryApi/index'
import { showError } from '../../helper/showError'
import { downloadBuffer } from '@dhicn/helper/download-helper'
import { roundDownToFiveMinutes, minuteFormat01 } from '@dhicn/helper/date-formatter'
import { LibraryApi } from '@dhicn/domain-paas-sdk-ts/scenario-service'
import * as WwtpApi from '@dhicn/domain-paas-sdk-ts/wwtp-domain'
import * as ModelDriverApi from '@dhicn/domain-paas-sdk-ts/model-driver-service'
import dayjs from 'dayjs'

import {
    ScenarioLabState,
    InletDataInput,
    ScadaInletInput,
    FileInletInput,
    BioTankInput,
    IndicatorStatisticInput,
    TsByLineInput,
} from './type'
import { defineStore, getActivePinia } from 'pinia'
import { LabLibraryType } from './config'
import storage from '../../helper/storage'

export const useSimulationLabStore = defineStore('wwtp-simulation-lab', {
    state: (): ScenarioLabState => ({
        compareScenarioList: storage.get('compareScenarioList') ?? [], // 进行对比的方案列表
    }),
    actions: {
        /**
         * 获取方案列表
         * @param $api
         * @param data
         * @returns
         */
        async fetchScenarioList(
            $api: LibraryApi,
            data: {
                libraryId: string
                pageIndex: number
                pageSize: number
            },
        ) {
            try {
                const scenarioStore = useLibraryApiStore(getActivePinia())
                const list = await scenarioStore.getScenarioList($api, data)
                return list ?? []
            } catch (error) {
                showError('API', 'fetchScenarioList', error)
            }
        },
        /**
         * 删除方案
         * @param $api
         * @param idList
         * @returns
         */
        async delScenario($api: WwtpApi.ProNumSimLabApi, idList: string[]) {
            try {
                const res = await $api.apiV2SimulationLabScenarioDeletePost({
                    scenarioIds: idList,
                })
                return res.data as unknown as boolean
            } catch (error: any) {
                showError('API', 'delScenario', error)
                return false
            }
        },
        /**
         *  计算方案模型
         * @param $api
         * @param data
         * @returns
         */
        async runModel(
            $api: ModelDriverApi.ModelRunApi,
            data: {
                tenantId: string
                projectName: string
                scenarioId: string
                templateScenarioId: string
                LibraryType: number
                businessType: number
            },
        ) {
            try {
                const params = {
                    tenantId: data.tenantId,
                    scenarioId: data.scenarioId,
                    projectName: data.projectName,
                    modelType: 'WWTP',
                    priority: 0,
                    modelInfo: JSON.stringify({
                        ScenarioId: data.scenarioId,
                        TenantId: data.tenantId,
                        TemplateScenarioId: data.templateScenarioId,
                        LibraryType: data.LibraryType,
                        BusinessType: data.businessType,
                    }),
                }
                const res = await $api.modelRunRunModelPost(params)
                return res.data
            } catch (error: any) {
                showError('API', 'runModel', error)
                return {}
            }
        },
        /**
         * 取消方案模型计算
         * @param $api
         * @param idList
         * @returns
         */
        async cancelModelRun($api: ModelDriverApi.ModelRunApi, idList: string[]) {
            try {
                const res = await $api.modelRunV2CancelModelRunThroughScenarioIdsPost(idList)
                return res.data
            } catch (error: any) {
                showError('API', 'cancelModelRun', error)
                return {}
            }
        },
        /**
         *
         * @param $api 获取方案计算状态（对于等待中的方案，返回其排队序号）
         * @param idList
         * @returns
         */
        async getModelStatus($api: ModelDriverApi.ModelRunApi, idList: string[]) {
            try {
                const res = await $api.modelRunV2CalculateStatusPost(idList, {
                    headers: {
                        showErrMsg: false,
                    },
                })
                return res.data
            } catch (error: any) {
                showError('API', 'getModelStatus', error)
                return []
            }
        },
        /**
         * 获取方案计算日志
         * @param $api
         * @param scenarioId
         * @returns
         */
        async getModelLog($api: ModelDriverApi.ModelRunApi, scenarioId: string) {
            try {
                const res = await $api.modelRunV2CalculateLogsGet(scenarioId)
                return res.data
            } catch (error: any) {
                showError('API', 'getModelLog', error)
                return {}
            }
        },

        /**
         * 查询 scada 进水点数据
         * @param $api
         * @param data
         * @returns
         */
        async queryScadaInlet($api: WwtpApi.ProNumSimLabApi, data: ScadaInletInput) {
            const { inlet, startTime, endTime } = data
            try {
                const end = dayjs(roundDownToFiveMinutes(endTime)).format(minuteFormat01)
                const start = dayjs(roundDownToFiveMinutes(startTime)).format(minuteFormat01)
                const res = await $api.apiV2SimulationLabScenarioInletScadaGet(inlet, start, end)
                return res.data ?? {}
            } catch (error) {
                showError('API', 'queryScadaInlet', error)
                return {}
            }
        },
        /**
         * 查询进水点数据
         * @param $api
         * @param data
         * @returns
         */
        async queryInletData($api: WwtpApi.ProNumSimLabApi, data: InletDataInput) {
            const { inlet, scenarioId } = data
            try {
                const res = await $api.apiV2SimulationLabScenarioInletDataGet(scenarioId, inlet)
                return res.data ?? {}
            } catch (error) {
                showError('API', 'queryInletData', error)
                return {}
            }
        },
        /**
         * 进水模版excel文件下载
         * @param $api
         */
        async downLoadInletDataFile($api: WwtpApi.ProNumSimLabApi) {
            try {
                const res = await $api.apiV2SimulationLabScenarioInletDataTemplateDownloadPost({
                    responseType: 'arraybuffer',
                })
                downloadBuffer(res.data as unknown as ArrayBuffer)
            } catch (error) {
                showError('API', 'downLoadInletDataFile', error)
            }
        },
        /**
         *  excel 文件解析进水点数据
         * @param $api
         * @param data
         */
        async queryInletDataByFile($api: WwtpApi.ProNumSimLabApi, data: FileInletInput) {
            const { excel } = data
            try {
                const res = await $api.apiV2SimulationLabScenarioInletDataTemplateUploadPost(excel)
                return res.data ?? []
            } catch (error) {
                showError('API', 'queryInletDataByFile', error)
                return []
            }
        },
        /**
         * 保存进水点数据
         * @param $api
         * @param data
         */
        async saveInletData($api: WwtpApi.ProNumSimLabApi, data: WwtpApi.SaveInletDataInput[]) {
            try {
                const res = await $api.apiV2SimulationLabScenarioInletDataSavePost(data)
                return res.data as unknown as boolean
            } catch (error: any) {
                showError('API', 'queryInletData', error)
                return false
            }
        },
        /**
         * 查询方案参数设置
         * @param $api
         * @param data
         * @returns
         */
        async queryScenarioParam(
            $api: WwtpApi.ProNumSimLabApi,
            data: {
                scenarioId?: string
                productLine?: string
            },
        ) {
            const { scenarioId, productLine } = data
            try {
                const res = await $api.apiV2SimulationLabScenarioParamGet(scenarioId, productLine)
                return res.data ?? []
            } catch (error) {
                showError('API', 'queryScenarioParam', error)
                return []
            }
        },
        /**
         * 保存方案参数设
         * @param $api
         * @param data
         * @returns
         */
        async saveScenarioParam($api: WwtpApi.ProNumSimLabApi, data: WwtpApi.SaveParamInput[]) {
            try {
                const res = await $api.apiV2SimulationLabScenarioParamSavePost(data)
                return res.data as unknown as boolean
            } catch (error) {
                showError('API', 'saveScenarioParam', error)
                return false
            }
        },
        /**
         * 查询方案结果配置(不传方案id则表示新建的方案)
         * @param $api
         * @param scenarioId
         * @returns
         */
        async queryResultSetting($api: WwtpApi.ProNumSimLabApi, scenarioId?: string) {
            try {
                const res = await $api.apiV2SimulationLabScenarioResultSettingGet(scenarioId)
                return res.data ?? {}
            } catch (error) {
                showError('API', 'queryResultSetting', error)
                return {}
            }
        },
        /**
         * 保存方案结果配置
         * @param $api
         * @param data
         * @returns
         */
        async saveResultSetting($api: WwtpApi.ProNumSimLabApi, data: WwtpApi.ResultParam) {
            try {
                const res = await $api.apiV2SimulationLabScenarioResultSettingSavePost(data)
                return res.data as unknown as boolean
            } catch (error) {
                showError('API', 'saveResultSetting', error)
                return false
            }
        },
        /**
         * 查询生化池列表
         * @param $api
         * @param data
         */
        async queryBiotanks($api: WwtpApi.ProNumSimLabApi, data: BioTankInput) {
            const { productLine, modelName } = data
            try {
                const res = await $api.apiV2ConfigBiochemicaltanksGet(productLine, modelName)
                return res.data ?? []
            } catch (error) {
                showError('API', 'queryBiotanks', error)
                return []
            }
        },
        /**
         * 单个工艺线单个生化池指标统计查询
         * @param $api
         * @param data
         */
        async queryIndicatorStatistic(
            $api: WwtpApi.ProNumSimLabApi,
            data: IndicatorStatisticInput,
        ) {
            const { scenarioId, productLine, tankNo, modelName } = data
            try {
                const res = await $api.apiV2SimulationLabResultIndicatorStatisticGet(
                    scenarioId,
                    productLine,
                    tankNo,
                    modelName,
                )
                return res.data ?? []
            } catch (error) {
                showError('API', 'queryIndicatorStatistic', error)
                return []
            }
        },
        /**
         * 单个工艺线水质全流程查询
         * @param $api
         * @param data
         */
        async queryTsByProductline($api: WwtpApi.ProNumSimLabApi, data: TsByLineInput) {
            const { scenarioId, productLine, modelName } = data
            try {
                const res = await $api.apiV2SimulationLabResultTsByProductlineGet(
                    scenarioId,
                    productLine,
                    modelName,
                )
                return res.data ?? []
            } catch (error) {
                showError('API', 'queryTsByProductline', error)
                return []
            }
        },
        /**
         * 总线出水水质查询
         * @param $api
         * @param scenarioId
         */
        async queryAllTs($api: WwtpApi.ProNumSimLabApi, scenarioId: string) {
            try {
                const res = await $api.apiProNumSimLabSimResultsGet(scenarioId)
                return res.data ?? []
            } catch (error) {
                showError('API', 'queryAllTs', error)
                return []
            }
        },
        /**
         * 查询可与指定方案可比较的方案id列表
         * @param $api
         * @param scenarioId
         */
        async queryCompareScenarios($api: WwtpApi.ProNumSimLabApi, scenarioId: string) {
            try {
                const res = await $api.apiV2SimulationLabScenarioScenariosForCompareGet(scenarioId)
                return res.data ?? []
            } catch (error) {
                showError('API', 'queryCompareScenarios', error)
                return []
            }
        },
        /**
         * 多方案控制参数对比
         * @param $api
         * @param data
         */
        async compareControlParam(
            $api: WwtpApi.ProNumSimLabApi,
            data: WwtpApi.QueryControlParamCompareInput,
        ) {
            try {
                const res = await $api.apiV2SimulationLabCompareControlParamPost(data)
                return res.data ?? []
            } catch (error) {
                showError('API', 'compareControlParam', error)
                return []
            }
        },
    },
})

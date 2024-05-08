import {
    ModelRunApi,
    CalculateStatusOutput,
    EnumStatus,
} from '@dhicn/domain-paas-sdk-ts/model-driver-service'
import { defineStore } from 'pinia'
import { showError } from '../../helper/showError'
import { ModelRunApiStore } from './type'

const StoreName = 'ModelRunApi'

export const useModelRunApiStore = defineStore(StoreName, {
    state: (): ModelRunApiStore => ({
        runningStateEnabled: true,
        runningStateMap: new Map(),
    }),
    actions: {
        /**
         * 计算方案
         * /ModelRun/RunModel
         * @param $api
         * @param params
         */
        async calculateScenario(
            $api: ModelRunApi,
            params: {
                tenantId: string
                projectName: string
                scenarioId: string
                modelType: string
                templateScenarioId: string
                libraryType: number
                businessType: number
            },
        ) {
            try {
                const {
                    tenantId,
                    scenarioId,
                    projectName,
                    templateScenarioId,
                    libraryType,
                    modelType,
                    businessType,
                } = params
                const requestParams = {
                    tenantId,
                    scenarioId,
                    projectName,
                    modelType,
                    priority: 0,
                    modelInfo: JSON.stringify({
                        ScenarioId: scenarioId,
                        TenantId: tenantId,
                        TemplateScenarioId: templateScenarioId,
                        LibraryType: libraryType,
                        BusinessType: businessType,
                    }),
                }
                const res = await $api.modelRunRunModelPost(requestParams)
                return res.data ?? {}
            } catch (error: any) {
                showError(StoreName, 'runModel', error)
                return {}
            }
        },

        /**
         * 取消方案计算
         * /ModelRun/v2/CancelModelRun/Through/ScenarioIds
         * @param $api
         * @param ids string[]
         */
        async cancelCalculateScenario($api: ModelRunApi, ids: string[]) {
            try {
                const res = await $api.modelRunV2CancelModelRunThroughScenarioIdsPost(ids)
                return res.data
            } catch (error) {
                showError(StoreName, 'cancelCalculateScenario', error)
            }
        },

        /**
         * 获取方案计算状态（对于等待中的方案，返回其排队序号）
         * 单个
         * /ModelRun/v2/CalculateStatus
         * @param $api
         * @param ids string[]
         */
        async getScenarioCalcState($api: ModelRunApi, ids: string[]) {
            try {
                const headers = {
                    showErrMsg: false,
                }
                const res = await $api.modelRunV2CalculateStatusPost(ids, { headers })
                return res.data ?? []
            } catch (error) {
                showError(StoreName, 'getScenarioCalcState', error)
            }
        },
        /**
         * 获得方案日志
         * /ModelRun/v2/CalculateLogs
         * @param $api
         * @param id string
         */
        async getModelLog($api: ModelRunApi, id: string) {
            try {
                const res = await $api.modelRunV2CalculateLogsGet(id)
                return res.data ?? null
            } catch (error) {
                showError(StoreName, 'getModelLog', error)
                return null
            }
        },
        /**
         * 改变轮询获取计算状态
         * @param enabled
         */
        async enableFetchRunningState(enabled: Boolean) {
            this.runningStateEnabled = enabled
        },
        /**
         * 轮询获取计算状态
         */
        async fetchRunningState(
            $api: ModelRunApi,
            ids: string[],
            toSuccess: (runningState: CalculateStatusOutput) => void,
            toFail: (runningState: CalculateStatusOutput, err?: any) => void,
        ) {
            try {
                const rep = await this.getScenarioCalcState($api, ids)
                const idList: string[] = []
                if (rep !== undefined && rep?.length > 0) {
                    rep.forEach((runningState) => {
                        const currentInfo = runningState
                        this.runningStateMap.set(currentInfo.scenarioId as string, currentInfo)
                        switch (currentInfo.status) {
                            case EnumStatus.NUMBER_0:
                                // 0 Computed
                                toSuccess(currentInfo)
                                break
                            case EnumStatus.NUMBER_1:
                                // Waiting
                                idList.push(currentInfo.scenarioId as string)
                                break
                            case EnumStatus.NUMBER_2:
                                // Computing
                                idList.push(currentInfo.scenarioId as string)
                                break
                            case EnumStatus.NUMBER_MINUS_1:
                                // Failed
                                toFail(currentInfo)
                                break
                            default:
                                break
                        }
                    })
                    if (idList.length > 0 && this.runningStateEnabled) {
                        setTimeout(() => {
                            this.fetchRunningState($api, idList, toSuccess, toFail).catch(
                                (error) => {
                                    showError(StoreName, 'fetchRunningState', error)
                                },
                            )
                        }, 10 * 1000)
                    }
                }
            } catch (error) {
                showError(StoreName, 'fetchRunningState', error)
            }
        },
    },
})

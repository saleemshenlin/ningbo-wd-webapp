import {
    ScenarioManagerApi,
    Scenario,
    CreateTemplateScenarioPara2,
    CreateTemplateScenarioByMinIoPara2,
    SetDefaultScenarioPara,
} from '@dhicn/domain-paas-sdk-ts/scenario-service'
import { useScenarioManagerApiState } from './type'
import { StoreDefinition, defineStore } from 'pinia'
import { showError } from '../../helper/showError'

const StoreName = 'ScenarioManagerApi'

export const useScenarioManagerApiStore = defineStore(StoreName, {
    state: (): useScenarioManagerApiState => ({
        template: null,
        latestScenario: null,
        // TODO:存储方案列表
    }),
    actions: {
        // #region  Template
        /**
         * 查找根模板 | 获取所有的模板方案
         * /api/v2/scenario-manager/scenario/templatelist
         * @param $api
         */
        async fetchTemplate($api: ScenarioManagerApi) {
            try {
                const fetchRep = await $api.apiV2ScenarioManagerScenarioTemplatelistGet('2')
                const tempList = fetchRep.data.filter((t) => t.enabled === 1)
                if (tempList.length > 0) {
                    this.template = tempList[0]
                }
                return tempList
            } catch (error) {
                showError(StoreName, 'fetchTemplate', error)
                return await Promise.reject(error)
            }
        },
        /**
         * 根据方案ID获取方案详情
         * @param $api
         * @param scenarioId
         */
        async getScenarioDetail($api: ScenarioManagerApi, scenarioId: string) {
            try {
                const fetchRep = await $api.apiV2ScenarioManagerScenarioGet('2', scenarioId)
                return fetchRep.data
            } catch (error) {
                showError(StoreName, 'getScenarioDetail', error)
                return await Promise.reject(error)
            }
        },
        /**
         * 根据方案ID获取templateId
         * /api/v2/scenario-manager/scenario/template
         * @param $api
         * @param scenarioId
         */
        async getTemplateIdByScenarioId($api: ScenarioManagerApi, scenarioId: string) {
            try {
                const res = await $api.apiV2ScenarioManagerScenarioTemplateGet('2', scenarioId)
                return res.data
            } catch (error) {
                showError(StoreName, 'getTemplateIdByScenarioId', error)
                return await Promise.reject(error)
            }
        },
        /**
         * 删除方案
         * /api/v2/scenario-manager/scenario/delete
         * @param $api
         * @param scenarioId
         */
        async delScenario($api: ScenarioManagerApi, scenarioId: string) {
            try {
                const res = await $api.apiV2ScenarioManagerScenarioDeletePost('2', {
                    scenarioId,
                })
                return res.data
            } catch (error) {
                showError(StoreName, 'delScenario', error)
                return await Promise.reject(error)
            }
        },
        /**
         * 更新方案基本信息 编辑方案后保存
         * /api/v2/scenario-manager/scenario/update
         * 应用于:天津、台州、横琴、李家岩、竹园污水、系统配置-模型模板管理-启用模板更新enabled参数
         * @param $api
         * @param scenarioId
         */
        async updateScenario($api: ScenarioManagerApi, scenarios: Scenario[]) {
            try {
                const res = await $api.apiV2ScenarioManagerScenarioUpdatePost('2', {
                    scenarios,
                })
                return res.data
            } catch (error) {
                showError(StoreName, 'delScenario', error)
                return await Promise.reject(error)
            }
        },
        /**
         * 更新方案，同时更新其对应的模型文件
         * /api/v2/scenario-manager/scenario/update-scenario-model
         * @param $api
         * @param scenarioId
         */
        async updateScenarioWithModel($api: ScenarioManagerApi, scenario: Scenario) {
            try {
                const res = await $api.apiV2ScenarioManagerScenarioUpdateScenarioModelPost(
                    '2',
                    scenario,
                )
                return res.data
            } catch (error) {
                showError(StoreName, 'delScenario', error)
                return await Promise.reject(error)
            }
        },

        /**
         * 创建一个新的模板方案
         * /api/v2/scenario-manager/scenario/create-template
         * 应用:系统配置-模型模板管理
         */
        async createTemplate(
            $api: ScenarioManagerApi,
            params: CreateTemplateScenarioPara2,
            version: string = '2',
        ) {
            try {
                const res = await $api.apiV2ScenarioManagerScenarioCreateTemplatePost('2', params)
                return res.data
            } catch (error) {
                showError(StoreName, 'createTemplate', error)
                return {}
            }
        },

        /**
         * 基于分布式文件系统，创建模板方案
         * /api/v2/scenario-manager/scenario/dfs/create-template
         * 应用:系统配置-模型模板管理
         */
        async createTemplateByDfs(
            $api: ScenarioManagerApi,
            params: CreateTemplateScenarioByMinIoPara2,
            version: string = '2',
        ) {
            try {
                const res = await $api.apiV2ScenarioManagerScenarioDfsCreateTemplatePost(
                    version,
                    params,
                )
                return res.data
            } catch (error) {
                showError(StoreName, 'createTemplateByDfs', error)
                return {}
            }
        },

        /**
         * 获取所有的模板方案
         * /api/v2/scenario-manager/scenario/templatelist
         * 应用:系统配置-模型模板管理
         */
        async getTemplateList($api: ScenarioManagerApi, version: string = '2') {
            try {
                const res = await $api.apiV2ScenarioManagerScenarioTemplatelistGet(version)
                return res.data
            } catch (error) {
                showError(StoreName, 'getTemplateList', error)
                return []
            }
        },

        /**
         * 根据方案ID获取方案基本信息
         * /api/v2/scenario-manager/scenario
         * 应用:台州_调度预案分析_列表  长治_水污染扩散事故回显
         */
        async getScenario($api: ScenarioManagerApi, scenarioId: string, version: string = '2') {
            try {
                const res = await $api.apiV2ScenarioManagerScenarioGet(version, scenarioId)
                return (res.data as Scenario) || {}
            } catch (error) {
                showError(StoreName, 'getScenario', error)
                return {}
            }
        },

        /**
         * 设置方案为默认展示
         * /api/v2/scenario-manager/scenario/default/display/set
         * 应用:长治项目
         */
        async setDefaultDisplay(
            $api: ScenarioManagerApi,
            params: SetDefaultScenarioPara,
            version: string = '2',
        ) {
            try {
                const res = await $api.apiV2ScenarioManagerScenarioDefaultDisplaySetPost(
                    version,
                    params,
                )
                return res.data
            } catch (error) {
                showError(StoreName, 'setDefaultDisplay', error)
                return {}
            }
        },
    },
})

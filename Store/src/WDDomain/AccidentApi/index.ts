import { defineStore } from 'pinia'
import { AccidentApiState } from './type'
import { showError, logger } from '../../helper/showError'
import * as WDApi from '@dhicn/domain-paas-sdk-ts/wd-domain'
const StoreName = 'AccidentApi'
export const useAccidentApiStore = defineStore(StoreName, {
    state: (): AccidentApiState => ({}),
    actions: {
        /**
         * 保存爆管事故信息
         * /api/v1/domain-wd/accident/burst-pipe/add
         * 应用于:天津生态城:关阀分析-关阀方案
         */
        async saveAccidentBurstPipeInfo(
            $api: WDApi.AccidentApi,
            params: WDApi.SavePipeBurstInfoInput,
        ) {
            try {
                const res = await $api.apiV1DomainWdAccidentBurstPipeAddPost(params)
                logger.debug('保存爆管事故信息', res)
                if (res.status === 200) {
                    return true
                }
                return false
            } catch (error) {
                showError('API', 'saveAccidentBurstPipeInfo', error)
                return false
            }
        },

        /**
         * 删除事故方案，包括事故基本信息和关联的阀门信息
         * /api/v1/domain-wd/accident/scenario/delete
         * 应用于:天津生态城:关阀分析-方案删除
         */
        async deleteAccidentScenario($api: WDApi.AccidentApi, scenarioId: string) {
            try {
                const res = await $api.apiV1DomainWdAccidentScenarioDeleteGet(scenarioId)
                logger.debug('删除事故方案，包括事故基本信息和关联的阀门信息', res.data, res.status)
                return res.data as unknown as boolean
            } catch (error) {
                showError('API', 'deleteAccidentScenario error', error)
                return false
            }
        },

        /**
         * 寻找爆管阀门（支持同一个事件发生多个爆管）
         * /api/v1/domain-wd/accident/burst-pipe/find-valves
         * 应用于:天津生态城:关阀分析-关阀方案
         */
        async findValves($api: WDApi.AccidentApi, params: WDApi.FindBurstPipeValvesBatch) {
            try {
                const res = await $api.apiV1DomainWdAccidentBurstPipeFindValvesPost(params)
                logger.debug('查询阀门 res', res.data)
                return res.data
            } catch (error) {
                showError('API', 'findValves error', error)
                return []
            }
        },

        /**
         * 寻找爆管阀门
         * /api/v1/domain-wd/accident/burst-pipe/valves/list
         * 应用于:横琴项目:关阀分析
         */
        async findValvesList($api: WDApi.AccidentApi, params: WDApi.FindBurstPipeValvesInput) {
            try {
                const res = await $api.apiV1DomainWdAccidentBurstPipeValvesListPost(params)
                logger.debug('查询阀门 res', res.data)
                return res.data
            } catch (error) {
                showError('API', 'findValvesList error', error)
                return []
            }
        },

        /**
         * 获取阀门信息
         * /api/v1/domain-wd/accident/pipe/valves/list
         * 应用于:横琴项目:关阀分析
         */
        async getValvesList($api: WDApi.AccidentApi, params: WDApi.FindBurstPipeValvesInput) {
            try {
                const res = await $api.apiV1DomainWdAccidentPipeValvesListPost(params)
                logger.debug('查询阀门 res', res.data)
                return res.data
            } catch (error) {
                showError('API', 'getValvesList error', error)
                return []
            }
        },

        /**
         * 保存关阀信息
         * /api/v1/domain-wd/accident/close-valve/add
         * 应用于:横琴项目:关阀分析
         */
        async saveCloseValveInfo($api: WDApi.AccidentApi, params: WDApi.SaveCloseGisValveInput) {
            try {
                const res = await $api.apiV1DomainWdAccidentCloseValveAddPost(params)
                return res.data
            } catch (error) {
                showError('API', 'saveCloseValveInfo error', error)
                return 0
            }
        },

        /**
         * 根据方案id 查询关阀信息
         * /api/v1/domain-wd/accident/close-valve/list
         * 应用于:横琴项目:关阀分析
         */
        async getCloseValveListById($api: WDApi.AccidentApi, scenarioId: string) {
            try {
                const res = await $api.apiV1DomainWdAccidentCloseValveListGet(scenarioId)
                return res.data
            } catch (error) {
                showError('API', 'getCloseValveListById error', error)
                return []
            }
        },

        /**
         * 删除阀门
         * /api/v1/domain-wd/accident/close-valve/delete
         * 应用于:横琴项目:关阀分析
         */
        async deleteCloseValve($api: WDApi.AccidentApi, id: string[]) {
            try {
                const res = await $api.apiV1DomainWdAccidentCloseValveDeletePost(id)
                return res.data
            } catch (error) {
                showError('API', 'deleteCloseValve error', error)
                return false
            }
        },

        /**
         * 根据方案id删除阀门
         * /api/v1/domain-wd/accident/close-valve/delete-by-scenario
         * 应用于:横琴项目:关阀分析
         */
        async deleteCloseValveByScenarioId($api: WDApi.AccidentApi, scenarioId: string) {
            try {
                const res = await $api.apiV1DomainWdAccidentCloseValveDeleteByScenarioPost(
                    scenarioId,
                )
                return res.data
            } catch (error) {
                showError('API', 'deleteCloseValveByScenarioId error', error)
                return false
            }
        },

        /**
         * 保存水质事故信息
         * /api/v1/domain-wd/accident/wq-accident/add
         * 应用于:横琴项目:关阀分析
         */
        async saveWqAccidentInfo($api: WDApi.AccidentApi, params: WDApi.SaveWqAccidentInfoInput) {
            try {
                const res = await $api.apiV1DomainWdAccidentWqAccidentAddPost(params)
                return res.data
            } catch (error) {
                showError('API', 'saveWqAccidentInfo error', error)
                return false
            }
        },

        /**
         * 获取事故基本信息
         * /api/v1/domain-wd/accident/base-info
         * 应用于:天津项目:关阀分析
         */
        async getAccidentBaseInfo($api: WDApi.AccidentApi, scenarioId: string) {
            try {
                const res = await $api.apiV1DomainWdAccidentBaseInfoGet(scenarioId)
                return res.data
            } catch (error) {
                showError('API', 'getAccidentBaseInfo error', error)
                return {}
            }
        },

        /**
         * 删除事故基本信息
         * /api/v1/domain-wd/accident/base-info/delete
         * 应用于:横琴项目:关阀分析
         */
        async deleteAccidentBaseInfo($api: WDApi.AccidentApi, scenarioId: string) {
            try {
                const res = await $api.apiV1DomainWdAccidentBaseInfoDeleteGet(scenarioId)
                return res.data
            } catch (error) {
                showError('API', 'deleteAccidentBaseInfo error', error)
                return false
            }
        },
    },
})

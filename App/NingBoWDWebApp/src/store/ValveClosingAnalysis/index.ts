import { defineStore, getActivePinia } from 'pinia'
import { IState } from './type'
import * as ScenarioApi from '@dhicn/domain-paas-sdk-ts/scenario-service'
import { HourMinuteFormat01Result } from '@dhicn/helper/date-formatter'
import * as WDApi from '@dhicn/domain-paas-sdk-ts/wd-domain'
import { useAccidentApiStore } from 'dhi-dss-api-store/wd-domain'
import { cloneDeep } from 'lodash'

export const useValveClosingAnalysisStore = defineStore('valveClosingAnalysis', {
    state: (): IState => ({
        isMapEdit: false, // 地图可编辑
        valveInfo: {
            timeRange: [], // 关阀时间段
            pipeTableData: [], // 管网数据
            valveTableData: [], // 关阀数据
        },
        recordValveInfo: {
            timeRange: [], // 关阀时间段
            pipeTableData: [], // 管网数据
            valveTableData: [], // 关阀数据
        },
        editSubTag: false, // 关阀调度方案编辑
        hasSubScenario: false, // 是否有关阀调度方案
        activeValve: null, // 需要定位的阀门
    }),
    getters: {},
    actions: {
        /** 编辑-获得关阀方案信息-关阀时间段和管道列表
         * @param $api
         * @param scenarioId string
         */
        async getValveTimeRangeAndPipeData($api: WDApi.AccidentApi, scenarioId: string) {
            try {
                const store = useAccidentApiStore(getActivePinia())
                const res = await store.getAccidentBaseInfo($api, scenarioId)
                const events = res.events as WDApi.EventDetailInfo[]
                this.valveInfo.timeRange = [
                    // 格式化为 HH:mm
                    HourMinuteFormat01Result(events[0].startTime as string),
                    HourMinuteFormat01Result(events[0].endTime as string),
                ]
                this.valveInfo.beginTime = HourMinuteFormat01Result(events[0].startTime as string)
                this.valveInfo.endTime = HourMinuteFormat01Result(events[0].endTime as string)
                console.log('获得阀门信息-关阀时间段和管道列表', this.valveInfo.timeRange)
                this.valveInfo.pipeTableData = JSON.parse(events[0].location as string)
                this.recordValveInfo.timeRange = cloneDeep(this.valveInfo.timeRange)
                this.recordValveInfo.pipeTableData = cloneDeep(this.valveInfo.pipeTableData)
            } catch (error) {
                logger.error('API', 'getValveTimeRangeAndPipeData', error)
                return false
            }
        },

        /** 编辑-获得关阀方案信息- 阀门列表 */
        async getValveData($api: WDApi.AccidentApi, scenarioId: string) {
            try {
                const res = await $api.apiV1DomainWdAccidentCloseValveListGet(scenarioId)
                console.log('获得阀门信息-阀门列表', res.data)
                this.valveInfo.valveTableData = res.data
                this.recordValveInfo.valveTableData = cloneDeep(this.valveInfo.valveTableData)
            } catch (error) {
                logger.error('API', 'getValveData', error)
                return false
            }
        },

        /** 获得关阀调度方案列表
         * @param $api
         */
        async getValveClosingSubScenarioList(
            $api: ScenarioApi.ScenarioManagerApi,
            scenarioId: string,
        ) {
            try {
                const res = await $api.apiV2ScenarioManagerScenarioChildrenGet('2', scenarioId)
                // console.log('获得关阀调度方案列表 res', res.data)
                return res.data
            } catch (error) {
                logger.error('API', 'getValveClosingSubScenarioList error', error)
            }
        },
    },
})

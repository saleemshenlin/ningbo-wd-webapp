import { defineStore } from 'pinia'
import { ScheduleApiState } from './type'
import { showError } from '../../helper/showError'
import * as WDApi from '@dhicn/domain-paas-sdk-ts/wd-domain'
const StoreName = 'ScheduleApi'
export const useScheduleApiStore = defineStore(StoreName, {
    state: (): ScheduleApiState => ({}),
    actions: {
        /**
         * 获取Pattern 的列表
         * /api/v1/domain-wd/schedule/pattern/list
         * 应用于:横琴项目:预案调度编辑
         */
        async getPatternList($api: WDApi.ScheduleApi, itemTypes: string[], scenarioId: string) {
            try {
                const res = await $api.apiV1DomainWdSchedulePatternListGet(itemTypes, scenarioId)
                return res.data
            } catch (error) {
                showError('API', 'getPatternList', error)
                return []
            }
        },

        /**
         * 获取pattern 时序数据
         * /api/v1/domain-wd/schedule/pattern/timeseries
         * 应用于:横琴项目:预案调度编辑
         */
        async getPatternTimeseries(
            $api: WDApi.ScheduleApi,
            modelFeatureId: string[],
            scenarioId: string,
        ) {
            try {
                const res = await $api.apiV1DomainWdSchedulePatternTimeseriesGet(
                    modelFeatureId,
                    scenarioId,
                )
                return res.data
            } catch (error) {
                showError('API', 'getPatternTimeseries', error)
                return []
            }
        },

        /**
         * 更新Pattern 时间序列数据
         * /api/v1/domain-wd/schedule/pattern/timeseries/update
         * 应用于:横琴项目:预案调度编辑
         */
        async updatePatternTimeseries($api: WDApi.ScheduleApi, params: WDApi.UpdatePatternTsInput) {
            try {
                const res = await $api.apiV1DomainWdSchedulePatternTimeseriesUpdatePost(params)
                return res.data
            } catch (error) {
                showError('API', 'updatePatternTimeseries', error)
                return 0
            }
        },

        /**
         * 获取泵的列表
         * /api/v1/domain-wd/schedule/pump/list
         * 应用于:横琴项目:预案调度编辑
         */
        async getPumpList($api: WDApi.ScheduleApi, scenarioId: string) {
            try {
                const res = await $api.apiV1DomainWdSchedulePumpListGet(scenarioId)
                return res.data
            } catch (error) {
                showError('API', 'getPumpList', error)
                return []
            }
        },

        /**
         * 获取pump时序数据
         * /api/v1/domain-wd/schedule/pump/timeseries
         * 应用于:横琴项目:预案调度编辑
         */
        async getPumpTimeseries(
            $api: WDApi.ScheduleApi,
            modelFeatureId: string[],
            scenarioId: string,
        ) {
            try {
                const res = await $api.apiV1DomainWdSchedulePumpTimeseriesGet(
                    modelFeatureId,
                    scenarioId,
                )
                return res.data
            } catch (error) {
                showError('API', 'getPumpTimeseries', error)
                return []
            }
        },

        /**
         * 更新pump时序数据
         * /api/v1/domain-wd/schedule/pump/timeseries/update
         * 应用于:横琴项目:预案调度编辑
         */
        async updatePumpTimeseries($api: WDApi.ScheduleApi, params: WDApi.UpdateControlTsInput) {
            try {
                const res = await $api.apiV1DomainWdSchedulePumpTimeseriesUpdatePost(params)
                return res.data
            } catch (error) {
                showError('API', 'updatePumpTimeseries', error)
                return 0
            }
        },

        /**
         * 获取阀的列表
         * /api/v1/domain-wd/schedule/valve/list
         * 应用于:横琴项目:预案调度编辑
         */
        async getValveList($api: WDApi.ScheduleApi, scenarioId: string) {
            try {
                const res = await $api.apiV1DomainWdScheduleValveListGet(scenarioId)
                return res.data
            } catch (error) {
                showError('API', 'getValveList', error)
                return []
            }
        },

        /**
         * 获取阀时序数据
         * /api/v1/domain-wd/schedule/valve/timeseries
         * 应用于:横琴项目:预案调度编辑
         */
        async getValveTimeseries(
            $api: WDApi.ScheduleApi,
            modelFeatureId: string[],
            scenarioId: string,
        ) {
            try {
                const res = await $api.apiV1DomainWdScheduleValveTimeseriesGet(
                    modelFeatureId,
                    scenarioId,
                )
                return res.data
            } catch (error) {
                showError('API', 'getValveTimeseries', error)
                return []
            }
        },

        /**
         * 更新阀时序数据
         * /api/v1/domain-wd/schedule/valve/timeseries/update
         * 应用于:横琴项目:预案调度编辑
         */
        async updateValveTimeseries($api: WDApi.ScheduleApi, params: WDApi.UpdateControlTsInput) {
            try {
                const res = await $api.apiV1DomainWdScheduleValveTimeseriesUpdatePost(params)
                return res.data
            } catch (error) {
                showError('API', 'updateValveTimeseries', error)
                return 0
            }
        },

        /**
         * 获取curve 的列表
         * /api/v1/domain-wd/schedule/curve/list
         * 应用于:横琴项目:预案调度编辑
         */
        async getCurveList($api: WDApi.ScheduleApi, itemTypes: string[], scenarioId: string) {
            try {
                const res = await $api.apiV1DomainWdScheduleCurveListGet(itemTypes, scenarioId)
                return res.data
            } catch (error) {
                showError('API', 'getCurveList', error)
                return []
            }
        },

        /**
         * 获取curve 时序数据
         * /api/v1/domain-wd/schedule/curve/timeseries
         * 应用于:横琴项目:预案调度编辑
         */
        async getCurveTimeseries(
            $api: WDApi.ScheduleApi,
            modelFeatureId: string[],
            scenarioId: string,
        ) {
            try {
                const res = await $api.apiV1DomainWdScheduleCurveTimeseriesGet(
                    modelFeatureId,
                    scenarioId,
                )
                return res.data
            } catch (error) {
                showError('API', 'getCurveTimeseries', error)
                return []
            }
        },

        /**
         * 更新curve 时间序列数据
         * /api/v1/domain-wd/schedule/curve/timeseries/update
         * 应用于:横琴项目:预案调度编辑
         */
        async updateCurveTimeseries($api: WDApi.ScheduleApi, params: WDApi.UpdateCurveTsInput) {
            try {
                const res = await $api.apiV1DomainWdScheduleCurveTimeseriesUpdatePost(params)
                return res.data
            } catch (error) {
                showError('API', 'updateCurveTimeseries', error)
                return 0
            }
        },
    },
})

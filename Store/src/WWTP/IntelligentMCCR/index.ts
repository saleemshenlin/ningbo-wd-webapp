import { defineStore, StoreDefinition } from 'pinia'
import { MccrState } from './type'
import * as WwtpApi from '@dhicn/domain-paas-sdk-ts/wwtp-domain'
import { roundDownToFiveMinutes, minuteFormat01 } from '@dhicn/helper/date-formatter'
import { showError, logger } from '../../helper/showError'
import { dosingCategoryEnum } from '../IntelliDenitrification/config'
import dayjs from 'dayjs'

export const useDosingMccrStore = defineStore('wwtp-intelligent-mccr', {
    state: (): MccrState => ({
        feDosingParameterData: [], // 铁催化剂加药参数
        h2o2DosingParameterData: [], // 双氧水加药参数
        feAdditionRateData: {}, //
        h2o2AdditionRateData: {},
        catalysisBfData: [], // 催化反应前后的浊度、电导
        catalysisTankData: [], // 获取催化池的进水量、pH、ORP
        dosingStatisticDailysData: [], // 加药统计
    }),

    actions: {
        // 获取mccr控制参数
        async fetchMccrDosingParameter(
            $api: WwtpApi.IntelligentDenitrificationApi,
            data: {
                category: number
                productLine: string
            },
        ) {
            try {
                const { category, productLine } = data
                const res = await $api.apiIntelligentDenitrificationGetDosingParameterGet(
                    category,
                    productLine,
                )
                if (category === dosingCategoryEnum.Fe) {
                    this.feDosingParameterData = res.data ?? {}
                } else if (category === dosingCategoryEnum.H2O2) {
                    this.h2o2DosingParameterData = res.data ?? {}
                }
            } catch (error) {
                showError('API', 'fetchMccrDosingParameter error', error)
            }
        },
        /**
         *  获取药剂实际投加速率与计算投加速率
         * @param $api
         * @param productionLine
         */
        async fetchMccrDosingRateData(
            $api: WwtpApi.IntelligentMccrApi,
            data: {
                category: number
                productLine: string
            },
            days = 1,
        ) {
            try {
                const { category, productLine } = data
                const endTime = dayjs(roundDownToFiveMinutes(new Date())).format(minuteFormat01)
                const startTime = dayjs(
                    roundDownToFiveMinutes(dayjs().add(-days, 'days').toDate()),
                ).format(minuteFormat01)
                const res = await $api.apiV2IntelligentMccrAddRatesGet(
                    productLine,
                    category,
                    startTime,
                    endTime,
                )
                if (category === dosingCategoryEnum.Fe) {
                    this.feAdditionRateData = res.data ?? {}
                } else if (category === dosingCategoryEnum.H2O2) {
                    this.h2o2AdditionRateData = res.data ?? {}
                }
            } catch (error) {
                showError('API', 'fetchMccrDosingRateData error', error)
            }
        },
        /**
         * 获取催化反应前后的浊度、电导
         * @param $api
         * @param productLine
         */
        async fetchMccrTurbidityConductivityData(
            $api: WwtpApi.IntelligentMccrApi,
            productLine: string,
            days = 1,
        ) {
            try {
                const endTime = dayjs(roundDownToFiveMinutes(new Date())).format(minuteFormat01)
                const startTime = dayjs(
                    roundDownToFiveMinutes(dayjs().add(-days, 'days').toDate()),
                ).format(minuteFormat01)
                const res = await $api.apiV2IntelligentMccrCatalysisBeforeAfterGet(
                    productLine,
                    startTime,
                    endTime,
                )
                this.catalysisBfData = res.data ?? []
            } catch (error) {
                showError('API', 'fetchMccrTurbidityConductivityData error', error)
            }
        },
        /**
         * 获取催化池的进水量、pH、ORP
         * @param $api
         * @param productLine
         */
        async fetchMccrInflowData($api: WwtpApi.IntelligentMccrApi, productLine: string, days = 1) {
            try {
                const endTime = dayjs(roundDownToFiveMinutes(new Date())).format(minuteFormat01)
                const startTime = dayjs(
                    roundDownToFiveMinutes(dayjs().add(-days, 'days').toDate()),
                ).format(minuteFormat01)
                const res = await $api.apiV2IntelligentMccrCatalysisTankDataGet(
                    productLine,
                    startTime,
                    endTime,
                )
                this.catalysisTankData = res.data ?? []
                logger.debug('fetchMccrInflowData>>>', productLine, this.catalysisTankData)
            } catch (error) {
                showError('API', 'fetchMccrInflowData error', error)
            }
        },
        /**
         * 获得加药报表
         */
        async getDosingLog(
            $api: WwtpApi.IntelligentDenitrificationApi,
            category: number,
            productLine: string,
            start: string,
            end: string,
        ) {
            try {
                const endTime = dayjs(roundDownToFiveMinutes(end)).format(minuteFormat01)
                const startTime = dayjs(roundDownToFiveMinutes(start)).format(minuteFormat01)
                const res = await $api.apiIntelligentDenitrificationGetDosingLogGet(
                    category,
                    productLine,
                    startTime,
                    endTime,
                )
                logger.debug('getDosingLog>>>', category, productLine, res.data)
                return res.data
            } catch (error) {
                showError('API', 'getDosingLog error', error)
            }
        },
        /**
         * 下载加药报表
         * @param $api
         * @param productionLine
         * @param startTime
         * @param endTime
         * @param downloadKey
         */
        async downloadMcrrDosingLog(
            $api: WwtpApi.IntelligentMccrApi,
            productionLine: string,
            startTime: string,
            endTime: string,
        ) {
            try {
                return await $api.apiV2IntelligentMccrDosingLogExportGet(
                    productionLine,
                    startTime,
                    endTime,
                    { responseType: 'blob' },
                )
            } catch (error) {
                showError('API', 'downloadMcrrDosingLog error', error)
                return ''
            }
        },
        /**
         * 获得加药统计数据
         * @param $api
         * @param productionLine
         * @param startTime
         * @param endTime
         */
        async fetchMcrrDosingStatisticDailys(
            $api: WwtpApi.IntelligentMccrApi,
            startTime: string,
            endTime: string,
            productionLine: string,
        ) {
            try {
                const res = await $api.apiV2IntelligentMccrDailyStatisticsGet(
                    productionLine,
                    startTime,
                    endTime,
                )
                this.dosingStatisticDailysData = res.data ?? []
                logger.debug(
                    'fetchMcrrDosingStatisticDailys>>>',
                    productionLine,
                    this.dosingStatisticDailysData,
                )
            } catch (error) {
                showError('API', 'fetchMcrrDosingStatisticDailys error', error)
            }
        },
        /**
         * 下载加药统计
         * @param $api
         * @param productionLine
         * @param startTime
         * @param endTime
         */
        async downloadMcrrDosingStatisticDailys(
            $api: WwtpApi.IntelligentMccrApi,
            productionLine: string,
            startTime: string,
            endTime: string,
        ) {
            try {
                return await $api.apiV2IntelligentMccrDailyStatisticsExportGet(
                    productionLine,
                    startTime,
                    endTime,
                    { responseType: 'blob' },
                )
            } catch (error) {
                showError('API', 'downloadMcrrDosingStatisticDailys error', error)
            }
        },
    },
}) as unknown as StoreDefinition

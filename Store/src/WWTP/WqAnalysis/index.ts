import { showError } from '../../helper/showError'
import { minuteFormat01, roundDownToFiveMinutes } from '@dhicn/helper/date-formatter'
import dayjs from 'dayjs'
import * as WwtpApi from '@dhicn/domain-paas-sdk-ts/wwtp-domain'
import { WqAnalysisState } from './type'
import { defineStore } from 'pinia'

export const useWqAnalysisStore = defineStore('wwtp-wq-analysis', {
    state: (): WqAnalysisState => ({
        wqEntireProcessData: [],
        wqMicroOrganismData: [],
        wqOnlinePointData: [], // 水质输入点位信息
    }),
    actions: {
        /**
         * 获取水质模拟预测分析中，水质全流程统计结果数据
         * @param $api
         * @param data modelName: 模型名称
                       productLine: 工艺线
         */
        async getEntireProcessData(
            $api: WwtpApi.WQAnalysisApi,
            data: { modelName: string; productLine: string },
            days = 1,
        ) {
            const endTime = dayjs(roundDownToFiveMinutes(new Date())).format(minuteFormat01)
            const startTime = dayjs(
                roundDownToFiveMinutes(dayjs().add(-days, 'days').toDate()),
            ).format(minuteFormat01)
            const { modelName, productLine } = data
            try {
                const fetchRep = await $api.apiV2WqAnalysisEntireProcessGet(
                    startTime,
                    endTime,
                    modelName,
                    productLine,
                )
                this.wqEntireProcessData = fetchRep.data ?? {}
                // return this.wqEntireProcessData
            } catch (error) {
                showError('API', 'getEntireProcessData error', error)
            }
        },
        /**
         *
         * @param $api
         * @param data modelName: 模型名称
                       productLine: 工艺线
         */
        async getMicroOrganismData(
            $api: WwtpApi.WQAnalysisApi,
            data: { modelName: string; productLine: string },
            days = 1,
        ) {
            const endTime = dayjs(roundDownToFiveMinutes(new Date())).format(minuteFormat01)
            const startTime = dayjs(
                roundDownToFiveMinutes(dayjs().add(-days, 'days').toDate()),
            ).format(minuteFormat01)
            const { modelName, productLine } = data
            try {
                const fetchRep = await $api.v2WqAnalysisMicroOrganismGet(
                    startTime,
                    endTime,
                    modelName,
                    productLine,
                )
                this.wqMicroOrganismData = fetchRep.data ?? {}
            } catch (error) {
                showError('API', 'getMicroOrganismData error', error)
            }
        },
        /**
         * 获取优化建议
         * 查询特定工艺线下的水质输入点位信息
         * @param $api
         * @param data { productLine: 工艺线
                         modelName: 模型名称 }
         * @returns
         */
        async getWqOnlinePoints(
            $api: WwtpApi.WQAnalysisApi,
            data: {
                productLine: string
                modelName: string
            },
        ) {
            const { productLine, modelName } = data
            try {
                const fetchRep = await $api.apiV2WqAnalysisWqOnlinePointsGet(modelName)
                return fetchRep.data ?? []
            } catch (error) {
                showError('API', 'getWqOnlinePoints error', error)
                return []
            }
        },
        /**
         * 
         * @param $api 
         * @param data   { productLine: 工艺线
                         modelName: 模型名称 }
         */
        async getWqControlOnlinePoints(
            $api: WwtpApi.WQAnalysisApi,
            data: {
                productLine: string
                modelName: string
            },
        ) {
            const { productLine, modelName } = data
            try {
                const fetchRep = await $api.apiV2WqAnalysisControlOnlinePointsGet(
                    modelName,
                    productLine,
                )
                return fetchRep.data ?? {}
            } catch (error) {
                showError('API', 'getWqControlOnlinePoints error', error)
            }
        },
        /**
         * 查询水质在线点位时间序列数据
         * @param $api
         * @param pointCodes 在线点位列表
         * @param days  前2天（48h）
         */
        async getWqAnalysisWqOnlineData(
            $api: WwtpApi.WQAnalysisApi,
            pointCodes: string[],
            days = 2,
        ) {
            try {
                const isoEndTime = dayjs(roundDownToFiveMinutes(new Date())).toISOString()
                const isoStartTime = dayjs(
                    roundDownToFiveMinutes(dayjs().add(-days, 'days').toDate()),
                ).toISOString()
                const fetchRep = await $api.apiV2WqAnalysisWqOnlineDataPost({
                    startTime: isoStartTime,
                    endTime: isoEndTime,
                    pointCodes,
                })
                return fetchRep.data ?? []
            } catch (error) {
                showError('API', 'getWqAnalysisWqOnlineData error', error)
                return []
            }
        },
        /**
         * 更新进出水质
         * @param $api
         * @param data
         * @returns
         */
        async updateWqInputData(
            $api: WwtpApi.WQAnalysisApi,
            data: WwtpApi.UpdateWqInputDataInput[],
        ) {
            try {
                const fetchRep = await $api.apiWQAnalysisUpdateWQInputDataPost(data)
                return fetchRep.data as unknown as boolean
            } catch (error) {
                showError('API', 'getWqAnalysisWqOnlineData error', error)
                return false
            }
        },
    },
})

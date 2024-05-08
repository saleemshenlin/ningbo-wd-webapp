import { IntelligentDenitrificationState } from './type'
import { defineStore, StoreDefinition } from 'pinia'
import * as WwtpApi from '@dhicn/domain-paas-sdk-ts/wwtp-domain'
import { showError, logger } from '../../helper/showError'
import { roundDownToFiveMinutes, minuteFormat01 } from '@dhicn/helper/date-formatter'
import dayjs from 'dayjs'

export const useIdDosingStore = defineStore('wwtp-intelligent-denitrification', {
    state: (): IntelligentDenitrificationState => ({
        idDosingParameterData: [], // 加药参数
        abftProcessStatusData: [], // 运行状态
        cdAdditionRateData: {}, // 碳源投加速率
        denitrificationRate: {}, // 反硝化速率
        anoxicNO3Data: {}, // 缺氧区出水硝酸盐氮
        inletLoadData: [], // 进水负荷
        inletLoadDatas: {}, // 进水总氮
        DosingLogData: {}, // 加药报表
        DosingStatisticDailysData: [], // 加药统计
    }),
    getters: {},
    actions: {
        /**
         * 根据工艺线，类别查询加药参数
         * 获取加药参数
         * /api/IntelligentDenitrification/GetDosingParameter
         * @param $api
         * @param data category:类别 CD/PAC
         *             productionLineCode:产线编号
         */
        async getDosingParameter(
            $api: WwtpApi.IntelligentDenitrificationApi,
            data: {
                category: number
                productLine: string
            },
        ) {
            try {
                const { category, productLine } = data
                const fetchRep = await $api.apiIntelligentDenitrificationGetDosingParameterGet(
                    category,
                    productLine,
                )
                this.idDosingParameterData = fetchRep.data ?? {}
                return fetchRep.data ?? {}
            } catch (error) {
                showError('API', 'getDosingParameter error', error)
                return {}
            }
        },
        /**
         * 更新加药参数
         * @param $api
         * @param data 加药参数
         * @returns
         */
        async saveDosingParameter(
            $api: WwtpApi.IntelligentDenitrificationApi,
            data: WwtpApi.DosingParamSettingDto[],
        ) {
            try {
                const fetchRep = await $api.apiIntelligentDenitrificationSaveDosingParameterPost(
                    data,
                )
                logger.debug('保存', fetchRep.data)
                return fetchRep.data
            } catch (error) {
                showError('API', 'saveDosingParameter error', error)
            }
        },
        /**
         * 获取当前时刻生化池运行状态
         * @param $api
         * @param productLine 产线编号
         */
        async getABFTProcessStatus(
            $api: WwtpApi.IntelligentDenitrificationApi,
            productLine: string,
            hours = 2,
        ) {
            try {
                const endTime = dayjs(roundDownToFiveMinutes(new Date())).format(minuteFormat01)
                const startTime = dayjs(
                    roundDownToFiveMinutes(dayjs().add(-hours, 'hours').toDate()),
                ).format(minuteFormat01)
                const fetchRep = await $api.apiIntelligentDenitrificationGetABFTProcessStatusGet(
                    productLine,
                    startTime,
                    endTime,
                )
                this.abftProcessStatusData = fetchRep.data ?? {}
            } catch (error) {
                showError('API', 'getABFTProcessStatus error', error)
            }
        },
        /**
         * 获取碳源投加速率
         * @param $api
         * @param productLine 产线编号
         */
        async getCDAdditionRate(
            $api: WwtpApi.IntelligentDenitrificationApi,
            productLine: string,
            days = 1,
        ) {
            try {
                const endTime = dayjs(roundDownToFiveMinutes(new Date())).format(minuteFormat01)
                const startTime = dayjs(
                    roundDownToFiveMinutes(dayjs().add(-days, 'days').toDate()),
                ).format(minuteFormat01)
                const fetchRep = await $api.apiIntelligentDenitrificationGetCDAdditionRateGet(
                    productLine,
                    startTime,
                    endTime,
                )
                this.cdAdditionRateData = fetchRep.data ?? {}
            } catch (error) {
                showError('API', 'getCDAdditionRate error', error)
            }
        },
        /**
         * 获取反硝化速率
         * @param $api
         * @param productLine 产线编号
         */
        async getDenitrificationRate(
            $api: WwtpApi.IntelligentDenitrificationApi,
            productLine: string,
            days = 1,
        ) {
            try {
                const endTime = dayjs(roundDownToFiveMinutes(new Date())).format(minuteFormat01)
                const startTime = dayjs(
                    roundDownToFiveMinutes(dayjs().add(-days, 'days').toDate()),
                ).format(minuteFormat01)
                const fetchRep = await $api.apiIntelligentDenitrificationGetDenitrificationRateGet(
                    productLine,
                    startTime,
                    endTime,
                )
                this.denitrificationRate = fetchRep.data ?? {}
            } catch (error) {
                showError('API', 'getDenitrificationRate error', error)
            }
        },
        /**
         * 获取缺氧区出水硝酸盐氮
         * @param $api
         * @param productLine 产线编号
         */
        async getAnoxicNO3(
            $api: WwtpApi.IntelligentDenitrificationApi,
            productLine: string,
            days = 1,
        ) {
            try {
                const endTime = dayjs(roundDownToFiveMinutes(new Date())).format(minuteFormat01)
                const startTime = dayjs(
                    roundDownToFiveMinutes(dayjs().add(-days, 'days').toDate()),
                ).format(minuteFormat01)
                const fetchRep = await $api.apiIntelligentDenitrificationGetAnoxicNO3Get(
                    productLine,
                    startTime,
                    endTime,
                )
                this.anoxicNO3Data = fetchRep.data ?? {}
            } catch (error) {
                showError('API', 'getAnoxicNO3 error', error)
            }
        },
        /**
         * 获取进水负荷
         * @param $api
         * @param productLine 产线编号
         */
        async getInletLoad(
            $api: WwtpApi.IntelligentDenitrificationApi,
            productLine: string,
            days = 1,
        ) {
            try {
                const endTime = dayjs(roundDownToFiveMinutes(new Date())).format(minuteFormat01)
                const startTime = dayjs(
                    roundDownToFiveMinutes(dayjs().add(-days, 'days').toDate()),
                ).format(minuteFormat01)
                const fetchRep = await $api.apiIntelligentDenitrificationGetInletLoadGet(
                    productLine,
                    startTime,
                    endTime,
                )
                this.inletLoadData = fetchRep.data ?? {}
            } catch (error) {
                showError('API', 'getInletLoad error', error)
            }
        },
        /**
         * 获取出水总氮
         * @param $api
         */
        async getOutletTN($api: WwtpApi.IntelligentDenitrificationApi, days = 1) {
            try {
                const endTime = dayjs(roundDownToFiveMinutes(new Date())).format(minuteFormat01)
                const startTime = dayjs(
                    roundDownToFiveMinutes(dayjs().add(-days, 'days').toDate()),
                ).format(minuteFormat01)
                const fetchRep = await $api.apiIntelligentDenitrificationGetOutletTNGet(
                    startTime,
                    endTime,
                )
                this.inletLoadDatas = fetchRep.data ?? {}
            } catch (error) {
                showError('API', 'getOutletTN error', error)
            }
        },
        /**
         * 加药报表查询
         * @param $api
         * @param category 加药类型：CD/PAC
         * @param productLine 产线
         * @param start 开始时间
         * @param end 结束时间
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
                const fetchRep = await $api.apiIntelligentDenitrificationGetDosingLogGet(
                    category,
                    productLine,
                    startTime,
                    endTime,
                )
                this.DosingLogData = fetchRep.data ?? {}
            } catch (error) {
                showError('API', 'getDosingLog error', error)
            }
        },
        /**
         * 加药报表下载
         * @param $api
         * @param category 加药类型：CD/PAC
         * @param productLine 产线
         * @param startTime 开始时间
         * @param endTime 结束时间
         * @param downloadKey 下载key
         * @returns
         */
        async downloadDosingLog(
            $api: WwtpApi.IntelligentDenitrificationApi,
            category: number,
            productLine: string,
            startTime: string,
            endTime: string,
            downloadKey: string,
        ) {
            try {
                return await $api.apiIntelligentDenitrificationDownloadDosingLogGet(
                    category,
                    productLine,
                    startTime,
                    endTime,
                    downloadKey,
                    { responseType: 'blob' },
                )
            } catch (error) {
                showError('API', 'downloadDosingLog error', error)
            }
        },
        /**
         * 加药统计
         * @param $api
         * @param category 类别
         * @param startTime 开始时间
         * @param endTime 结束时间
         */
        async getDosingStatisticDailys(
            $api: WwtpApi.IntelligentDenitrificationApi,
            category: number,
            startTime: string,
            endTime: string,
        ) {
            try {
                const fetchRep =
                    await $api.apiIntelligentDenitrificationGetDosingStatisticDailysGet(
                        category,
                        startTime,
                        endTime,
                    )
                this.DosingStatisticDailysData = fetchRep.data ?? {}
            } catch (error) {
                showError('API', 'getDosingStatisticDailys error', error)
            }
        },
        /**
         * 加药统计文件下载
         * @param $api
         * @param category 加药类型：CD/PAC
         * @param startTime 开始时间
         * @param endTime 结束时间
         * @param downloadKey 下载key
         * @returns
         */
        async downloadDosingStatisticDaily(
            $api: WwtpApi.IntelligentDenitrificationApi,
            category: number,
            startTime: string,
            endTime: string,
            downloadKey: string,
        ) {
            try {
                return await $api.apiIntelligentDenitrificationDownloadDosingStatisticDailyGet(
                    category,
                    startTime,
                    endTime,
                    downloadKey,
                    { responseType: 'blob' },
                )
            } catch (error) {
                showError('API', 'downloadDosingStatisticDaily error', error)
            }
        },
    },
}) as unknown as StoreDefinition

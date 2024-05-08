import dayjs from 'dayjs'
import { showError } from '../helper/showError'
import {
    SecondFormat01,
    minuteFormat01,
    roundDownToFiveMinutes,
} from '@dhicn/helper/date-formatter'
import * as WwtpApi from '@dhicn/domain-paas-sdk-ts/wwtp-domain'
import * as WwtpInfrastructureApi from '@dhicn/domain-paas-sdk-ts/wwtp-infrastructure'
import { WWTPState } from './type'
import { defineStore } from 'pinia'
import { ProductLineMccrFilter } from './IntelliDenitrification/config'

export const useWWTPStore = defineStore('wwtp-service', {
    state: (): WWTPState => ({
        dateNowTime: dayjs(new Date()).format(SecondFormat01), // 当前时间(接口请求时间)
        productLines: {},
        inWQData: [],
        outWQData: [],
        chemicalCostList: [],
        entireProcessTSDataset: [],
        dataBoards: [], // 数据看板数据
        waterInData: [], // 进水水质预警数据
        waterOutData: [], // 模拟出水预警数据
        toxicAlarmData: [], // 毒性预警数据
        modelPrecision: [], // 模型精度
        deviceMaintenance: [], // 仪表信息（设备保养信息）
        optimOutData: {}, // 优化建议
        hydroEnergyCostList: [], //水能耗
    }),
    getters: {
        productLinesMccr(state: WWTPState) {
            return (scenarioName: string): WwtpInfrastructureApi.BaseProductLineInOut[] => {
                return state.productLines[scenarioName].filter(
                    (item) => item.dosageCategory === ProductLineMccrFilter,
                )
            }
        },
    },
    actions: {
        /**
         * 获取所有产线根据模型名称
         * /api/Base/GetAllBaseProductLineByModel
         * @param $api
         * @param modelName 模型名称
         * @returns
         */
        async fetchProductLine($api: WwtpInfrastructureApi.BaseApi, modelName: string) {
            try {
                const fetchRep = await $api.apiBaseGetAllBaseProductLineByModelGet(modelName)
                this.productLines[modelName] = fetchRep.data
                return fetchRep.data
            } catch (error) {
                showError('API', 'fetchProductLine', error)
            }
        },
        /**
         * 查询进水水质数据
         * @param $api
         * @param modelName 模型名称
         * @param productLine 工艺线编码
         * @returns
         */
        async GetInletWQ(
            $api: WwtpApi.GeneralDataApi,
            modelName: string,
            productLine: string,
            days = 1,
        ) {
            try {
                const endTime = dayjs(new Date()).format(minuteFormat01)
                const startTime = dayjs(new Date()).add(-days, 'day').format(minuteFormat01)
                const fetchRep = await $api.apiGeneralDataGetInletWQGet(
                    startTime,
                    endTime,
                    modelName,
                    productLine,
                )
                this.inWQData = fetchRep.data
                return fetchRep.data
            } catch (error) {
                showError('API', 'GetInletWQ', error)
            }
        },
        /**
         * 查询出水水质数据
         * @param $api
         * @param modelName 模型名称
         * @returns
         */
        async GetOutletWQ($api: WwtpApi.GeneralDataApi, modelName: string, days = 1) {
            try {
                const endTime = dayjs(new Date()).format(minuteFormat01)
                const startTime = dayjs(new Date()).add(-days, 'day').format(minuteFormat01)
                const fetchRep = await $api.apiGeneralDataGetOutletWQGet(
                    startTime,
                    endTime,
                    modelName,
                )
                this.outWQData = fetchRep.data
                return fetchRep.data
            } catch (error) {
                showError('API', 'GetOutletWQ', error)
            }
        },
        /**
         * 加药吨水能耗,前7天
         * @param $api
         * @param modelName 模型名称
         */
        async fetchChemicalCost($api: WwtpApi.GeneralDataApi, modelName: string) {
            try {
                // const endTime = format(new Date(), DayFormat01)
                // const startTime = format(addDays(new Date(), -days), DayFormat01)
                const fetchRep = await $api.apiV2OutputChemicalCostGet(
                    // startTime,
                    // endTime,
                    modelName,
                )
                this.chemicalCostList = fetchRep.data
            } catch (error) {
                showError('API', 'fetchChemicalCost error', error)
            }
        },

        /**
         * 查询吨水能耗统计信息
         * /api/v2/output/energy-cost
         */
        async fetchHydroEnergyCostData($api: WwtpApi.GeneralDataApi, modelName: string) {
            try {
                const res = await $api.apiV2OutputEnergyCostGet(modelName)
                this.hydroEnergyCostList = res.data
            } catch (error: any) {
                showError('API', 'fetchEnergyCostData', error)
            }
        },

        /**
         * 根据工艺线查询各水质指标时间序列数据,前1天
         * @param $api
         * @param modelName 模型名称
         * @param line 工艺线
         */
        async fetchEntireProcessTSByLine(
            $api: WwtpApi.GeneralDataApi,
            modelName: string,
            line: string,
            days = 1,
        ) {
            try {
                const endTime = dayjs(new Date()).format(minuteFormat01)
                const startTime = dayjs(new Date()).add(-days, 'day').format(minuteFormat01)
                const fetchRep = await $api.apiV2OutputEntireProcessTsByProductlineGet(
                    line,
                    startTime,
                    endTime,
                    modelName,
                )
                this.entireProcessTSDataset = fetchRep.data
            } catch (error) {
                showError('API', 'fetchEntireProcessTSByLine error', error)
            }
        },
        /**
         * 获取数据看板数据
         * @param $api
         */
        async fetchDataBoards($api: WwtpApi.GeneralDataApi) {
            try {
                const fetchRep = await $api.apiV2OutputDataBoardsGet()
                this.dataBoards = fetchRep.data
            } catch (error) {
                showError('API', 'fetchDataBoards error', error)
            }
        },
        /**
         * 进出水预警信息
         * @param $api
         * @param alarmType 进水水质0，模拟出水2
         * @param days 时间 ，默认出水：后2天
         * @returns
         */
        async getPredictAlarmData($api: WwtpApi.GeneralDataApi, alarmType: number, days = 2) {
            try {
                const endTime = dayjs(roundDownToFiveMinutes(new Date())).format(minuteFormat01)
                const startTime = dayjs(roundDownToFiveMinutes(new Date()))
                    .add(days, 'day')
                    .format(minuteFormat01)
                let start = startTime
                let end = endTime
                if (days > 0) {
                    start = endTime
                    end = startTime
                }
                const fetchRep = await $api.apiGeneralDataGetPredictAlarmGet(
                    start,
                    end,
                    [`${alarmType}`],
                    undefined, // 是否获取国标
                )
                return fetchRep.data ?? []
            } catch (error) {
                showError('API', 'getPredictAlarmData error', error)
            }
        },
        /**
         * 毒性预警信息
         * @param $api
         * @param days 前2天 （48h）
         */
        async getToxicAlarmData($api: WwtpApi.ToxicityMonitorApi, days = 2) {
            try {
                const endTime = dayjs(roundDownToFiveMinutes(new Date())).format(minuteFormat01)
                const startTime = dayjs(
                    roundDownToFiveMinutes(dayjs().add(-days, 'day').toDate()),
                ).format(minuteFormat01)
                const fetchRep = await $api.apiV2OutputToxicAlarmsGet(startTime, endTime)
                this.toxicAlarmData = fetchRep.data ?? []
            } catch (error) {
                showError('API', 'getToxicAlarmData error', error)
            }
        },
        /**
         *
         * @param $api
         * @param modelName 模型名称
         * @param days 前2天（48h）
         * @returns
         */
        async getModelPrecision($api: WwtpApi.GeneralDataApi, modelName: string, days = 2) {
            try {
                const endTime = dayjs(roundDownToFiveMinutes(new Date())).format(minuteFormat01)
                const startTime = dayjs(
                    roundDownToFiveMinutes(dayjs().add(-days, 'day').toDate()),
                ).format(minuteFormat01)
                const fetchRep = await $api.apiGeneralDataGetModelPrecisionGet(
                    startTime,
                    endTime,
                    modelName,
                )
                this.modelPrecision = fetchRep.data ?? []
            } catch (error) {
                showError('API', 'getModelPrecision error', error)
            }
        },
        /**
         * 获取仪表信息（设备保养信息）
         * @param $api
         * @param hours 前1h（1h）
         * @returns
         */
        async getDeviceMaintenanceData($api: WwtpApi.GeneralDataApi, hours = 1) {
            try {
                const endTime = dayjs(roundDownToFiveMinutes(new Date())).format(minuteFormat01)
                const startTime = dayjs(
                    roundDownToFiveMinutes(dayjs().add(-hours, 'hours').toDate()),
                ).format(minuteFormat01)
                const fetchRep = await $api.apiV2OutputDeviceMaintenanceGet(startTime, endTime)
                this.deviceMaintenance = fetchRep.data ?? []
            } catch (error) {
                showError('API', 'getDeviceMaintenanceData error', error)
            }
        },
        /**
         * 获取优化建议
         * @param $api
         * @param data { productLine: 工艺线
                         modelName: 模型名称⚠️注意： 这里是在线滚动优化模型的模型名称}
         * @param days 前1天（24h）
         * @returns
         */
        async getOptimOutData(
            $api: WwtpApi.GeneralDataApi,
            data: {
                productLine: string
                modelName: string
            },
            days = 1,
        ) {
            const { productLine, modelName } = data
            try {
                const endTime = dayjs(roundDownToFiveMinutes(new Date())).format(minuteFormat01)
                const startTime = dayjs(
                    roundDownToFiveMinutes(dayjs().add(-days, 'days').toDate()),
                ).format(minuteFormat01)
                this.dateNowTime = endTime
                const fetchRep = await $api.apiGeneralDataGetOptimOutDataGet(
                    startTime,
                    endTime,
                    productLine,
                    modelName,
                )
                this.optimOutData = fetchRep.data ?? {}
            } catch (error) {
                showError('API', 'getOptimOutData error', error)
            }
        },
    },
})

export * from './HistoryData/index'
export * from './InstrumentMaintenance/index'
export * from './IntelliDenitrification/index'
export * from './IntelliDenitrification/config'
export * from './IntelligentMCCR/index'
export * from './SimulationLab/index'
export * from './SimulationLab/type'
export * from './SimulationLab/config'
export * from './SystemConfig/index'
export * from './SystemConfig/type'
export * from './ToxicityMonitor/index'
export * from './ToxicityMonitor/type'
export * from './WqAnalysis'
export * from './index'
export * from './AerationControl/index'
export * from './AerationControl/type'

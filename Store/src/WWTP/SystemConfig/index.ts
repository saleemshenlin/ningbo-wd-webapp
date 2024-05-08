import { showError } from '../../helper/showError'
import * as WwtpApi from '@dhicn/domain-paas-sdk-ts/wwtp-domain'
import { AlarmApi, ModelConfigApi } from '@dhicn/domain-paas-sdk-ts/wwtp-infrastructure'
import { defineStore } from 'pinia'
import {
    SysConfigState,
    AlarmConfigInOut,
    ProcessedSettingDto,
    InletAlarmInput,
    ModifyModelParaInput,
    WqSimIndicatorInput,
    UpdateSysStatisticConfigsInput,
} from './type'

export const useSysConfig = defineStore('wwtp-system-config', {
    state: (): SysConfigState => ({
        test: '',
    }),
    actions: {
        /**
         * 查询全部预警配置信息
         * NodeType为0代表出水点预警配置；NodeType为2代表加药量预警配置
         * Grade代表预警等级，grade为0代表预警阈值，grade为1代表尾水标准
         * @param $api
         */
        async getAllAlarmConfigs($api: AlarmApi) {
            try {
                const res = await $api.apiAlarmGetAllAlarmConfigsGet()
                return res.data ?? []
            } catch (error) {
                showError('API', 'getAllAlarmConfigs', error)
                return []
            }
        },
        /**
         * 根据进水点查询进水预警配置信息
         * @param $api
         * @param data
         */
        async getInletAlarmConfig($api: WwtpApi.SystemSettingApi, data: InletAlarmInput) {
            try {
                const { inlet, modelName } = data
                const res = await $api.apiV2SystemSettingInletAlarmConfigGet(inlet, modelName)
                return res.data ?? []
            } catch (error) {
                showError('API', 'getInletAlarmConfig', error)
                return []
            }
        },
        /**
         * 更新预警配置信息(适用于出水、进水、加药)
         * @param $api
         * @param data
         */
        async updateAlarmConfigs($api: AlarmApi, data: AlarmConfigInOut[]) {
            try {
                const res = await $api.apiAlarmUpdateAlarmConfigsPost(data)
                return res.data as unknown as boolean
            } catch (error) {
                showError('API', 'updateAlarmConfigs', error)
                return false
            }
        },
        /**
         * 查询清洗算法默认值配置信息
         * @param $api
         */
        async getAllProcessedSettings($api: WwtpApi.SystemSettingApi) {
            try {
                const res = await $api.apiSystemSettingGetAllProcessedSettingsGet()
                return res.data ?? []
            } catch (error) {
                showError('API', 'getAllProcessedSettings', error)
                return []
            }
        },
        /**
         * 更新清洗算法默认值配置信息
         * @param $api
         * @param data
         */
        async updateProcessedSettings($api: WwtpApi.SystemSettingApi, data: ProcessedSettingDto[]) {
            try {
                const res = await $api.apiSystemSettingUpdateProcessedSettingsPost(data)
                return res.data as unknown as boolean
            } catch (error) {
                showError('API', 'updateProcessedSettings', error)
                return false
            }
        },
        /**
         * 进水水质组分比例设置查询
         * @param $api
         * @param data
         */
        async getInletParameters($api: WwtpApi.SystemSettingApi, data: InletAlarmInput) {
            try {
                const { inlet, modelName } = data
                const res = await $api.apiV2SystemSettingInletParametersGet(inlet, modelName)
                return res.data ?? []
            } catch (error) {
                showError('API', 'getInletParameters', error)
                return []
            }
        },

        /**
         * 更新进水组分参数信息
         * @param $api
         * @param data
         */
        async updateModelPara($api: ModelConfigApi, data: ModifyModelParaInput[]) {
            try {
                const res = await $api.apiV2CodeConfigModelParaModifyValuesPost(data)
                return res.data as unknown as boolean
            } catch (error) {
                showError('API', 'updateModelPara', error)
                return false
            }
        },
        /**
         * 水质模拟预测点位配置查询
         * @param $api
         */
        async getSimIndicators($api: WwtpApi.SystemSettingApi) {
            try {
                const res = await $api.apiV2SystemSettingWqSimulationIndicatorsGet()
                return res.data ?? []
            } catch (error) {
                showError('API', 'getSimIndicators', error)
                return []
            }
        },
        /**
         * 更新水质模拟预测分析对应的指标配置信息
         * @param $api
         * @param data
         */
        async updateSimIndicators($api: WwtpApi.SystemSettingApi, data: WqSimIndicatorInput[]) {
            try {
                const res = await $api.apiV2SystemSettingWqSimulationIndicatorsUpdatePost(data)
                return res.data as unknown as boolean
            } catch (error) {
                showError('API', 'updateSimIndicators', error)
                return false
            }
        },
        /**
         * 首页看板数据配置
         * @param $api
         */
        async getStatisticConfigs($api: WwtpApi.MainBusConfigApi) {
            try {
                const res = await $api.apiMainBusConfigGetAllSysStatisticConfigsGet()
                return res.data ?? []
            } catch (error) {
                showError('API', 'getStatisticConfigs', error)
                return []
            }
        },
        /**
         * 更新首页看板数据配置
         * @param $api
         * @param data
         */
        async updateStatisticConfigs(
            $api: WwtpApi.MainBusConfigApi,
            data: UpdateSysStatisticConfigsInput[],
        ) {
            try {
                const res = await $api.apiMainBusConfigUpdateSysStatisticConfigsPost(data)
                return res.data as unknown as boolean
            } catch (error) {
                showError('API', 'updateStatisticConfigs', error)
                return false
            }
        },
    },
})

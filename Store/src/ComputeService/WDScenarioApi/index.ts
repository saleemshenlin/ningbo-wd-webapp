import { logger, showError } from '../../helper/showError'
import { defineStore } from 'pinia'
import { WDScenarioApiState } from './type'
import {
    WDScenarioApi,
    DhiDssScenarioComputeWdDtosCreateWdScheduleScenarioInput,
    DhiDssScenarioComputeWdDtosCreateWdCloseValveScenarioInput,
    DhiDssScenarioComputeScenarioDtosCreateAutoScenarioInput,
    DhiDssScenarioComputeWdDtosCreateWdPipeBurstAccidentScenarioInput,
    DhiDssScenarioComputeWdDtosCreateWdwqAccidentScenarioInput,
    DhiDssScenarioComputeWdDtosCreateWdPlanningScenarioInput,
    DhiDssScenarioComputeWdDtosCreateWdWaterHammerScenarioInput,
    DhiDssScenarioComputeWdDtosCreateWdFlushingScenarioInput,
} from '@dhicn/domain-paas-sdk-ts/compute-service'

const StoreName = 'WDScenarioApi'

export const useWDScenarioApiStore = defineStore(StoreName, {
    state: (): WDScenarioApiState => ({
        scenario: null,
    }),
    actions: {
        /**
         * 创建调度方案
         * /api/v1/scenario-compute/wd/schedule/create
         * 应用于天津项目:关阀分析、辅助调度、台州
         */
        async wdCreateScheduleScenario(
            $api: WDScenarioApi,
            args: DhiDssScenarioComputeWdDtosCreateWdScheduleScenarioInput,
        ) {
            try {
                const rep = await $api.apiV1ScenarioComputeWdScheduleCreatePost(args)
                return rep.data
            } catch (error) {
                showError(StoreName, 'wdCreateScheduleScenario error', error)
            }
        },
        /**
         * 创建人工预报方案
         * /api/v1/scenario-compute/wd/manual-forecast/create
         * 应用于天津项目:历史反演
         */
        async createAutoForecastScenario(
            $api: WDScenarioApi,
            params: DhiDssScenarioComputeWdDtosCreateWdCloseValveScenarioInput,
        ) {
            try {
                const res = await $api.apiV1ScenarioComputeWdManualForecastCreatePost(params)
                logger.debug('创建人工预报方案>>>', res.status, res.data)
                if (res.status === 200) {
                    return res.data
                }
                return false
            } catch (error) {
                showError(StoreName, 'createAutoForecastScenario', error)
                return false
            }
        },
        /**
         * 创建关阀方案
         * /api/v1/scenario-compute/wd/close-valve/create
         * 应用于天津项目:关阀分析
         */
        async createValveClosingScenario(
            $api: WDScenarioApi,
            params: DhiDssScenarioComputeWdDtosCreateWdCloseValveScenarioInput,
        ) {
            try {
                const res = await $api.apiV1ScenarioComputeWdCloseValveCreatePost(params)
                logger.debug('创建关阀方案', res)
                if (res.status === 200) {
                    return res.data
                }
                return false
            } catch (error) {
                showError(StoreName, 'CreateCloseValveScenario', error)
                return false
            }
        },

        /**
         * 创建供水领域自动预报的方案
         * /api/v1/scenario-compute/wd/auto-forecast/create
         * 应用于:天津、台州、横琴、李家岩
         */
        async createAutoForecastSubScenario(
            $api: WDScenarioApi,
            params: DhiDssScenarioComputeScenarioDtosCreateAutoScenarioInput,
        ) {
            try {
                const res = await $api.apiV1ScenarioComputeWdAutoForecastCreatePost(params)
                logger.debug('创建供水领域自动预报的方案>>>', res.status, res.data)
                return res.data
            } catch (error) {
                showError(StoreName, 'createAutoForecastSubScenario', error)
                return {}
            }
        },

        /**
         * 创建爆管事故方案
         * /api/v1/scenario-compute/wd/pipe-burst-accident/create
         */
        async createPipeBurstAccidentScenario(
            $api: WDScenarioApi,
            params: DhiDssScenarioComputeWdDtosCreateWdPipeBurstAccidentScenarioInput,
        ) {
            try {
                const res = await $api.apiV1ScenarioComputeWdPipeBurstAccidentCreatePost(params)
                logger.debug('创建爆管事故方案>>>', res.status, res.data)
                return res.data
            } catch (error) {
                showError(StoreName, 'createPipeBurstAccidentScenario', error)
                return {}
            }
        },

        /**
         * 创建水质事故方案
         * /api/v1/scenario-compute/wd/wq-accident/create
         */
        async createWqAccidentScenario(
            $api: WDScenarioApi,
            params: DhiDssScenarioComputeWdDtosCreateWdwqAccidentScenarioInput,
        ) {
            try {
                const res = await $api.apiV1ScenarioComputeWdWqAccidentCreatePost(params)
                logger.debug('创建水质事故方案>>>', res.status, res.data)
                return res.data
            } catch (error) {
                showError(StoreName, 'createWqAccidentScenario', error)
                return {}
            }
        },

        /**
         * 创建规划评估方案
         * /api/v1/scenario-compute/wd/planning/create
         */
        async createPlanAssessmentScenario(
            $api: WDScenarioApi,
            params: DhiDssScenarioComputeWdDtosCreateWdPlanningScenarioInput,
        ) {
            try {
                const res = await $api.apiV1ScenarioComputeWdPlanningCreatePost(params)
                logger.debug('创建规划评估方案>>>', res.status, res.data)
                return res.data
            } catch (error) {
                showError(StoreName, 'createPlanAssessmentScenario', error)
                return {}
            }
        },

        /**
         * 创建水锤模拟方案
         * /api/v1/scenario-compute/wd/waterhammer/create
         */
        async createWaterHammerScenario(
            $api: WDScenarioApi,
            params: DhiDssScenarioComputeWdDtosCreateWdWaterHammerScenarioInput,
        ) {
            try {
                const res = await $api.apiV1ScenarioComputeWdWaterhammerCreatePost(params)
                logger.debug('创建水锤模拟方案>>>', res.status, res.data)
                return res.data
            } catch (error) {
                showError(StoreName, 'createWaterHammerScenario', error)
                return {}
            }
        },

        /**
         * 创建模拟管道冲洗方案
         * /api/v1/scenario-compute/wd/flushing/create
         */
        async createFlushingScenario(
            $api: WDScenarioApi,
            params: DhiDssScenarioComputeWdDtosCreateWdFlushingScenarioInput,
        ) {
            try {
                const res = await $api.apiV1ScenarioComputeWdFlushingCreatePost(params)
                logger.debug('创建模拟管道冲洗方案>>>', res.status, res.data)
                return res.data
            } catch (error) {
                showError(StoreName, 'createFlushingScenario', error)
                return {}
            }
        },
    },
})

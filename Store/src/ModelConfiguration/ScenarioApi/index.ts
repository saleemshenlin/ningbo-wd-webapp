import { defineStore } from 'pinia'
import { ScenarioApiState } from './type'
import { logger, showError } from '../../helper/showError'
import { ScenarioApi } from '@dhicn/domain-paas-sdk-ts/model-configuration'
const StoreName = 'ScenarioApi'
export const useScenarioApiStore = defineStore(StoreName, {
    state: (): ScenarioApiState => ({}),
    actions: {
        /**
         * 启用历史模板方案
         * /api/v2/model-configuration/scenario/enable-template-scenario
         * 应用:系统配置-模型模板管理-启用模板
         */
        async enableTemplateScenario($api: ScenarioApi, scenarioId: string) {
            try {
                const res = await $api.apiV2ModelConfigurationScenarioEnableTemplateScenarioPost(
                    scenarioId,
                )
                return res.data
            } catch (error) {
                showError(StoreName, 'enableTemplateScenario', error)
                return false
            }
        },

        /**
         * 创建模板方案，导出模型基本信息
         * /api/v2/model-configuration/scenario/create-template-scenario
         */
        async createTemplateScenario(
            $api: ScenarioApi,
            templateFileId: string,
            systemId: string,
            scenarioName: string,
        ) {
            try {
                const res = await $api.apiV2ModelConfigurationScenarioCreateTemplateScenarioPost(
                    templateFileId,
                    systemId,
                    scenarioName,
                )
                logger.debug('createTemplateScenario', res)
                return res.data
            } catch (error) {
                showError(StoreName, 'enableTemplateScenario', error)
                return false
            }
        },
    },
})

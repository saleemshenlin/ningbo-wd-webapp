import { defineStore } from 'pinia'
import { IntegrationApiState } from './type'
import { showError } from '../../helper/showError'
import {
    IntegrationApi,
    SearchInOutPointMapAssemblyInput,
} from '@dhicn/domain-paas-sdk-ts/iot-service'
const StoreName = 'IntegrationApi'
export const useIntegrationApiStore = defineStore(StoreName, {
    state: (): IntegrationApiState => ({}),
    actions: {
        /**
         * 批量导入资产设备指标excel
         * /api/v1/iot/integration/import-iot-config-excel
         * 应用于:系统配置
         */
        async importIotConfigExcel($api: IntegrationApi, templateId: string, excelFile: any) {
            try {
                const result = await $api.apiV1IotIntegrationImportIotConfigExcelPost(
                    templateId,
                    excelFile,
                )
                return result.data || false
            } catch (error) {
                showError('API', 'importIotConfigExcel error', error)
                return false
            }
        },

        /**
         * 获取输入输出点位映射信息
         * /api/v1/iot/integration/get-inout-point-map-info
         * 应用于:系统配置:模型边界映射:in 模型点位映射:out
         */
        async getInoutPointMapInfo($api: IntegrationApi, templateId: string) {
            try {
                const res = await $api.apiV1IotIntegrationGetInoutPointMapInfoGet(templateId)
                return res.data || {}
            } catch (error) {
                showError('API', 'getInoutPointMapInfo error', error)
                return {}
            }
        },

        /**
         * 通过设备、指标,检索:实测指标--与--模型输出点位,映射关系;实测指标--与--模型边界点位,映射关系
         * /api/v1/iot/integration/search/get-inout-point-map-info
         * 应用于:长治项目（获取模拟数据前，先获取河道名）
         */
        async getIntegrationSearchGetInoutPointMapInfo(
            $api: IntegrationApi,
            params: SearchInOutPointMapAssemblyInput | undefined,
        ) {
            try {
                const res = await $api.apiV1IotIntegrationSearchGetInoutPointMapInfoPost(params)
                return res.data || {}
            } catch (error) {
                showError('API', 'getIntegrationSearchGetInoutPointMapInfo error', error)
                return {}
            }
        },
    },
})

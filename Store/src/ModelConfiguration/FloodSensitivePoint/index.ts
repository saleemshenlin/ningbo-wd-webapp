import { showError } from '../../helper/showError'
import { FloodSensitivePointApiState } from './type'
import { defineStore } from 'pinia'
import { FloodSensitivePointApi } from '@dhicn/domain-paas-sdk-ts/model-configuration'
const StoreName = 'FloodSensitivePointApi'

export const useFloodSensitivePointApiStore = defineStore(StoreName, {
    state: (): FloodSensitivePointApiState => ({
        pointMap: new Map(),
    }),
    actions: {
        /**
         * 获取易捞点
         * /api/v1/model-configuration/legend/legend-item
         * 应用:系统配置-模型模板管理-获取易捞点
         */
        async getPointByScenarioId(
            $api: FloodSensitivePointApi,
            scenarioId: string,
            refresh = false,
        ) {
            try {
                let points = this.pointMap.get(scenarioId)
                if (refresh || points === undefined || points.length === 0) {
                    const res = await $api.apiV1ModelConfigurationSensitivePointListGet(scenarioId)
                    points = res.data
                    this.pointMap.set(scenarioId, points)
                }
                return points
            } catch (error) {
                showError(StoreName, 'getPointByScenarioId', error)
                return []
            }
        },
        /**
         * 批量更新
         * @param $api
         * @param scenarioId
         */
        async updatePoints($api: FloodSensitivePointApi, scenarioId: string, points: any[]) {
            try {
                // TODO 调用接口成功后给 pointMap 赋值
                this.pointMap.set(scenarioId, points)
                return points
            } catch (error) {
                showError(StoreName, 'getPointByScenarioId', error)
                return []
            }
        },
    },
})

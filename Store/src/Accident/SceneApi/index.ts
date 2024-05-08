import { defineStore } from 'pinia'
import { SceneApiState } from './type'
import { showError } from '../../helper/showError'
import { SceneApi } from '@dhicn/domain-paas-sdk-ts/accident-service'
const StoreName = 'SceneApi'
export const useSceneApiStore = defineStore(StoreName, {
    state: (): SceneApiState => ({}),
    actions: {
        /**
         * 根据方案获取情景信息
         * /api/v1/accident/scene/list-detail-by-scenario
         * 应用于:天津、横琴
         */
        async getSceneListDetailByScenario($api: SceneApi, scenarioId: string) {
            try {
                const res = await $api.apiV1AccidentSceneListDetailByScenarioGet(scenarioId)
                return res.data
            } catch (error) {
                showError(StoreName, 'getSceneListDetailByScenario error', error)
                return []
            }
        },
    },
})

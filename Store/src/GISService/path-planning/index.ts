import { defineStore } from 'pinia'
import { PathPlanningApiState } from './type'
import { showError } from '@/helper/showError'
import { PathPlanningApi, QueryShortestPathArgs } from '@dhicn/domain-paas-sdk-ts/gis-service'
const StoreName = 'usePathPlanningApi'

export const usePathPlanningApiStore = defineStore(StoreName, {
    state: (): PathPlanningApiState => ({}),
    actions: {
        /** 获得最短路径 返回结果是节点数据 */
        async fetchShortestPathNode($api: PathPlanningApi, params: QueryShortestPathArgs) {
            try {
                const res = await $api.apiGisV1PathPlanningShortestPathNodesPost(params)
                return res.data ?? []
            } catch (error) {
                showError(StoreName, 'fetchShortestPath', error)
                return []
            }
        },

        /** 获得最短路径 返回结果是管道数据 */
        async fetchShortestPathPipe($api: PathPlanningApi, params: QueryShortestPathArgs) {
            try {
                const res = await $api.apiGisV1PathPlanningShortestPathPost(params)
                return res.data ?? []
            } catch (error) {
                showError(StoreName, 'fetchShortestPathPipe', error)
                return []
            }
        },
    },
})

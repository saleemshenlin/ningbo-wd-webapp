import { isEmpty } from 'lodash'
import { LibraryApi, Library, Scenario } from '@dhicn/domain-paas-sdk-ts/scenario-service'
import { LibraryApiState } from './type'
import { StoreDefinition, defineStore } from 'pinia'
import { showError } from '../../helper/showError'

const StoreName = 'LibraryApi'

export const useLibraryApiStore = defineStore(StoreName, {
    state: (): LibraryApiState => ({
        libraries: [],
        latestScenarioMap: new Map(),
        // TODO:存储方案列表
        // 方案列表 Map<> key:libraryId value:Scenario[]
        // Map<'历史反演',value> 单独的state
    }),
    actions: {
        async fetchLatestScenario($api: LibraryApi, libraryId: string) {
            try {
                const fetchRep = await $api.apiV2ScenarioManagerLibraryLatestscenarioGet(
                    '2',
                    libraryId,
                )
                if (!isEmpty(fetchRep.data)) {
                    this.latestScenarioMap.set(libraryId, fetchRep.data)
                }
                return fetchRep.data
            } catch (error) {
                showError('API', 'fetchLatestScenario', error)
                return await Promise.reject(error)
            }
        },
        /**
         * 展示特定库下面的方案信息列表 | 根据方案库类型和业务类型查询方案库
         * /api/v2/scenario-manager/library/list/type_businesstype
         * 应用于:天津、台州、横琴、李家岩、竹园、滨州污水
         */
        async fetchLibraryByType(
            $api: LibraryApi,
            businessType: string | number,
            type: string | number,
        ) {
            try {
                const fetchRep = await $api.apiV2ScenarioManagerLibraryListTypeBusinesstypeGet(
                    '2',
                    type as string,
                    businessType as string,
                )
                const tempList = fetchRep.data
                if (tempList.length > 0) {
                    this.libraries = tempList
                }
                return tempList
            } catch (error) {
                showError('API', 'fetchLibraryByType', error)
                return await Promise.reject(error)
            }
        },
        /**
         * 展示特定库下面的方案信息列表
         * /api/v2/scenario-manager/library/scenariolist
         * 应用于:天津、台州、横琴、李家岩、竹园、滨州污水
         */
        async getScenarioList(
            $api: LibraryApi,
            data: {
                libraryId: string
                pageIndex: number
                pageSize: number
            },
        ) {
            try {
                const { libraryId, pageIndex, pageSize } = data
                const fetchRep = await $api.apiV2ScenarioManagerLibraryScenariolistGet(
                    '2', // 版本
                    libraryId,
                    pageIndex,
                    pageSize,
                )
                return fetchRep.data
                // TODO:[{key: 'libraryId', value:[] }]
            } catch (error) {
                showError('API', 'getScenarioList', error)
                return await Promise.reject(error)
            }
        },

        /**
         * 根据方案库ID获取其下所有的模板方案
         * /api/v2/scenario-manager/library/templatelist
         * 应用于:台州、长治
         */
        async getTemplateList($api: LibraryApi, libraryId: string) {
            try {
                const fetchRep = await $api.apiV2ScenarioManagerLibraryTemplatelistGet(
                    '2',
                    libraryId,
                )
                return fetchRep.data
            } catch (error) {
                showError('API', 'getTemplateList', error)
                return await Promise.reject(error)
            }
        },
        /**
         * 根据类型准备 Library And Scenario
         * @param $api
         * @param businessType
         * @param type
         * @param withLatest
         */
        async prepareLibraryAndScenario(
            $api: LibraryApi,
            businessType: string | number,
            type: string | number,
            withLatest: boolean = false,
        ) {
            let latestScenario: Scenario | null = null
            let library: Library | null = null
            let template: Scenario | null = null
            try {
                const libraries = await this.fetchLibraryByType($api, businessType, type)
                if (libraries.length > 0) {
                    library = libraries[0]
                    const templates = await this.getTemplateList($api, libraries[0].id)
                    template = templates.find((template) => template.enabled) ?? null
                    if (withLatest) {
                        latestScenario = await this.fetchLatestScenario($api, libraries[0].id)
                    }
                }
                return {
                    latestScenario,
                    library,
                    template,
                }
            } catch (error) {
                showError(StoreName, 'prepareLibraryAndScenario', error)
                return {
                    latestScenario,
                    library,
                    template,
                }
            }
        },
    },
})

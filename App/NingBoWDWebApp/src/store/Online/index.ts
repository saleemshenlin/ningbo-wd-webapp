import { useLibraryApiStore } from 'dhi-dss-api-store/scenario'
import { WDBusinessType, AutoRunLibraryType } from './config'
import * as ScenarioApi from '@dhicn/domain-paas-sdk-ts/scenario-service'
import { IOnlineState } from './type'
import { defineStore, getActivePinia } from 'pinia'

const StoreName = 'online'
export const useOnlineStore = defineStore(StoreName, {
    state: (): IOnlineState => ({
        flowChartData: {},
        latestScenario: null,
        library: null,
        template: null,
    }),
    actions: {
        /**
         * 查找最新一个自动预报方案
         * @param $api
         */
        async fetchLatestAutoRunScenario($api: ScenarioApi.LibraryApi) {
            try {
                const libraryStore = useLibraryApiStore(getActivePinia())
                const { latestScenario, library, template } =
                    await libraryStore.prepareLibraryAndScenario(
                        $api,
                        WDBusinessType,
                        AutoRunLibraryType,
                        true,
                    )
                if (library !== null) {
                    this.library = library
                }
                if (template !== null) {
                    this.template = template
                }
                if (latestScenario !== null) {
                    this.latestScenario = latestScenario
                    // 清空数据
                    // this.boundaryTSDataMap2D = new Map()
                }
                // await this.fetchThresholdConfig($api)
            } catch (error) {
                logger.error(StoreName, 'fetchLatestAutoRunScenario', error)
            }
        },
    },
})

import { useOnlineApiStore } from 'dhi-dss-api-store/wd-domain'
import { useLibraryApiStore } from 'dhi-dss-api-store/scenario'
import { WDBusinessType, AutoRunLibraryType } from './config'
import * as ScenarioApi from '@dhicn/domain-paas-sdk-ts/scenario-service'
import { OnlineState } from './type'
import { defineStore, getActivePinia } from 'pinia'
import { TzHDOnlineApi } from '@/api/tzwd'

export const useOnlineStore = defineStore('tz-online-service', {
    state: (): OnlineState => ({
        dailyWaterVolumeMap: {},
        flowChartData: {},
        latestScenario: null,
        hyTankStorage: 0,
    }),
    actions: {
        /**
         * 查找最新一个自动预报方案
         * @param $api
         */
        async fetchLatestAutoRunScenario($api: ScenarioApi.LibraryApi) {
            try {
                const scenarioStore = useLibraryApiStore()
                const libraries = await scenarioStore.fetchLibraryByType(
                    $api,
                    WDBusinessType,
                    AutoRunLibraryType,
                )
                if (libraries.length > 0) {
                    this.latestScenario = await scenarioStore.fetchLatestScenario(
                        $api,
                        libraries[0].id,
                    )
                }
            } catch (error) {
                logger.debug('API', 'fetchLatestAutoRunScenario error', error)
            }
        },
        /**
         * 谎言可调蓄量
         * @param  $api
         */
        async fetchHYTankStorage($api: TzHDOnlineApi, name: string) {
            try {
                const domainStore = useOnlineApiStore(getActivePinia())
                const tank = domainStore.tankStorage.find((t) => t.tankName === name)
                if (tank !== undefined) {
                    const fetchRep =
                        await $api.apiV1TzWdOnlineDailyFlowApiV1DomainWdOnlineGetHuangyanTankStoragePost()
                    tank.storageValue = fetchRep.data
                    this.hyTankStorage = fetchRep.data
                }
            } catch (error) {
                logger.debug('API', 'fetchHYTankStorage error', error)
            }
        },
    },
})

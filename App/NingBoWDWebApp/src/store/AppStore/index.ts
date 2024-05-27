import { useLibraryApiStore, useScenarioManagerApiStore } from 'dhi-dss-api-store/scenario'
import { ProjectState } from './type'
import { defineStore, getActivePinia } from 'pinia'
import { ApiHelperExtend } from '@/api/api'
import { useOnlineApiStore } from 'dhi-dss-api-store/wd-domain'
import { isEmpty } from 'lodash'
import { useGisQueryApiStore } from 'dhi-dss-api-store/gis-service'

export const StoreName = 'AppStore'
export const useAppStore = defineStore(StoreName, {
    state: (): ProjectState => ({}),
    getters: {},
    actions: {
        /**
         * 获取基本GIS信息
         */
        async fetchBasicGIS($api: ApiHelperExtend) {
            const scenarioStore = useScenarioManagerApiStore(getActivePinia())
            const gisStore = useGisQueryApiStore(getActivePinia())
            const onlineStore = useOnlineApiStore(getActivePinia())
            await scenarioStore.fetchTemplate($api.scenario.manager)
            if (!isEmpty(scenarioStore.template)) {
                await onlineStore.fetchAllDevice($api.online)
                await gisStore.fetchGIS($api.gis, scenarioStore.template.id, [
                    'wd-pipe',
                    'wd-junction',
                ])
            }
        },
    },
})

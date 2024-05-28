import { useOnlineApiStore, useConfigApiStore } from 'dhi-dss-api-store/wd-domain'
import { useScenarioManagerApiStore } from 'dhi-dss-api-store/scenario'
import { ApiHelperExtend } from '../../api/api'
import { useIotGroupApiStore } from 'dhi-dss-api-store/iot'
import * as IotApi from '@dhicn/domain-paas-sdk-ts/iot-service'
import type { IndicatorInfo } from '@dhicn/domain-paas-sdk-ts/wd-domain'
import { defineStore, getActivePinia } from 'pinia'
import { IProjectState } from './type'
import { isEmpty } from 'lodash'
import { WDResultType, useGisQueryApiStore } from 'dhi-dss-api-store/gis-service'
import { Scenario } from '@dhicn/domain-paas-sdk-ts/scenario-service'
import { useUserStore } from '../User'

export const useProjectStore = defineStore('project', {
    state: (): IProjectState => ({
        groupList: [],
        waterLevelIndicators: [],
    }),
    getters: {
        dailyFlowGroups(): (parentCode: string) => IotApi.IotGroupConfigOutput[] {
            const iotStore = useIotGroupApiStore(getActivePinia())
            return (parentCode: string) =>
                iotStore.groupList.filter((group) => group.parentLevelCode === parentCode)
        },
    },
    actions: {
        /**
         * 获取基本GIS信息
         */
        async fetchBasicGIS($api: ApiHelperExtend, template: Scenario) {
            const onlineStore = useOnlineApiStore(getActivePinia())
            const userStore = useUserStore()
            const gisStore = useGisQueryApiStore(getActivePinia())
            const gisOptions: WDResultType[] = ['wd-pipe', 'wd-junction', 'pump', 'valve', 'tank']
            if (!isEmpty(template)) {
                const opts = [] as WDResultType[]
                for (const opt of gisOptions) {
                    const cache = (await userStore.localStorage.getItem(opt)) as string
                    if (cache !== null && cache.length > 0) {
                        gisStore.gisMap.set(opt, cache)
                    } else {
                        opts.push(opt)
                    }
                }
                if (opts.length > 0) {
                    await gisStore.fetchGIS($api.api.gis, template.id, gisOptions)
                    for (const opt of opts) {
                        // 河道请求为river，数据存储使用 riverWaterLevel
                        const gis = gisStore.gisMap.get(opt)
                        userStore.localStorage.setItem(opt, gis as string)
                    }
                }
                await onlineStore.fetchAllDevice($api.api.wd.online)
            }
        },
        async fetchWaterLevelIndicator($api: ApiHelperExtend) {
            try {
                const store = useConfigApiStore(getActivePinia())
                const params = ['水池', '水厂']
                const rep = await store.getIndicatorConfigList($api.api.wd.indicatorConfig, params)
                // const rep = await $api.indicatorConfig.apiV1DomainWdConfigIndicatorListPost([
                //     '水池',
                //     '水厂',
                // ])

                if (rep.length > 0) {
                    const indicators = rep.reduce<IndicatorInfo[]>((list, curr) => {
                        const currentIndicators = curr.indicatorInfos?.filter(
                            (i) => i.type === 'Waterlevel',
                        ) as IndicatorInfo[]
                        return [...list, ...currentIndicators]
                    }, [])
                    this.waterLevelIndicators = indicators
                }
            } catch (error) {
                logger.debug('API', 'fetchWaterLevelIndicator error', error)
            }
        },
    },
})

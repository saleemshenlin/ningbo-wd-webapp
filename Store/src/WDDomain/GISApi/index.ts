import { GISApi } from '@dhicn/domain-paas-sdk-ts/wd-domain'
import { GISApiState } from './type'
import { defineStore } from 'pinia'
import { showError } from '../../helper/showError'

const StoreName = 'GISApi'

export const useGISApiStore = defineStore(StoreName, {
    state: (): GISApiState => ({
        gis: {
            pipe: '',
            valve: '',
            junction: '',
            pump: undefined,
            tank: '',
            device: undefined,
            dma: undefined,
        },
        // TODO:新的项目在使用,老的项目不使用 2023年8月17日
        device: {
            device_evaluation: undefined, // 考核表
            device_factory: undefined, // 厂站
            device_pressure: undefined, // 压力计
            device_flow: undefined, // 流量计
        },
    }),
    actions: {
        // #region  基本信息
        /**
         * 查找GIS信息
         * 加入可选项,例如:有的项目只要pipe和junction,不需要其他的
         * 台州项目:['pipe', 'junction', 'pump', 'valve', 'tank'] = 默认值
         * 天津项目:['pipe', 'junction', 'valve', 'tank', 'dma']
         * 于:2023年9月25日 迁移到:Gis/GisQuery/index.ts
         * @param $api
         */
        async fetchGIS(
            $api: GISApi,
            scenarioId: string,
            options: string[] = ['pipe', 'junction', 'pump', 'valve', 'tank'],
        ) {
            try {
                if (options.includes('pipe')) {
                    const fetchPipeRep = await $api.apiV1DomainWdGisGetPipeGisGet(scenarioId)
                    if (fetchPipeRep.data.length > 0) {
                        this.gis.pipe = fetchPipeRep.data
                    }
                }
                if (options.includes('junction')) {
                    const fetchJunctionRep = await $api.apiV1DomainWdGisGetJunctionGisGet(
                        scenarioId,
                    )
                    if (fetchJunctionRep.data.length > 0) {
                        this.gis.junction = fetchJunctionRep.data
                    }
                }
                if (options.includes('pump')) {
                    const fetchPumpRep = await $api.apiV1DomainWdGisGetPumpGisGet(scenarioId)
                    if (fetchPumpRep.data.length > 0) {
                        this.gis.pump = fetchPumpRep.data
                    }
                }
                if (options.includes('valve')) {
                    const fetchValveRep = await $api.apiV1DomainWdGisGetValveGisGet(scenarioId)
                    if (fetchValveRep.data.length > 0) {
                        this.gis.valve = fetchValveRep.data
                    }
                }
                if (options.includes('tank')) {
                    const fetchTankRep = await $api.apiV1DomainWdGisGetTankGisGet(scenarioId)
                    if (fetchTankRep.data.length > 0) {
                        this.gis.tank = fetchTankRep.data
                    }
                }
                if (options.includes('dma')) {
                    const fetchDmaRep = await $api.apiV1DomainWdGisGetDmaGisGet(scenarioId)
                    if (fetchDmaRep.data.length > 0) {
                        this.gis.dma = fetchDmaRep.data
                    }
                }
            } catch (error) {
                showError(StoreName, 'fetchGIS error', error)
            }
        },
        // #endregion
    },
})

import { defineStore, mapActions } from 'pinia'
import { GisQueryApiState } from './type'
import { showError } from '../../helper/showError'
import { GisQueryApi, GisOutput } from '@dhicn/domain-paas-sdk-ts/gis-service'
const StoreName = 'GisQueryApi'
export const useGisQueryApiStore = defineStore(StoreName, {
    state: (): GisQueryApiState => ({
        gisMap: new Map(),
    }),
    actions: {
        async fetchGIS(
            $api: GisQueryApi,
            templateScenarioId: string,
            options: string[] = ['pipe', 'junction', 'pump', 'valve', 'tank'],
        ) {
            try {
                if (options.includes('pipe')) {
                    const fetchPipeRep = await $api.apiGisV1GetNetworkPipeGisGet(templateScenarioId)
                    if (fetchPipeRep.data.length > 0) {
                        this.gisMap.set('pipe', fetchPipeRep.data[0].gis ?? '')
                    }
                }
                if (options.includes('junction')) {
                    const fetchJunctionRep = await $api.apiGisV1GetNetworkNodeGisGet(
                        templateScenarioId,
                    )
                    if (fetchJunctionRep.data.length > 0) {
                        this.gisMap.set('junction', fetchJunctionRep.data[0].gis ?? '')
                    }
                }
                if (options.includes('river')) {
                    const fetchRiverRep = await $api.apiGisV1GetRiverGisGet(templateScenarioId)
                    if (fetchRiverRep.data.length > 0) {
                        this.gisMap.set(
                            'riverWaterLevel',
                            fetchRiverRep.data?.find((item) => item.layerType === 'WaterLevel')
                                ?.gis || '',
                        )
                        this.gisMap.set(
                            'riverDischarge',
                            fetchRiverRep.data?.find((item) => item.layerType === 'Discharge')
                                ?.gis || '',
                        )
                    }
                }
                // 以下是供水wd的接口
                if (options.includes('pump')) {
                    const fetchPumpRep = await $api.apiGisV1GetWdPumpGisGet(templateScenarioId)
                    if (fetchPumpRep.data.length > 0) {
                        this.gisMap.set('pump', fetchPumpRep.data)
                    }
                }
                if (options.includes('valve')) {
                    const fetchValveRep = await $api.apiGisV1GetWdValveGisGet(templateScenarioId)
                    if (fetchValveRep.data.length > 0) {
                        this.gisMap.set('valve', fetchValveRep.data)
                    }
                }
                if (options.includes('tank')) {
                    const fetchTankRep = await $api.apiGisV1GetWdTankGisGet(templateScenarioId)
                    if (fetchTankRep.data.length > 0) {
                        this.gisMap.set('tank', fetchTankRep.data)
                    }
                }
                if (options.includes('dma')) {
                    const fetchDmaRep = await $api.apiGisV1GetWdDmaGisGet(templateScenarioId)
                    if (fetchDmaRep.data.length > 0) {
                        this.gisMap.set('dma', fetchDmaRep.data)
                    }
                }
            } catch (error) {
                showError(StoreName, 'fetchGIS error', error)
            }
        },
    },
})

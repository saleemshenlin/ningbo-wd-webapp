<template>
    <div class="valve-closing">
        <valve-map
            class="valve-map"
            :closing-valves="closingValves"
            :closing-pipes="closingPipes"
            :editing="valveClosingAnalysisStore.isMapEdit"
            :active-closing-valve="activeClosingValve"
            @select-pipe="onPipeSelected"
        ></valve-map>
        <valve-pipe-info
            class="valve-info"
            :query-valve="queryValve"
            :loading="loadingObj"
        ></valve-pipe-info>
    </div>
</template>
<script setup lang="ts">
import { computed, inject, onMounted, reactive, ref } from 'vue'
import ValvePipeInfo from './valve-pipe-info.vue'
import ValveMap from '@/components/map/valve-map.vue'
import { useValveClosingAnalysisStore } from '@/store/ValveClosingAnalysis'
import { Message } from '@arco-design/web-vue'
import { BurstPipeValvesItem } from '@dhicn/domain-paas-sdk-ts/wd-domain'
import { useAccidentApiStore } from 'dhi-dss-api-store/wd-domain'
import { getActivePinia } from 'pinia'
import { API, ApiHelperExtend } from '@/api/api'
import { transfer } from 'dhi-dss-mf-map-maplibre/proj'
import type { MapMouseEvent } from 'maplibre-gl'

const valveClosingAnalysisStore = useValveClosingAnalysisStore()
const accidentApiStore = useAccidentApiStore(getActivePinia())
const $api = inject(API) as ApiHelperExtend

const id = '5800046e-196d-4cb6-a6ae-1edf57b96ab2'

const loadingObj = reactive({
    loadingPipe: false,
    loadingValve: false,
})

const queryValve = () => {
    if (valveClosingAnalysisStore.valveInfo.pipeTableData.length === 0) {
        Message.warning('已选择管道列表不能为空')
        valveClosingAnalysisStore.isMapEdit = false
    } else {
        loadingObj.loadingValve = true
        const params: BurstPipeValvesItem[] = valveClosingAnalysisStore.valveInfo.pipeTableData.map(
            (item: any) => {
                return {
                    pipeId: item.MUID as string,
                    x: item.x,
                    y: item.y,
                }
            },
        )

        accidentApiStore
            .findValves($api.accident, { items: params })
            .then((res) => {
                console.log('res>>>', res)
                valveClosingAnalysisStore.valveInfo.valveTableData = res
            })
            .finally(() => {
                loadingObj.loadingValve = false
                valveClosingAnalysisStore.isMapEdit = false
            })
    }
}

/**
 * 响应管道点击事件
 * @param f
 * @param e
 */
const onPipeSelected = (f: GeoJSON.Feature<GeoJSON.LineString>, e: MapMouseEvent) => {
    valveClosingAnalysisStore.valveInfo.pipeTableData.push({
        MUID: f.properties!.MUID,
        Diameter: f.properties!.Diameter,
        x: e.lngLat.lng,
        y: e.lngLat.lat,
        // paths: f.geometry.paths,
        geometry: f.geometry,
        attributes: f.properties,
    })
}

/**
 * 将阀门列表转换成GeoJSON.Feature
 */
const closingValves = computed(() => {
    const features = valveClosingAnalysisStore.valveInfo.valveTableData!.map((v) => {
        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [v.x!, v.y!],
            },
            properties: { ...v },
        } as GeoJSON.Feature<GeoJSON.Point>
    })
    return features
})

/**
 * 将管线列表转换成GeoJSON.Feature
 */
const closingPipes = computed(() => {
    const features = valveClosingAnalysisStore.valveInfo.pipeTableData.map(
        (p: { paths: [number, number][][]; MUID: string; geometry: GeoJSON.LineString }) => {
            if (p.paths) {
                return {
                    type: 'Feature',
                    geometry: {
                        type: 'LineString',
                        coordinates: p.paths[0].map((point) => {
                            const newPoint = transfer('EPSG:3857', 'EPSG:4326', point)
                            return newPoint
                        }),
                    },
                    properties: { MUID: p.MUID },
                } as GeoJSON.Feature<GeoJSON.LineString>
            } else {
                return {
                    type: 'Feature',
                    geometry: p.geometry,
                    properties: { MUID: p.MUID },
                } as GeoJSON.Feature<GeoJSON.LineString>
            }
        },
    )
    return features
})

/**
 * 需要定位的阀门
 */
const activeClosingValve = computed(() => {
    if (valveClosingAnalysisStore.activeValve !== null) {
        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [
                    valveClosingAnalysisStore.activeValve.x,
                    valveClosingAnalysisStore.activeValve.y,
                ],
            },
            properties: {
                ...valveClosingAnalysisStore.activeValve,
            },
        } as GeoJSON.Feature<GeoJSON.Point>
    } else {
        return null
    }
})

/**
 * 获取管道列表和阀门列表
 */
const fetchClosingValveAndPipe = () => {
    valveClosingAnalysisStore.getValveTimeRangeAndPipeData($api.accident, id as string) // 基本信息和管道列表
    valveClosingAnalysisStore.getValveData($api.accident, id as string) // 阀门列表
}

onMounted(() => {
    fetchClosingValveAndPipe()
})
</script>

<style lang="scss" scoped>
.valve-closing {
    display: flex;
    height: 100%;
    width: 100%;
    .valve-map {
        height: 100%;
        width: 100%;
        flex: 1;
    }
    .valve-info {
        width: 480px;
        height: 100%;
        background-color: #fff;
    }
}
</style>

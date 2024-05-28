<!-- 关阀地图 -->
<template>
    <!-- <DhiDssValveMap
        ref="$valveMap"
        :base-map="{
            center: MapBasicConfig.center as [number,number],
            zoom: MapBasicConfig.zoom,
            baseUrl: MapBasicConfig.baseUrl,
            baseLayerType: MapBasicConfig.baseLayerType as 'Vector',
            wkid: MapBasicConfig.wkid,
            tMapTK:''
        }"
        :base-geo-map="{
            wdBasicGIS: props.baseGeoMap.wdBasicGIS,
            onRendered: props.baseGeoMap.onRendered,
        } as any"
    ></DhiDssValveMap> -->
    <BaseMap
        :config="mapConfig"
        :basic-layers="basicLayers"
        :model-layers="{}"
        :result-set="undefined"
        :visibleLayers="visibleLayers"
        v-model:loading="loading"
        @load="onRendered"
        @prepare="onPrepare"
    ></BaseMap>
</template>

<script setup lang="ts">
import type { Map } from 'maplibre-gl'
import { BASE_PIPE } from 'dhi-dss-mf-map-maplibre'
import { mapConfig } from './config'
import { useBasicGIS } from './useBasicGIS'
import { reactive, ref, watch } from 'vue'
import { BaseMap } from 'dhi-dss-mf-map-maplibre/base-map'
import { useValveClosingAnalysisStore } from '@/store/ValveClosingAnalysis'

const valveClosingAnalysisStore = useValveClosingAnalysisStore()
const { basicLayers } = useBasicGIS()
const loading = ref(false)
let letMap = null as Map | null

const visibleLayers = reactive<{
    total: string[]
    checked: string[]
}>({
    total: [BASE_PIPE],
    checked: [BASE_PIPE],
})

/** 地图渲染前的准备工作，加载图片 */
const onPrepare = async (map: Map) => {
    logger.debug('onRendered v2', map)
    map.on('click', (e) => {
        logger.debug('map click', e)
    })
}

/**
 * 主地图的渲染回调函数
 */
const onRendered = async (map: Map) => {
    letMap = map
    logger.debug('map onRendered', map)
    await renderLayer(
        map,
        'MODEL_VALVE',
        valveClosingAnalysisStore.valveInfo.valveTableData!,
        'Point',
        'gisId',
        {
            'circle-radius': 20,
            'circle-color': '#FF0000',
            'circle-stroke-width': 1,
            'circle-stroke-color': '#FFFFFF',
        },
    )
    await renderLayer(
        map,
        'MODEL_PIPE',
        valveClosingAnalysisStore.valveInfo.pipeTableData,
        'LineString',
        'MUID',
        {
            'line-color': '#FF0000',
            'line-width': 20,
        },
    )

    // 隐藏管道图层
    map.setLayoutProperty('BASE_PIPE', 'visibility', 'none')
    map.setLayoutProperty('BASE_JUNCTION', 'visibility', 'none')
}
/** table转GeoJson */
const tableToGeoJson = (tableData: any[], type: string, muid: string = 'MUID'): any => {
    logger.debug('tableToGeoJson', type, tableData)
    const features = tableData.map((item) => {
        return {
            type: 'Feature',
            geometry: {
                type,
                coordinates:
                    type === 'Point'
                        ? [item.x, item.y]
                        : [
                              [117.72807792167383, 39.11204442515394],
                              [117.7280969029225, 39.112134543027224],
                          ], // ! 临时写死,返回来的paths有问题,需要协商
                Muid: item[muid],
            },
            properties: {
                ...item,
            },
        }
    })
    return {
        type: 'FeatureCollection',
        features,
    }
}

/** 删除图层 */
const deleteLayer = (map: Map, layerId: string) => {
    logger.debug('deleteLayer', map, layerId, map.getLayer(layerId))
    if (map.getSource(layerId)) {
        map.removeSource(layerId)
        if (map.getLayer(layerId)) {
            map.removeLayer(layerId)
        }
    }
}

/** 渲染图层 */
const renderLayer = async (
    map: Map,
    layerId: string,
    data: any[],
    type: string,
    muid: string,
    paint: any,
) => {
    logger.debug(`render${layerId}Layer`, map)
    if (data?.length === 0) {
        deleteLayer(map, layerId)
        return
    } else {
        const geoJson = tableToGeoJson(data, type, muid)
        logger.debug(`5.28 ${layerId} geoJson`, geoJson)
        deleteLayer(map, layerId)

        map.addSource(layerId, {
            type: 'geojson',
            data: geoJson,
            promoteId: 'Muid',
        })
        map.addLayer({
            id: layerId,
            type: type === 'Point' ? 'circle' : 'line',
            source: layerId as any,
            paint,
        })
    }
}
</script>

<style lang="scss" scoped></style>

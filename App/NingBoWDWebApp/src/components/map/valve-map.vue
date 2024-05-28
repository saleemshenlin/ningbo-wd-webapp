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
import { reactive, ref } from 'vue'

const { basicLayers } = useBasicGIS()
const loading = ref(false)

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
    logger.debug('map onRendered', map)
}
</script>

<style lang="scss" scoped></style>

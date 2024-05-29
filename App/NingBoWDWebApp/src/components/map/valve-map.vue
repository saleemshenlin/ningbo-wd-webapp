<!-- 关阀地图 -->
<template>
    <BaseMap
        :config="mapConfig"
        :basic-layers="basicLayers"
        :model-layers="{}"
        :result-set="undefined"
        :visibleLayers="visibleLayers"
        v-model:animationPoints="animationPoints"
        v-model:loading="loading"
        @load="onRendered"
        @prepare="onPrepare"
    ></BaseMap>
</template>

<script setup lang="ts">
import type { Map, MapMouseEvent } from 'maplibre-gl'
import { BASE_PIPE } from 'dhi-dss-mf-map-maplibre'
import { mapConfig } from './config'
import { BASE_CLOSING_PIPE, BASE_CLOSING_VALVE, useBasicGIS } from './useBasicGIS'
import { reactive, ref, watch } from 'vue'
import { BaseMap } from 'dhi-dss-mf-map-maplibre/base-map'

const { basicLayers, addImage } = useBasicGIS()
const loading = ref(false)

interface IProps {
    closingValves: GeoJSON.Feature<GeoJSON.Point>[]
    closingPipes: GeoJSON.Feature<GeoJSON.LineString>[]
    editing: boolean
    activeClosingValve: GeoJSON.Feature<GeoJSON.Point> | null
}

const props = withDefaults(defineProps<IProps>(), {
    closingValves: () => [],
    editing: false,
    activeClosingValve: null,
})

const emit = defineEmits<{
    selectPipe: [f: GeoJSON.Feature<GeoJSON.LineString>, e: MapMouseEvent]
}>()

const animationPoints = ref<GeoJSON.Feature[]>([])

const visibleLayers = reactive<{
    total: string[]
    checked: string[]
}>({
    total: [BASE_PIPE, BASE_CLOSING_PIPE, BASE_CLOSING_VALVE],
    checked: [BASE_PIPE, BASE_CLOSING_PIPE, BASE_CLOSING_VALVE],
})

basicLayers[BASE_PIPE].popup = (f, e) => {
    if (props.editing) {
        emit('selectPipe', f as GeoJSON.Feature<GeoJSON.LineString>, e)
        return null
    } else {
        return null
    }
}

/** 地图渲染前的准备工作，加载图片 */
const onPrepare = async (map: Map) => {
    addImage(map)
    // logger.debug('onRendered v2', map)
    map.on('click', (e) => {
        // logger.debug('map click', e)
        animationPoints.value = []
    })
}

/**
 * 主地图的渲染回调函数
 */
const onRendered = async (map: Map) => {
    // logger.debug('map onRendered', map)
}

watch(
    () => props.closingValves,
    () => {
        basicLayers[BASE_CLOSING_VALVE].geojson = {
            type: 'FeatureCollection',
            features: props.closingValves,
        }
    },
)

watch(
    () => props.closingPipes,
    () => {
        basicLayers[BASE_CLOSING_PIPE].geojson = {
            type: 'FeatureCollection',
            features: props.closingPipes,
        }
    },
)

watch(
    () => props.activeClosingValve,
    (val, oldVal) => {
        if (val !== null) {
            animationPoints.value = [val]
        } else {
            animationPoints.value = []
        }
    },
)
</script>

<style lang="scss" scoped></style>

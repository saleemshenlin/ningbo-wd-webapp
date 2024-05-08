<script setup lang="ts">
import ArcGISMap from '@geoscene/core/Map'
import TileLayer from '@geoscene/core/layers/TileLayer'
import { defaultBaseMapUrl, defaultLODs } from '../../helper/wdMapHelper'
import { IBaseMap } from '../../store/types'
import { IBaseGeoJSONMap, IResultMap } from './config'
import { PNGMapLayer, TMapLayer, tmapTileInfo } from '../../helper'
import VectorTileLayer from '@geoscene/core/layers/VectorTileLayer'
import MapView from '@geoscene/core/views/MapView'
import { Ref, onMounted, ref, watch } from 'vue'
import _, { isEmpty } from 'lodash'
import {
    renderWDBaseLayer,
    controlLayerVisible,
    renderPipeLayer,
} from '../../helper/repairMapHelper'
import { flyTo } from '../../helper/flyToHelper'

export interface IProps {
    baseMap: IBaseMap
    resultMap: IResultMap
    baseGeoMap: IBaseGeoJSONMap
}

const props = withDefaults(defineProps<IProps>(), {
    baseMap: () => ({
        center: [121, 31],
        zoom: 12,
        baseUrl: defaultBaseMapUrl,
        baseLayerType: 'ArcGIS',
        tMapTK: '',
        wkid: 4326,
    }),
    resultMap: () => ({
        dataSet: [],
        legend: [],
    }),
    baseGeoMap: () => ({
        wdBasicGIS: null,
        layerControl: [],
        symbolMap: {},
    }),
})

const makeBaseLayer = () => {
    const { baseMap } = props
    switch (baseMap.baseLayerType) {
        case 'ArcGIS':
            return [
                new TileLayer({
                    url: baseMap.baseUrl,
                    id: 'baseLayer',
                    opacity: 1,
                }),
            ]
        case 'WMTS':
            return [
                new TMapLayer({
                    urlTemplate: baseMap.baseUrl,
                    subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
                    id: 'baseLayer',
                    opacity: 0.8,
                    tk: baseMap.tMapTK,
                    tileInfo: tmapTileInfo,
                }),
                new TMapLayer({
                    urlTemplate: baseMap.baseUrl.replaceAll('vec', 'cva'),
                    subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
                    id: 'baseLayer-label',
                    opacity: 0.8,
                    tk: baseMap.tMapTK,
                    tileInfo: tmapTileInfo,
                }),
            ]
        case 'PNG':
            return [
                new PNGMapLayer({
                    urlTemplate: baseMap.baseUrl,
                    id: 'baseLayer',
                    opacity: 0.8,
                    tileInfo: tmapTileInfo,
                }),
            ]
        case 'Vector':
            return [
                new VectorTileLayer({
                    url: baseMap.baseUrl,
                    id: 'baseLayer',
                    opacity: 0.8,
                }),
            ]
        default:
            return [
                new TileLayer({
                    url: baseMap.baseUrl,
                    id: 'baseLayer',
                    opacity: 1,
                }),
            ]
    }
}

const map = new ArcGISMap({
    layers: [...makeBaseLayer()],
})

let view: MapView | null = null
const loading = ref(false)
const $map: Ref<HTMLDivElement | null> = ref(null)
const renderBasicLayers = () => {
    const { baseGeoMap, resultMap } = props
    if (
        baseGeoMap.wdBasicGIS !== null &&
        view !== null &&
        !isEmpty(baseGeoMap.wdBasicGIS.pipe) &&
        // !isEmpty(resultMap.dataSet) &&
        !isEmpty(resultMap.legend)
    ) {
        renderWDBaseLayer(
            map,
            view!,
            baseGeoMap.wdBasicGIS,
            resultMap.dataSet,
            resultMap.legend,
            baseGeoMap.onRendered,
            baseGeoMap.highlightOptions,
            baseGeoMap.symbolMap!,
            baseGeoMap.layerControl!,
        )
    }
}

watch(
    () => props.baseGeoMap.wdBasicGIS,
    (newVal, oldVal) => {
        renderBasicLayers()
    },
    {
        deep: true,
    },
)

watch(
    () => props.baseGeoMap.layerControl,
    (newValue, oldValue) => {
        // console.log('watch layerControl:>>>', newValue, oldValue)
        controlLayerVisible(map, newValue)
    },
    {
        deep: true,
    },
)

watch(
    () => props.resultMap.dataSet,
    async (newVal, oldVal) => {
        console.log('watch resultMap.dataSet:>>>', newVal, _.isEqual(newVal, oldVal))
        if (_.isEqual(newVal, oldVal)) return
        const layer = map.findLayerById('BASE_PIPE')
        if (layer) {
            loading.value = true
            await renderPipeLayer(map, newVal).finally(() => {
                loading.value = false
            })
        }
    },
)

// #region  export function
const viewGoTo = (
    positions: number[],
    zoom: number = 20,
    layerId: string = 'BASE_CLOSING_VALVE',
) => {
    view?.goTo(
        {
            target: positions,
            zoom,
            heading: 40,
            tilt: 60,
        },
        {
            duration: 2000,
            easing: 'ease-in-out',
        },
    )
    flyTo(map, layerId, positions)
}

// #endregion

const emit = defineEmits(['onRendered'])

onMounted(() => {
    const { baseMap } = props
    loading.value = true
    view = new MapView({
        map,
        container: $map.value as HTMLDivElement,
        center: baseMap.center,
        zoom: baseMap.zoom,
        constraints:
            // 特殊处理 离线底图最小级别是14级
            props.baseMap.baseLayerType === 'Vector'
                ? {
                      lods: defaultLODs,
                  }
                : {
                      minZoom: 0,
                  },
        spatialReference: {
            wkid: baseMap.wkid,
        },
        popup: {
            dockEnabled: false,
            dockOptions: {
                // Disables the dock button from the popup
                buttonEnabled: false,
                // Ignore the default sizes that trigger responsive docking
                breakpoint: true,
            },
            viewModel: {
                includeDefaultActions: false,
            },
        },
    })

    view.ui.remove('zoom')
    view.ui.remove('attribution')

    // 暴露函数返回类型

    view.when(() => {
        renderBasicLayers()
        console.log('Map is loaded', props)
        loading.value = false
        emit('onRendered', map, view)
    })
})

defineExpose({
    map,
    viewGoTo,
})
</script>
<template>
    <a-spin class="map-container" :loading="loading" tip="...地图加载中...">
        <div ref="$map" class="map-container"></div>
    </a-spin>
</template>

<style scoped></style>

<script setup lang="ts">
import ArcGISMap from '@geoscene/core/Map'
import MapView from '@geoscene/core/views/MapView'
import TileLayer from '@geoscene/core/layers/TileLayer'
import VectorTileLayer from '@geoscene/core/layers/VectorTileLayer'
import Graphic from '@geoscene/core/Graphic'
import { onMounted, ref, Ref, watch } from 'vue'
import { IBaseGeoJSONMap, IBaseMap, IResultMap } from '../../store/types'
import { renderWDBaseLayer, defaultBaseMapUrl, defaultLODs } from '../../helper/valveMapHelper'
import { tmapTileInfo, TMapLayer } from '../../helper/tmapLayer'
import { isEmpty } from 'lodash'
import { PNGMapLayer } from '../../helper/pngLayer'
import { flyTo } from '../../helper/flyToHelper'

export interface IArcGISMap {
    baseMap: IBaseMap
    resultMap: IResultMap
    baseGeoMap: IBaseGeoJSONMap
}

const props = withDefaults(defineProps<IArcGISMap>(), {
    baseMap: () => ({
        center: [121, 31],
        zoom: 12,
        baseUrl: defaultBaseMapUrl,
        baseLayerType: 'ArcGIS',
        tMapTK: '',
        wkid: 4326,
    }),
    resultMap: () => ({
        wdResultGIS: null,
        legend: [],
        dataSet: null,
        resultItem: '',
        index: 0,
        formatValue: (val: number) => val,
    }),
    baseGeoMap: () => ({
        wdBasicGIS: null,
        popup: () => null,
        layerControl: [],
    }),
})

const $map: Ref<HTMLDivElement | null> = ref(null)
const loading = ref(false)

// #region base map
let view: MapView | null = null

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
// #endregion

// #region basic geojson layer
const renderBasicLayers = () => {
    const { baseGeoMap } = props
    if (baseGeoMap.wdBasicGIS !== null && view !== null && !isEmpty(baseGeoMap.wdBasicGIS.pipe)) {
        const cb = (feature: { graphic: Graphic }, layerId: string) => {
            return null
        }
        renderWDBaseLayer(
            map,
            view!,
            baseGeoMap.wdBasicGIS,
            cb,
            baseGeoMap.onRendered,
            baseGeoMap.highlightOptions,
        )
    }
}

watch(
    () => props.baseGeoMap.wdBasicGIS,
    () => {
        renderBasicLayers()
    },
    {
        deep: true,
    },
)
// #endregion basic geojson layer

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

    view.when(() => {
        renderBasicLayers()
        console.log('Map is loaded', props)
        loading.value = false
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

<style>
@import 'https://js.geoscene.cn/4.24/geoscene/themes/light/main.css';
.map-container {
    padding: 0;
    margin: 0;
    height: 100%;
    width: 100%;
}

.map-container .geoscene-popup__main-container {
    width: 580px;
    max-height: 700px;
}
</style>

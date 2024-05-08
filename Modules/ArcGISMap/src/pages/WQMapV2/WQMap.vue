<script setup lang="ts">
import ArcGISMap from '@geoscene/core/Map'
import MapView from '@geoscene/core/views/MapView'
import TileLayer from '@geoscene/core/layers/TileLayer'
import VectorTileLayer from '@geoscene/core/layers/VectorTileLayer'
import Graphic from '@geoscene/core/Graphic'
import { onMounted, ref, Ref, watch } from 'vue'
import { IBaseMap } from '../../store/types'
import { IResultMap, IBaseGeoJSONMap, IMapExpose } from './types'
import {
    renderBaseLayer,
    renderResultLayer,
    updateResultSet,
    updateResultStep,
    defaultBaseMapUrl,
    defaultLODs,
} from '../../helper/wqMapHelper_v2'
import { tmapTileInfo, TMapLayer } from '../../helper/tmapLayer'
import _, { isEmpty } from 'lodash'
import { PNGMapLayer } from '../../helper/pngLayer'

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
        opacity: 0.8,
    }),
    resultMap: () => ({
        resultGIS: null,
        legend: [],
        dataSet: null,
        resultItem: '',
        index: 0,
        formatValue: (val: number) => val,
    }),
    baseGeoMap: () => ({
        basicGIS: null,
        popup: () => null,
        layerControl: [],
        symbolMap: {},
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
                    opacity: baseMap.opacity,
                }),
            ]
        case 'WMTS':
            return [
                new TMapLayer({
                    urlTemplate: baseMap.baseUrl,
                    subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
                    id: 'baseLayer',
                    opacity: baseMap.opacity,
                    tk: baseMap.tMapTK,
                    tileInfo: tmapTileInfo,
                }),
                new TMapLayer({
                    urlTemplate: baseMap.baseUrl.replaceAll('vec', 'cva'),
                    subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
                    id: 'baseLayer-label',
                    opacity: baseMap.opacity,
                    tk: baseMap.tMapTK,
                    tileInfo: tmapTileInfo,
                }),
            ]
        case 'PNG':
            return [
                new PNGMapLayer({
                    urlTemplate: baseMap.baseUrl,
                    id: 'baseLayer',
                    opacity: baseMap.opacity,
                    tileInfo: tmapTileInfo,
                }),
            ]
        case 'Vector':
            return [
                new VectorTileLayer({
                    url: baseMap.baseUrl,
                    id: 'baseLayer',
                    opacity: baseMap.opacity,
                }),
            ]
        default:
            return [
                new TileLayer({
                    url: baseMap.baseUrl,
                    id: 'baseLayer',
                    opacity: 0.8,
                }),
            ]
    }
}

const map = new ArcGISMap({
    layers: [...makeBaseLayer()],
})

const popupClear = () => {
    view!.popup.clear()
    view!.popup.close()
    // console.log('do popupClear :>> ')
}

// #endregion

// #region basic geojson layer
const renderBasicLayers = () => {
    const { baseGeoMap } = props
    if (baseGeoMap.basicGIS !== null && view !== null && !isEmpty(baseGeoMap.basicGIS.river)) {
        const cb = (feature: { graphic: Graphic }, layerId: string) => {
            if (baseGeoMap.popup) {
                return baseGeoMap.popup(feature, layerId)
            } else {
                popupClear()
                return null
            }
        }
        renderBaseLayer(
            map,
            view!,
            baseGeoMap.basicGIS,
            cb,
            baseGeoMap.onRendered,
            baseGeoMap.deviceTypeConst,
            baseGeoMap.layerControl,
        )
    }
}

watch(
    () => props.baseGeoMap.basicGIS,
    (newValue, oldValue) => {
        // console.log('legend>>>>', props.resultMap.legend)
        renderBasicLayers()
    },
    {
        deep: true,
    },
)
// #endregion basic geojson layer

// #region layer control
// watch(
//     () => props.baseGeoMap.layerControl,
//     (newValue, oldValue) => {
//         // console.log('watch layerControl:>>>', newValue, oldValue, _.isEqual(newValue, oldValue))
//         // 数组中的数值相等,使用lodash的isEqual方法

//         if (!_.isEqual(newValue, oldValue)) {
//             popupClear()
//             controlLayerVisible(map, newValue)
//         }
//     },
//     // {
//     //     deep: true,
//     // },
// )
// #endregion

// #region  export function
const viewGoTo = (positions: number[]) => {
    view?.goTo(
        {
            target: positions,
            zoom: 18,
            heading: 40,
            tilt: 60,
        },
        {
            duration: 2000,
            easing: 'ease-in-out',
        },
    )
}

// #endregion

watch(
    () => props.resultMap.dataSet,
    async (dataSet) => {
        console.log('触发数据源>>>', dataSet)
        if (dataSet === null) {
            loading.value = false
            return
        }
        popupClear()
        // 需要增加判断条件，现在 watch了整个props.dataSet
        const renderFlag = props.resultMap.index === 0 && props.resultMap.legend.length !== 0
        if (props.resultMap.resultGIS !== null && view !== null && renderFlag) {
            loading.value = true
            renderResultLayer(map, props.resultMap.resultGIS!, dataSet.time, view)
            await updateResultSet(
                map,
                dataSet,
                props.resultMap.resultItem,
                props.resultMap.legend,
                props.resultMap.formatValue,
                props.baseGeoMap.layerControl,
            )
            loading.value = false
        } else {
            loading.value = false
        }
    },
)

watch(
    () => props.resultMap.index,
    async (index) => {
        // console.log('index in WDMap:>> ', index)
        // if (index > 0) {
        //     if (props.resultMap.legend.length !== 0) {
        //         updateResultStep(map, props.resultMap.resultItem, index)
        //     }
        // }
        updateResultStep(map, props.resultMap.resultItem, index)
    },
)

// watch(
//     () => props.resultMap.legend,
//     async (list) => {
//         console.log('legend in WDMap:>> ', list)
//         // if (list.length === 0) {
//         //     toggleBaseLayerVisible(map, true)
//         //     toggleResultLayerVisible(map, false)
//         // } else {
//         //     loading.value = true
//         // }
//     },
//     // {
//     //     flush: 'post',
//     // },
// )

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
        loading.value = false
        emit('onRendered', map, view)
    })
})

const emit = defineEmits(['onRendered'])

defineExpose({
    map,
    viewGoTo,
    view,
} as IMapExpose)
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

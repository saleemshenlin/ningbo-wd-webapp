<script setup lang="ts">
import ArcGISMap from '@geoscene/core/Map'
import MapView from '@geoscene/core/views/MapView'
import TileLayer from '@geoscene/core/layers/TileLayer'
import VectorTileLayer from '@geoscene/core/layers/VectorTileLayer'
import Graphic from '@geoscene/core/Graphic'
import { onMounted, ref, Ref, watch, computed } from 'vue'
import { IBaseGeoJSONMap, IBaseMap, IResultMap } from '../../store/types'
import {
    renderWDBaseLayer,
    renderWDResultLayer,
    toggleBaseLayerVisible,
    toggleResultLayerVisible,
    toggleBaseValveLayerVisible,
    updateResultSet,
    updateResultStep,
    controlLayerVisible,
    defaultBaseMapUrl,
    defaultLODs,
    changeBasePipeRenderer,
} from '../../helper/wdMapHelper'
import { tmapTileInfo, TMapLayer } from '../../helper/tmapLayer'
import _, { isEmpty } from 'lodash'
import { PNGMapLayer } from '../../helper/pngLayer'
// const defaultLayerId = [
//     'BASE_PIPE',
//     'BASE_DEVICE',
//     'BASE_DMA',
//     'BASE_DEVICE_EVALUATION',
//     'BASE_DEVICE_FACTORY',
//     'BASE_DEVICE_FLOW',
//     'BASE_DEVICE_PRESSURE',
// ]
// import { BASE_JUNCTION, BASE_PIPE, BASE_TANK, BASE_PUMP, BASE_VALVE } from '../store/const'
// import { BASE_JUNCTION } from '../store/const'

export interface IArcGISMap {
    baseMap: IBaseMap
    resultMap: IResultMap
    baseGeoMap: IBaseGeoJSONMap
    loading: boolean
}
export interface IWDMapExpose {
    map: ArcGISMap
    viewGoTo: (positions: number[]) => void
    view: MapView | null
}

const props = withDefaults(defineProps<IArcGISMap>(), {
    loading: false,
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
        symbolMap: {},
    }),
})

const $map: Ref<HTMLDivElement | null> = ref(null)
const loading = computed({
    get() {
        return props.loading
    },
    set(state: boolean) {
        emit('update:loading', state)
    },
})

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
    if (baseGeoMap.wdBasicGIS !== null && view !== null && !isEmpty(baseGeoMap.wdBasicGIS.pipe)) {
        const cb = (feature: { graphic: Graphic }, layerId: string) => {
            if (baseGeoMap.popup) {
                return baseGeoMap.popup(feature, layerId)
            } else {
                popupClear()
                return null
            }
        }
        renderWDBaseLayer(
            map,
            view!,
            baseGeoMap.wdBasicGIS,
            cb,
            baseGeoMap.layerControl,
            baseGeoMap.onRendered,
            baseGeoMap.highlightOptions,
            baseGeoMap.symbolMap,
        )
        // 当图例不为空的时候,不进行图层控制
        // console.log('legend>>>>', props.resultMap.legend)
        if (props.resultMap.legend.length === 0) {
            controlLayerVisible(map, baseGeoMap.layerControl)
        }
    }
}

watch(
    () => props.baseGeoMap.wdBasicGIS,
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
watch(
    () => props.baseGeoMap.layerControl,
    (newValue, oldValue) => {
        // console.log('watch layerControl:>>>', newValue, oldValue, _.isEqual(newValue, oldValue))
        // 数组中的数值相等,使用lodash的isEqual方法

        if (!_.isEqual(newValue, oldValue)) {
            popupClear()
            controlLayerVisible(map, newValue)
        }
    },
    // {
    //     deep: true,
    // },
)
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
        if (dataSet === null) {
            loading.value = false
            return
        }
        popupClear()
        // 需要增加判断条件，现在 watch了整个props.dataSet
        const renderFlag = props.resultMap.index === 0 && props.resultMap.legend.length !== 0
        if (props.resultMap.wdResultGIS !== null && view !== null && renderFlag) {
            // console.log('updateResult in WDMap>>>', dataSet, props.resultMap.legend)
            loading.value = true
            renderWDResultLayer(map, props.resultMap.wdResultGIS!, dataSet.time)
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
        if (props.resultMap.legend.length !== 0) {
            updateResultStep(map, props.resultMap.resultItem, index)
        }

        // }
    },
    {
        deep: true,
    },
)

watch(
    () => props.resultMap.legend,
    async (list) => {
        // console.log('图例>>>', props.baseGeoMap.layerControl, list)
        if (list.length === 0) {
            toggleBaseLayerVisible(map, true)
            toggleResultLayerVisible(map, false)
            if (props.baseGeoMap.layerControl.includes('BASE_HIGHLIGHT_PIPE')) {
                controlLayerVisible(map, [
                    'BASE_PIPE',
                    'BASE_CLOSING_VALVE',
                    'BASE_HIGHLIGHT_PIPE',
                    'BASE_JUNCTION',
                ]) // 暂时解决方案
            } else {
                // 隐藏关阀和高亮管线
                toggleBaseValveLayerVisible(map, false)
                controlLayerVisible(map, props.baseGeoMap.layerControl)
            }
            if (map.findLayerById('BASE_PIPE')) {
                changeBasePipeRenderer(map, 'BASE_PIPE', false)
            }
        } else {
            loading.value = true
        }
    },
    {
        flush: 'post',
    },
)

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
        // console.log('Map is loaded', props)
        loading.value = false
        emit('onRendered', map, view)
        // view?.watch('zoom', (extent) => {
        //     console.log('extent>>>', extent)
        // })
    })
})

const emit = defineEmits(['onRendered', 'update:loading'])

defineExpose({
    map,
    viewGoTo,
    view,
} as IWDMapExpose)
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

<template>
    <a-spin class="map-container" :loading="loading" tip="...地图加载中...">
        <div ref="$map" class="map-container"></div>
    </a-spin>
</template>

<script lang="ts" setup>
import type { IBasicGIS, IMapConfig, IMapResult } from '../../types'
import { useMap } from '../../hocks/useMap'
import { onMounted, ref, watch } from 'vue'
import { GeoJSONSource, Map } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { ANIMATION_POINT } from '../../const'
import { logger } from '../../helper/showError'

const $map = ref<HTMLDivElement | null>(null)
const props = withDefaults(
    defineProps<{
        config: IMapConfig
        basicLayers: Record<string, IBasicGIS>
        modelLayers: Record<string, IBasicGIS>
        visibleLayers: { total: string[]; checked: string[] }
        resultSet: IMapResult
    }>(),
    {
        config: () => ({
            source: 'http://172.23.21.61:8089/styles/Dark/style.json',
            center: [121.2, 31.4],
            zoom: 13,
        }),
        basicLayers: () => ({}),
        modelLayers: () => ({}),
        visibleLayers: () => ({ total: [], checked: [] }),
        resultSet: () => ({
            resultItem: '',
            layerId: '',
            idList: [],
            timeList: [],
            data: [],
            currentIndex: 0,
        }),
    },
)
/**
 * 高亮要素，string[], “${图层}:${id}”
 */
const highlightIds = defineModel<string[]>('highlightIds', { default: [] })
/**
 * 动画点要素
 */
const animationPoints = defineModel<GeoJSON.Feature[]>('animationPoints', { default: [] })
const loading = defineModel<Boolean>('loading', { default: false })

const { scene, renderBasicLayers, renderResultLayer, updateResultStep, toggleLayerVisible } =
    useMap($map, {
        ...props.config,
    })

/**
 * 检查图层是否可见
 * @param l 图层名称
 */
const checkLayerVisible = (l: string) => {
    const checked = props.visibleLayers.total.includes(l) && props.visibleLayers.checked.includes(l)
    return !props.visibleLayers.total.includes(l) || checked
}

/**
 * 图层加载事件
 * @param l 图层名称
 */
const onLayerLoad = (l: string) => {
    toggleLayerVisible(l, checkLayerVisible(l))
    emit('layerLoad', l, scene.value! as any)
}

const emit = defineEmits<{
    load: [map: Map]
    prepare: [map: Map]
    layerLoad: [layer: string, map: Map]
}>()

watch(
    () => props.resultSet.resultItem,
    () => {
        renderResultLayer(props.resultSet, props.modelLayers)
    },
)

watch(
    () => props.resultSet.currentIndex,
    async (index) => {
        updateResultStep(props.resultSet.layerId, index)
    },
)

watch(
    props.visibleLayers,
    (layers) => {
        if (scene.value) {
            props.visibleLayers.total.forEach((layerId) => {
                toggleLayerVisible(layerId, layers.checked.includes(layerId))
            })
        }
    },
    { deep: true },
)

watch(
    props.basicLayers,
    (layers) => {
        renderBasicLayers(layers, onLayerLoad, true)
    },
    { deep: true },
)

watch(
    highlightIds,
    (idList, oldList) => {
        oldList.forEach((item) => {
            const [layer, id] = item.split(':')
            if (idList.includes(item) || layer === undefined || id === undefined) {
                return
            } else {
                scene.value!.setFeatureState({ source: layer, id: id }, { highlight: false })
            }
        })
        idList.forEach((item) => {
            const [layer, id] = item.split(':')
            if (oldList.includes(item) || layer === undefined || id === undefined) {
                return
            } else {
                scene.value!.setFeatureState({ source: layer, id: id }, { highlight: true })
            }
        })
    },
    { deep: true },
)

watch(animationPoints, (points) => {
    if (scene.value === null) return
    const source = scene.value.getSource(ANIMATION_POINT) as GeoJSONSource
    if (source === undefined) return
    source.setData({ type: 'FeatureCollection', features: points })
})

onMounted(async () => {
    loading.value = true
    // logger.debug('onMounted', scene)
    emit('prepare', scene.value! as Map)
    scene.value!.on('load', () => {
        renderBasicLayers(props.basicLayers, onLayerLoad)
        loading.value = false
        emit('load', scene.value! as Map)
    })
})
</script>
<script lang="ts">
export default {
    name: '2d-map',
}
</script>

<style lang="scss">
.map-container {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
}
</style>

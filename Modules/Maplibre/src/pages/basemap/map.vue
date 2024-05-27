<template>
    <a-spin class="map-container" :loading="loading" tip="...地图加载中...">
        <div ref="$map" class="map-container"></div>
    </a-spin>
</template>

<script lang="ts" setup>
import type { IBasicGIS, IMapConfig, IMapResult } from '../../types'
import { useMap } from '../../hocks/useMap'
import { onMounted, ref, watch } from 'vue'
import { Map } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const $map = ref<HTMLDivElement | null>(null)
const props = withDefaults(
    defineProps<{
        config: IMapConfig
        basicLayers: Record<string, IBasicGIS>
        modelLayers: Record<string, IBasicGIS>
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
const loading = defineModel<Boolean>('loading', { default: false })
const visibleLayers = defineModel<{ total: string[]; checked: string[] }>('visibleLayers', {
    default: {
        total: [],
        checked: [],
    },
})

const { scene, renderBasicLayers, renderResultLayer, updateResultStep, toggleLayerVisible } =
    useMap($map, {
        ...props.config,
    })

/**
 * 检查图层是否可见
 * @param l 图层名称
 */
const checkLayerVisible = (l: string) => {
    const checked = visibleLayers.value.total.includes(l) && visibleLayers.value.checked.includes(l)
    return !visibleLayers.value.total.includes(l) || checked
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
    visibleLayers,
    (layers) => {
        if (scene.value) {
            visibleLayers.value.total.forEach((layerId) => {
                toggleLayerVisible(layerId, layers.checked.includes(layerId))
            })
        }
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

onMounted(async () => {
    loading.value = true
    // logger.debug('onMounted', scene)
    emit('prepare', scene.value! as Map)
    scene.value!.on('load', () => {
        emit('load', scene.value! as Map)
        renderBasicLayers(props.basicLayers, onLayerLoad)
        loading.value = false
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

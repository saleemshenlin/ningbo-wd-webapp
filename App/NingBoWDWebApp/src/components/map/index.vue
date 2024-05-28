<template>
    <div class="map-panel">
        <BaseMap
            :config="mapConfig"
            :basic-layers="basicLayers"
            :model-layers="modelLayers"
            :result-set="resultSet"
            :visibleLayers="visibleLayers"
            v-model:animationPoints="animationPoints"
            v-model:loading="resultStore.loading"
            @load="onRendered"
            @prepare="onPrepare"
        ></BaseMap>

        <div class="action-bar">
            <animation-control
                class="animation-control"
                v-if="isPlayBarShow"
                :time="resultStore.timeSeriesList.time"
                :iDs="resultStore.timeSeriesList.iDs"
                :data="resultStore.timeSeriesList.data"
                :loading="resultStore.loading"
                @change="onStepChange"
            >
            </animation-control>
        </div>

        <result-item
            class="result-item"
            :data-set="legendStore.resultItem"
            @clickResultItem="fetchResultItemData"
        >
        </result-item>
    </div>
</template>
<script lang="ts" setup>
import type { Map } from 'maplibre-gl'
import { BaseMap } from 'dhi-dss-mf-map-maplibre/base-map'
import 'dhi-dss-mf-map-maplibre/dist/style.css'
import { mapConfig } from './config'
import { Scenario } from '@dhicn/domain-paas-sdk-ts/scenario-service'
import { API, ApiHelperExtend } from '@/api/api'
import { computed, inject, reactive, ref, watch } from 'vue'
import { useResult } from '@/store/Result'
import {
    BASE_JUNCTION,
    BASE_PIPE,
    IBasicGIS,
    IMapResult,
    MODEL_PIPE,
    MODEL_JUNCTION,
    legend2Color,
} from 'dhi-dss-mf-map-maplibre'
import { useBasicGIS } from './useBasicGIS'
import { ResultItem } from 'dhi-dss-domain-wd/result-item'
import { AnimationControl } from 'dhi-dss-mf-layout/layout-animation-control'
import { useLegendApiStore } from 'dhi-dss-api-store/model-Configuration'
import { getResultGISKey, transferResultItem, useResultItem } from './useResultItem'
import { ModelResultBasicType } from 'dhi-dss-api-store/result-service'
import { useModelGIS } from './useModelGIS'
import { fnSimpleLine, fnSimplePoint } from 'dhi-dss-mf-map-maplibre/style'

interface IProps {
    scenario?: Scenario
}

const props = withDefaults(defineProps<IProps>(), {})

const $api = inject(API) as ApiHelperExtend

const resultStore = useResult()
const legendStore = useLegendApiStore()
const { basicLayers } = useBasicGIS()
const { modelLayers, changeModelLayerStyle } = useModelGIS()
const { activeItem, fetchResultItemData } = useResultItem()

const animationPoints = ref<GeoJSON.Feature[]>([])

const visibleLayers = reactive<{
    total: string[]
    checked: string[]
}>({
    total: [BASE_PIPE, BASE_JUNCTION, MODEL_PIPE, MODEL_JUNCTION],
    checked: [BASE_PIPE, BASE_JUNCTION],
})

const resultSet = reactive<IMapResult>({
    resultItem: '',
    idList: resultStore.timeSeriesList.iDs!,
    timeList: resultStore.timeSeriesList.time!,
    data: resultStore.timeSeriesList.data!,
    currentIndex: 0,
    layerId: MODEL_PIPE,
})

const isPlayBarShow = computed(() => {
    return resultStore.classifyLegendList!.length > 0
})

watch(activeItem, async (item) => {
    if (item.includes(ModelResultBasicType)) {
        // 基本信息
        visibleLayers.checked = [BASE_PIPE, BASE_JUNCTION]
    } else {
        const gisKey = getResultGISKey(item)
        await resultStore.fetchResultLegend($api, item)
        await resultStore.prepareGeoJSONResult(
            $api,
            props.scenario!,
            transferResultItem(item),
            gisKey,
        )
        resultSet.resultItem = item
        if (gisKey.includes('pipe')) {
            visibleLayers.checked = [MODEL_PIPE]
            resultSet.layerId = MODEL_PIPE
            changeModelLayerStyle(MODEL_PIPE)
        } else if (gisKey.includes('junction')) {
            visibleLayers.checked = [BASE_PIPE, MODEL_JUNCTION]
            resultSet.layerId = MODEL_JUNCTION
            changeModelLayerStyle(MODEL_JUNCTION)
        }
    }
})

const onStepChange = (props: { index: number }) => {
    if (!resultStore.loading) {
        resultSet.currentIndex = props.index
    }
}

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
<script lang="ts">
export default {
    name: 'result-map_v2',
}
</script>

<style lang="scss">
.map-panel,
.map-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    flex: 1;

    .my-popup {
        position: absolute;
        top: 0;
        left: 0;
    }

    .chartLine {
        padding: 0;
    }
    .maplibregl-ctrl-attrib {
        display: none;
    }
}
.result-item {
    position: absolute;
    top: 140px;
    left: 30px;
    height: auto;
}
.action-bar {
    position: absolute;
    top: 16px;
    right: 16px;
    left: auto;
    z-index: 100;
    width: calc(100% - 32px);
    height: 40px;
}
</style>

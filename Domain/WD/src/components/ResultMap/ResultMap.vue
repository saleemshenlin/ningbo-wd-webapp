<script setup lang="ts">
import { WDMapConst } from 'dhi-dss-mf-map-arcgis'
import { DhiDssWDMap } from 'dhi-dss-mf-map-arcgis/wd-map'
import {
    formatResultValue,
    junctionShowAttributes,
    pipeShowAttributes,
    pipeResultItems,
    junctionResultItems,
    WDModelResultCN,
    WDModelResultEN,
    WDModelResultType,
    WDModelResultUnit,
    ProfileChatTitle,
    ModelResultBasicType,
} from './config'

import { computed, createApp, Ref, ref, watch } from 'vue'
import type * as ScenarioApi from '@dhicn/domain-paas-sdk-ts/scenario-service'
import type * as WDApi from '@dhicn/domain-paas-sdk-ts/wd-domain'
import type {
    LegendItemDto,
    ClassifyLegendInfo,
} from '@dhicn/domain-paas-sdk-ts/model-configuration'
import MapDevicePopup from '../Popup/MapDevicePopup.vue'
import MapPipePopup from '../Popup/MapPipePopup.vue'
import MapJunctionPopup from '../Popup/MapJunctionPopup.vue'
import ResultItem from '../ResultItem/ResultItem.vue'
import AnimationControl from '../AnimationControl/AnimationControl.vue'
import MapLegend from '../MapLegend/MapLegend.vue'
import ProfileChart from './ProfileChart.vue'
import LayerControl from '../LayerControl/LayerControl.vue'
import ResultStatistic from './../ResultStatistic/index.vue'
import {
    IProfileTableData,
    IStepChangeData,
    ITimeSeries,
    IMapBasicInfo,
    IStatisticDataItem,
} from './type'
import { isEmpty, isFunction } from 'lodash'

import ArcoVue from '@arco-design/web-vue'
import { UseMessage } from 'dhi-dss-mf-layout'
import { Helper } from '@dhicn/helper'

const isProfileDataShow = ref(false)
const currentIndex = ref(0)
const active = ref<WDModelResultType>(ModelResultBasicType)

const $wdMap: Ref<InstanceType<typeof DhiDssWDMap> | null> = ref(null)

interface IProps {
    /** 方案 */
    scenario: ScenarioApi.Scenario
    /** 基本地图信息 */
    baseMap: {
        gis: string // 地图gis
        mapInfo: IMapBasicInfo // 地图配置
        onRendered?: (layer: any, layerView: any, mapView: any) => void // 地图图层加载完成的事件 GeoJSONLayerView
        highlightOptions?: { color: string | number[]; haloColor: string | number[] } // 高亮配置
    }
    /** 地图Popup */
    popup: {
        fetchTSResult: (modelId: string, dataType: number) => Promise<{ t: string[]; v: number[] }>
        devicePopupData: (feature: { graphic: any }) => {
            deviceIndicatorPara: WDApi.DeviceIndicatorPara[] // 设备指标参数
            deviceResultSet: WDApi.CurrentOnlineModelData[] // 设备结果集
        }
        popupCallBack: {
            pipe?: (feature: { graphic: Record<string, any> }) => HTMLElement | null
            junction?: (feature: { graphic: Record<string, any> }) => HTMLElement | null
            device?: (feature: { graphic: Record<string, any> }) => HTMLElement | null
            valve?: (feature: { graphic: Record<string, any> }) => HTMLElement | null
            tank?: (feature: { graphic: Record<string, any> }) => HTMLElement | null
            dma?: (feature: { graphic: Record<string, any> }) => HTMLElement | null
        }
    }
    /** 结果地图信息 */
    resultMap: {
        gis: string // 地图gis
        dataSet: ITimeSeries // 数据集
    }
    /** 展示列表 */
    resultItem: {
        resultItems: LegendItemDto[] // 基本信息
        fetchResultItemData: (modelId: string, dataType: number) => Promise<LegendItemDto[]> // 点击事件
        formatterType?: (typeName: string) => string
    }
    /** 图例 */
    mapLegend: {
        legendItems: ClassifyLegendInfo[]
    }
    /** 剖面图 */
    profileChart: {
        isShow: boolean // 是否展示
        profileTableData: IProfileTableData[] // 剖面图Table数据
        fetchProfileMap: (NodeIDs: string[]) => {} // 剖面图地图数据
    }
    /** 图层控制 */
    layerControl: {
        isShow: boolean // 是否展示
        layerControlItems: any // 数据源
        iconMap: Map<string, string>
        defaultCheckedKeys?: string[]
    }
    /** 统计分析 */
    statisticAnalysis: {
        isShow: boolean // 是否展示
        statisticAnalysisItems: IStatisticDataItem[] // 数据源
        legendItems: ClassifyLegendInfo[]
    }
}
const props = withDefaults(defineProps<IProps>(), {
    scenario: () => null as any,
    baseMap: () =>
        ({
            gis: '',
            mapInfo: {},
        } as any),
    popup: () => ({
        fetchTSResult: () =>
            Promise.resolve({
                t: [],
                v: [],
            }),
        devicePopupData: () => ({
            deviceIndicatorPara: [],
            deviceResultSet: [],
        }),
        popupCallBack: {
            pipe: undefined,
            junction: undefined,
            device: undefined,
            valve: undefined,
            tank: undefined,
            dma: undefined,
        },
    }),
    resultMap: () => ({
        gis: '',
        dataSet: {},
    }),
    resultItem: () => ({
        resultItems: [],
        fetchResultItemData: () => Promise.resolve([]),
    }),
    mapLegend: () => ({
        legendItems: [],
    }),
    profileChart: () => ({
        isShow: false,
        profileTableData: [],
        fetchProfileMap: () => ({}),
    }),
    layerControl: () => ({
        isShow: true,
        layerControlItems: () => [],
        iconMap: new Map<string, string>(),
        defaultCheckedKeys: [],
    }),
    statisticAnalysis: () => ({
        isShow: false,
        statisticAnalysisItems: [],
        legendItems: [],
    }),
})

// 地图对象
let basicPipeLayerView: { highlight: (paras: any) => { remove: () => void } } | null = null
let highlightHandle: { remove: () => void } | null
let mapView: any = null
defineExpose({ $wdMap })
const emit = defineEmits(['onRendered', 'onProfileChartShown'])
const onRendered = (map: any, view: any) => {
    mapView = view
    emit('onRendered', map, view)
}

console.log('resultMap props', props)

// #region PopUp
const setPopupContent = (feature: { graphic: any }, layerId: string) => {
    // console.log('layerId>>', feature, layerId)
    switch (layerId) {
        case WDMapConst.BASE_PIPE:
            return setPipePopupContent(feature)
        case WDMapConst.BASE_JUNCTION:
            return setJunctionPopupContent(feature)
        case WDMapConst.BASE_VALVE:
            return setValvePopupContent(feature)
        case WDMapConst.BASE_TANK:
            return setTankPopupContent(feature)
        case WDMapConst.BASE_DMA:
            return setDmaPopupContent(feature)
        case WDMapConst.BASE_DEVICE:
        case WDMapConst.BASE_DEVICE_PRESSURE:
        case WDMapConst.BASE_DEVICE_FLOW:
        case WDMapConst.BASE_DEVICE_EVALUATION:
        case WDMapConst.BASE_DEVICE_FACTORY:
            // console.log('layerId>>', layerId)
            return setDevicePopupContent(feature)
        default:
            return null
    }
}

const setDmaPopupContent = async (feature: { graphic: Record<string, any> }) => {
    if (isProfileDataShow.value || isPlayBarShow.value) {
        return null
    } else {
        if (isFunction(props.popup.popupCallBack.dma)) {
            return props.popup.popupCallBack.dma(feature)
        } else {
            return null
        }
    }
}

const setTankPopupContent = async (feature: { graphic: Record<string, any> }) => {
    if (isProfileDataShow.value || isPlayBarShow.value) {
        return null
    } else {
        if (isFunction(props.popup.popupCallBack.tank)) {
            console.log('setTankPopupContent :>> custom function')
            return props.popup.popupCallBack.tank(feature)
        } else {
            return null
        }
    }
}

const setValvePopupContent = async (feature: { graphic: Record<string, any> }) => {
    if (isProfileDataShow.value || isPlayBarShow.value) {
        return null
    } else {
        if (isFunction(props.popup.popupCallBack.valve)) {
            return props.popup.popupCallBack.valve(feature)
        } else {
            return null
        }
    }
}

const setDevicePopupContent = async (feature: { graphic: any }) => {
    if (isProfileDataShow.value || isPlayBarShow.value) {
        return null
    } else {
        if (isFunction(props.popup.popupCallBack.device)) {
            console.log('setDevicePopupContent :>> custom function')
            return props.popup.popupCallBack.device(feature)
        } else {
            const resultPopup = createApp(MapDevicePopup, {
                geometry: feature.graphic.geometry,
                attributes: feature.graphic.attributes,
            })
            resultPopup.use(ArcoVue)
            const popupGuid = Helper.newGuid()
            const popupDiv = document.createElement('div')
            popupDiv.id = popupGuid
            resultPopup.mount(popupDiv)
            return popupDiv
        }
    }
}

const setPipePopupContent = (feature: { graphic: Record<string, any> }) => {
    if (isProfileDataShow.value) {
        getSelectPipeData(feature.graphic.attributes)
        feature.graphic.attributes.Highlight = 1
        return null
    } else if (isPlayBarShow.value) {
        return null
    } else {
        if (isFunction(props.popup.popupCallBack.pipe)) {
            // console.log('setPipePopupContent :>> custom function')
            return props.popup.popupCallBack.pipe(feature)
        }
        const resultPopup = createApp(MapPipePopup, {
            geometry: feature.graphic.geometry,
            attributes: feature.graphic.attributes,
            showAttributes: pipeShowAttributes,
            resultItems: pipeResultItems,
            fetchTSResult: props.popup.fetchTSResult,
        })
        resultPopup.use(ArcoVue)
        const popupGuid = Helper.newGuid()
        const popupDiv = document.createElement('div')
        popupDiv.id = popupGuid
        resultPopup.mount(popupDiv)
        return popupDiv
    }
}

const setJunctionPopupContent = (feature: { graphic: any }) => {
    // console.log('setJunctionPopupContent>>>', feature.graphic.attributes)
    if (isProfileDataShow.value || isPlayBarShow.value) {
        return null
    } else {
        if (isFunction(props.popup.popupCallBack.junction)) {
            console.log('setJunctionPopupContent :>> custom function')
            return props.popup.popupCallBack.junction(feature)
        } else {
            const resultPopup = createApp(MapJunctionPopup, {
                geometry: feature.graphic.geometry,
                attributes: feature.graphic.attributes,
                showAttributes: junctionShowAttributes,
                resultItems: junctionResultItems,
                fetchTSResult: props.popup.fetchTSResult,
            })
            resultPopup.use(ArcoVue)
            const popupGuid = Helper.newGuid()
            const popupDiv = document.createElement('div')
            popupDiv.id = popupGuid
            resultPopup.mount(popupDiv)
            return popupDiv
        }
    }
}
// #endregion

// #region  layerControl
const mapLayerControl = ref<string[]>(props.layerControl.defaultCheckedKeys!)
const changeLayers = (layers: string[]) => {
    let newValue = [...layers]
    newValue = newValue.filter(
        (item) => item !== WDMapConst.BASE_HIGHLIGHT_PIPE && item !== WDMapConst.BASE_CLOSING_VALVE,
    )
    mapLayerControl.value = newValue
    console.log('大屏的图层>>>', mapLayerControl.value)
}
// #endregion

// #region ProfileMap

const doProfileMapChange = (val: string | number | boolean) => {
    // TODO 这里需要切换状态，点击管线是弹窗还是选中作为剖面的的管线
    isProfileDataShow.value = val as boolean
    emit('onProfileChartShown', val)
    if (!val) {
        // 清空高亮管线
        if (highlightHandle !== null && highlightHandle !== undefined) {
            highlightHandle.remove()
            highlightHandle = null
        }
    }
}

const getSelectPipeData = (featureAttributes: any) => {
    // TODO 需要加判断，新加入的管线的FromNode必须等于已选最后一根管线的ToNode（push到数组末尾）,
    // 或者新加入的管线的ToNode必须等于已选最后一根管线的FromNode（pop到数组起始）
    const pipeInfo: IProfileTableData = {
        Oid: featureAttributes.__OBJECTID,
        pipeName: featureAttributes.MUID,
        upJunction: featureAttributes.FromNode,
        downJunction: featureAttributes.ToNode,
        pipeDiameter: featureAttributes.Diameter ?? 0,
        pipeLength: featureAttributes.GeometricLength ?? 0,
        Elev: featureAttributes.Elev ?? 0,
    }
    const isExist = props.profileChart.profileTableData.some((item: IProfileTableData) => {
        if (item.pipeName === pipeInfo.pipeName) {
            return true
        }
        return false
    })
    if (isExist) {
        return false
    } else {
        if (props.profileChart.profileTableData.length === 0) {
            // eslint-disable-next-line vue/no-mutating-props
            props.profileChart.profileTableData.push(pipeInfo)
            return true
        } else {
            const first = props.profileChart.profileTableData[0]
            const last =
                props.profileChart.profileTableData[props.profileChart.profileTableData.length - 1]
            if (first.upJunction === featureAttributes.ToNode) {
                // eslint-disable-next-line vue/no-mutating-props
                props.profileChart.profileTableData.unshift(pipeInfo)
                return true
            } else if (last.downJunction === featureAttributes.FromNode) {
                // eslint-disable-next-line vue/no-mutating-props
                props.profileChart.profileTableData.push(pipeInfo)
                return true
            } else {
                UseMessage.useWarningMessage('选中的管线必须收尾连接!')
                return false
            }
        }
    }
}

watch(
    props.profileChart.profileTableData,
    (newVal, oldVal) => {
        console.log('watch props.profileChart.profileTableData :>> ', newVal, oldVal)
        // if (newVal.length === oldVal.length) {
        //     return
        // }
        if (basicPipeLayerView === null) {
            basicPipeLayerView = mapView.layerViews.find(
                (view: { layer: { id: string } }) => view.layer.id === WDMapConst.BASE_PIPE,
            )
        }
        if (basicPipeLayerView !== null) {
            if (highlightHandle !== null && highlightHandle !== undefined) {
                highlightHandle.remove()
            }
            highlightHandle = basicPipeLayerView.highlight(
                props.profileChart.profileTableData.map((row: IProfileTableData) => row.Oid),
            )
            console.log('highlightHandle :>> ', highlightHandle)
        }
    },
    {
        deep: true,
    },
)

// #endregion

// #region 结果动态播放

/**
 * 进度条控制
 * @param val
 */
const onStepChange = (val: IStepChangeData) => {
    // console.log('onStepChange>>', val)
    currentIndex.value = val.index
}

/**
 * 图例中文
 * @param item
 * @param key
 */
const formatLabelAndUnit = (item: 'label' | 'unit', key: WDModelResultType) => {
    if (key === ModelResultBasicType) {
        return key
    }
    switch (item) {
        case 'label':
            // console.log(
            //     'WDModelResultCN[WDModelResultEN[key]]',
            //     WDModelResultCN[WDModelResultEN[key]],
            // )
            return WDModelResultCN[WDModelResultEN[key]]
        case 'unit':
            // console.log(
            //     'WDModelResultUnit[WDModelResultEN[key]]',
            //     WDModelResultUnit[WDModelResultEN[key]],
            // )
            return WDModelResultUnit[WDModelResultEN[key]]
        default:
            return key
    }
}

const isPlayBarShow = computed(() => {
    return props.mapLegend.legendItems.length > 0 && active.value !== ModelResultBasicType
})

const activeResultItem = (typeName: string) => {
    console.log('activeResultItem>>', typeName)
    active.value = typeName as WDModelResultType
    currentIndex.value = 0
}

// #endregion
</script>

<template>
    <div class="map-panel">
        <DhiDssWDMap
            ref="$wdMap"
            :base-map="{
                center: props.baseMap.mapInfo.center as [number,number],
                zoom: props.baseMap.mapInfo.zoom as number,
                baseUrl: props.baseMap.mapInfo.baseUrl as string,
                baseLayerType: props.baseMap.mapInfo.baseLayerType,
                wkid: props.baseMap.mapInfo.wkid as number,
                tMapTK: props.baseMap.mapInfo.tMapTK as string,
                opacity: props.baseMap.mapInfo.opacity as number,
            }"
            :baseGeoMap="{
                wdBasicGIS: props.baseMap.gis as any,
                layerControl: mapLayerControl,
                popup: setPopupContent as any,
                onRendered: props.baseMap.onRendered,
                highlightOptions: props.baseMap.highlightOptions,
            }"
            :result-map="{
                wdResultGIS: props.resultMap.gis as any,
                dataSet: props.resultMap.dataSet as any,
                index: currentIndex,
                resultItem: active,
                formatValue: formatResultValue(active),
                legend: props.mapLegend.legendItems as any,
            }"
            @on-rendered="onRendered"
        />
        <layer-control
            v-if="!isPlayBarShow && props.layerControl.isShow"
            @update="changeLayers"
            :data-set="props.layerControl.layerControlItems"
            :iconMap="props.layerControl.iconMap"
            :defaultCheckedKeys="props.layerControl.defaultCheckedKeys!"
        />
        <div v-show="props.profileChart.isShow">
            <a-space class="switch-btn" v-if="!isPlayBarShow">
                <a-typography-text>{{ ProfileChatTitle }}</a-typography-text>
                <a-switch @change="doProfileMapChange" />
            </a-space>
            <profile-chart
                v-if="!isPlayBarShow"
                :isProfileDataShow="isProfileDataShow"
                :profile-table="props.profileChart.profileTableData"
                :scenario="props.scenario"
                :fetchProfileMap="props.profileChart.fetchProfileMap"
            />
        </div>

        <animation-control
            class="animation-control"
            v-if="isPlayBarShow && props.statisticAnalysis.isShow"
            :time="props.resultMap.dataSet.time"
            :iDs="props.resultMap.dataSet.iDs"
            :data="props.resultMap.dataSet.data"
            @change="onStepChange"
        >
        </animation-control>

        <result-item
            class="result-item"
            v-if="!isEmpty(props.resultItem.resultItems)"
            :data-set="props.resultItem.resultItems"
            :typeName="activeResultItem"
            :formatterType="props.resultItem.formatterType"
            @clickResultItem="props.resultItem.fetchResultItemData"
        >
        </result-item>

        <map-legend
            v-if="isPlayBarShow"
            class="map-legend"
            :unit="formatLabelAndUnit('unit', active)"
            :title="formatLabelAndUnit('label', active)"
            :data="props.mapLegend.legendItems"
        ></map-legend>

        <!-- 统计分析 -->
        <div
            class="map-statistical-analysis"
            v-if="isPlayBarShow && props.statisticAnalysis.isShow"
        >
            <template
                v-for="item in props.statisticAnalysis.statisticAnalysisItems"
                :key="item.type"
            >
                <result-statistic
                    :unit="formatLabelAndUnit('unit', item.type as WDModelResultType)"
                    :title="formatLabelAndUnit('label', item.type as WDModelResultType)"
                    :is-active="item.type === active"
                    :data-set="item.data[currentIndex]"
                    :legend-items="props.mapLegend.legendItems"
                ></result-statistic>
            </template>
        </div>
    </div>
</template>

<style lang="scss">
@import 'https://js.geoscene.cn/4.24/geoscene/themes/light/main.css';
@import 'popup.scss';
.map-panel {
    .switch-btn {
        position: absolute;
        top: 10px;
        right: 10px;
    }

    .profile-data {
        position: absolute;
        top: 50px;
        right: 10px;
        width: 500px;
    }

    .profile-map {
        position: absolute;
        bottom: 10px;
        left: 80px;
        height: 280px;
        width: 80%;
    }

    .map-layer-control-btn {
        position: absolute;
        bottom: 10px;
        left: 30px;
    }

    .map-layer-control {
        position: absolute;
        bottom: 50px;
        left: 30px;
        width: 100px;
    }

    .animation-control {
        position: absolute;
        left: 60px;
        top: 16px;
        width: auto;
        height: 32px;
    }

    .result-item {
        position: absolute;
        top: 140px;
        left: 30px;
        height: auto;
    }

    .map-legend {
        position: absolute;
        bottom: 10px;
        left: 10px;
        // background: linear-gradient(
        //     180deg,
        //     rgba(255, 255, 255, 0.6) 0%,
        //     rgba(255, 255, 255, 0) 122%
        // );
    }
    .map-statistical-analysis {
        position: absolute;
        display: flex;
        justify-content: space-around;
        align-items: center;
        top: 50px;
        left: 0px;
        right: 0px;
    }
    .left-info-panel,
    .right-info-panel {
        display: none;
    }
}
</style>

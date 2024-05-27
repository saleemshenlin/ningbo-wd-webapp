<script setup lang="ts">
export interface ITimeSeries {
    time?: string[]
    iDs?: string[]
    data?: number[][]
}
import { ResultMap } from 'dhi-dss-domain-wd/result-map'
import {
    MapLayerControlTreeData,
    mapBasicConfig,
    autoRunStartTime,
    autoRunEndTime,
} from '@/store/AppStore/config'
import { Ref, inject, ref, watch } from 'vue'
import { API, ApiHelperExtend } from '@/api/api'
import {
    useUrbanWdResultAnalysisApiStore,
    WDModelResultEnum,
    WDModelResultType,
    ModelResultBasicType,
} from 'dhi-dss-api-store/result-service'
import { useOnlineApiStore } from 'dhi-dss-api-store/wd-domain'
import { useLegendApiStore } from 'dhi-dss-api-store/model-Configuration'
import { WDMapConst } from 'dhi-dss-mf-map-arcgis'
import {
    ActiveFeatureType,
    BasicJunctionRender,
    BasicPipeRender,
    DefaultDeviceSymbol,
    DefaultPumpSymbol,
    DefaultTankSymbol,
    DefaultValveSymbol,
    iconMap,
} from './config'
import FeatureInfo from './FeatureInfo.vue'
import AlarmInfoList from './AlarmInfoList.vue'
import StationInfo from './StationInfo.vue'
import FeatureChart from './FeatureChart.vue'
import StationSelect from './StationSelect.vue'
import {
    AlarmLogDto,
    CurrentOnlineModelData,
    DeviceDetailInfo,
    DeviceIndicatorInfo,
    DeviceIndicatorPara,
    TankStorageData,
} from '@dhicn/domain-paas-sdk-ts/wd-domain'
import {
    ALARM_LAYER,
    POPUP_LAYER,
    createPopupLayer,
    popupFeature,
    createAlarmLayer,
    defaultLayerIds,
} from './tzconfig'
import { DailyFlowInfo } from '@/api/tzwd'
import { Helper } from '@dhicn/helper'
import { flatten, values } from 'lodash'
import type { Scenario } from '@dhicn/domain-paas-sdk-ts/scenario-service'
import { getActivePinia } from 'pinia'
import { useGisQueryApiStore } from 'dhi-dss-api-store/gis-service'

const props = withDefaults(
    defineProps<{
        scenario: Scenario | null
        isOnline: boolean
    }>(),
    {
        scenario: null,
        isOnline: true,
    },
)

const $api = inject(API) as ApiHelperExtend
const domainStore = useUrbanWdResultAnalysisApiStore(getActivePinia())
const wdOnlineStore = useOnlineApiStore(getActivePinia())
const legendStore = useLegendApiStore(getActivePinia())
const gisStore = useGisQueryApiStore(getActivePinia())
const $resultMap: Ref<InstanceType<typeof ResultMap> | null> = ref(null)
const $alarmInfo: Ref<InstanceType<typeof AlarmInfoList> | null> = ref(null)
const profileChartShown = ref(false)
const alarmFeatures: Ref<ActiveFeatureType[]> = ref([])

const devices: Ref<DeviceIndicatorInfo[]> = ref([])
const activeFeature: Ref<ActiveFeatureType | null> = ref(null)
const activeItem: Ref<WDModelResultType> = ref(ModelResultBasicType)
const activeDeviceIndicators: Ref<Array<CurrentOnlineModelData & DeviceIndicatorInfo>> = ref([])
const alarmVisible = ref(true)

// 地图对象
let arcgisMap: any = null
let arcgisMapView: any = null
let pipeLayerView: any = null
let pipeLayer: any = null
let junctionLayerView: any = null
let deviceLayerView: any = null
let tankLayerView: any = null
let alarmLayerView: any = null
let highlightHandle: { remove: Function } | null = null

/**
 * 获取的模拟数据
 * @param deviceIndicatorParas
 */
const fetchModelTSData = async (modelId: string, dataType: WDModelResultEnum) => {
    if (dataType === WDModelResultEnum.Head) {
        // 水池液位特殊处理
        return await domainStore.fetchGetModelTSDataOfStructure(
            $api.global_result_service.urban_wd,
            props.scenario!.id,
            modelId,
            'Tank',
            'HD',
            dataType,
        )
    } else {
        return await domainStore.fetchGetModelTSData(
            $api.global_result_service.urban_wd,
            props.scenario!.id,
            modelId,
            dataType,
        )
    }
}

/**
 * 获取测点的模拟数据和实测数据
 * @param deviceIndicatorParas
 */
const fetchOnlineTSData = async (paras: DeviceIndicatorPara[]) => {
    const requestParams = {
        startTime: props.isOnline ? autoRunStartTime : props.scenario?.startTime,
        endTime: props.isOnline ? autoRunEndTime : props.scenario?.endTime,
        deviceIndicatorParas: paras,
    }
    const rep = await wdOnlineStore.fetchOnlineDeviceTSDataByDeviceId($api.online, requestParams)
    if (rep && rep.length > 0) {
        return rep[0]
    }
    return null
}

/**
 * ResultItem
 */
const fetchResultItemData = async (typeName: WDModelResultType, modelType: string) => {
    console.log('clickResultItem>>>', typeName, modelType)
    activeItem.value = typeName
    if (typeName === ModelResultBasicType) {
        legendStore.classifyLegendList = []
        domainStore.timeSeriesList = {}
        devices.value = []
        togglePopupLayer(true)
    } else {
        togglePopupLayer(false)
        // 清空选中的管线和节点
        activeFeature.value = null
        removeHighlightHandle()
        // 更新压力/流量测站
        if (typeName === 'Pressure') {
            devices.value = wdOnlineStore.pressureDevices
        } else if (typeName === 'Flow') {
            devices.value = wdOnlineStore.flowDevices
        } else {
            devices.value = []
        }
        // 查询图例- UI上没有体现
        await legendStore.fetchClassifyLegendData(
            $api.global_model_configuration_service.resultItem,
            modelType,
            typeName,
        )
        // 获得动态播放模拟结果
        await domainStore.fetchTimeSeriesData(
            $api.global_result_service.urban_wd,
            props.scenario!,
            typeName === 'HydroChronology' ? 'Average_Water_Age' : typeName,
        )
        // // 获得动态播放模拟结果
        // if (typeName === 'HydroChronology') {
        //     domainStore.timeSeriesList = {
        //         time: mockData.data.time ?? [],
        //         iDs: mockData.data.iDs ?? [],
        //         data: mockData.data.data ?? [],
        //     }
        // } else {
        //     await domainStore.fetchTimeSeriesData(
        //         $api.global_result_service.urban_wd,
        //         props.scenario!,
        //         typeName,
        //     )
        // }
        // console.log('domainStore.timeSeriesList :>> ', domainStore.timeSeriesList)
    }
}

/**
 * 剖面图
 * @param NodeIDs 管道ID数组
 */
const fetchProfileMap = async (NodeIDs: string[]) => {
    console.log('fetchProfileMap>>>', NodeIDs)
    return await domainStore.fetchGetProfileMapData(
        $api.global_result_service.urban_wd,
        props.scenario?.id!,
        NodeIDs,
    )
}

/**
 * 获取当前点位的指标
 */
const fetchDeviceCurrentData = async (feature: string) => {
    const deviceIndicatorPara =
        wdOnlineStore.deviceList!.find((item: DeviceDetailInfo) => item.id === feature)
            ?.deviceIndicators || []
    if (deviceIndicatorPara.length > 0) {
        const deviceResultSet = await wdOnlineStore.fetchOnlineDeviceCurrentDataV2(
            $api.online,
            deviceIndicatorPara,
        )
        if (deviceResultSet !== undefined) {
            activeDeviceIndicators.value = deviceResultSet.reduce<
                Array<CurrentOnlineModelData & DeviceIndicatorInfo>
            >((list, current) => {
                const indicator = deviceIndicatorPara.find((item) => item.id === current.id)
                if (indicator !== undefined) {
                    return [...list, { ...current, ...indicator }]
                } else {
                    return list
                }
            }, [])
        }
    }
}

/**
 *  获得节点数据
 */
const fetchJunctionPopupData = (feature: { graphic: Record<string, any> }) => {
    activeFeature.value = { ...feature, type: 'junction', attributes: feature.graphic.attributes }
    removeHighlightHandle()
    highlightHandle = junctionLayerView.highlight(feature.graphic.attributes.__OBJECTID)
    return null
}

/**
 * 获得管道数据
 */
const fetchPipePopupData = (feature: { graphic: Record<string, any> }) => {
    activeFeature.value = { ...feature, type: 'pipe', attributes: feature.graphic.attributes }
    removeHighlightHandle()
    highlightHandle = pipeLayerView.highlight(feature.graphic.attributes.__OBJECTID)
    return null
}

/**
 * 获得测点数据
 */
const fetchDevicePopupData = (feature: { graphic: Record<string, any> }) => {
    if (alarmVisible.value) {
        activeFeature.value = { ...feature, type: 'device', attributes: feature.graphic.attributes }
        fetchDeviceCurrentData(feature.graphic.attributes.MUID)
        removeHighlightHandle()
        highlightHandle = deviceLayerView.highlight(feature.graphic.attributes.__OBJECTID)
    }
    return null
}

/**
 * 获得水池数据
 */
const fetchTankPopupData = (feature: { graphic: Record<string, any> }) => {
    console.log('fetchTankPopupData :>> ', feature)
    activeFeature.value = { ...feature, type: 'tank', attributes: feature.graphic.attributes }
    removeHighlightHandle()
    highlightHandle = tankLayerView.highlight(feature.graphic.attributes.__OBJECTID)
    return null
}

/**
 * 获得报警数据
 */
const fetchAlarmPopupData = (feature: { graphic: Record<string, any> }) => {
    if ($alarmInfo.value !== null) {
        $alarmInfo.value.scrollTo(feature.graphic.attributes.indicatorName)
    }
    return null
}

const removeHighlightHandle = () => {
    if (highlightHandle !== null && highlightHandle !== undefined) {
        highlightHandle.remove()
        highlightHandle = null
    }
}

const onProfileChartShown = (shown: boolean) => {
    activeDeviceIndicators.value = []
    activeFeature.value = null
    removeHighlightHandle()
    profileChartShown.value = shown
    if (shown) {
        togglePopupLayer(false)
        pipeLayer.popupEnabled = true
    } else {
        togglePopupLayer()
        pipeLayer.popupEnabled = false
    }
}

/**
 * 更新地图样式
 * @param map
 */
const updateLayerRenderer = (map: {
    findLayerById: (id: string) => {
        renderer: any
        minScale: number
        popupEnabled: boolean
    }
}) => {
    pipeLayer = map.findLayerById(WDMapConst.BASE_PIPE)
    const junctionLayer = map.findLayerById(WDMapConst.BASE_JUNCTION)
    const deviceLayer = map.findLayerById(WDMapConst.BASE_DEVICE)
    const tankLayer = map.findLayerById(WDMapConst.BASE_TANK)
    const valveLayer = map.findLayerById(WDMapConst.BASE_VALVE)
    const pumpLayer = map.findLayerById(WDMapConst.BASE_PUMP)
    if (pipeLayer !== undefined) {
        pipeLayer.renderer = BasicPipeRender
        pipeLayer.popupEnabled = false
    }
    if (junctionLayer !== undefined) {
        junctionLayer.renderer = BasicJunctionRender
        junctionLayer.popupEnabled = false
    }
    if (deviceLayer !== undefined) {
        deviceLayer.renderer = {
            type: 'simple',
            symbol: DefaultDeviceSymbol,
        }
        deviceLayer.minScale = 200000
        deviceLayer.popupEnabled = false
    }
    if (tankLayer !== undefined) {
        tankLayer.renderer = {
            type: 'simple',
            symbol: DefaultTankSymbol,
        }
        tankLayer.popupEnabled = false
    }
    if (valveLayer !== undefined) {
        valveLayer.renderer = {
            type: 'simple',
            symbol: DefaultValveSymbol,
        }
        valveLayer.popupEnabled = false
    }
    if (pumpLayer !== undefined) {
        pumpLayer.renderer = {
            type: 'simple',
            symbol: DefaultPumpSymbol,
        }
        pumpLayer.popupEnabled = false
    }
}

/**
 * 更新地图图层View
 * @param map
 */
const updateLayerView = (view: {
    highlightOptions: any
    layerViews: any
    popup: { clear: () => void }
    on: any
    hitTest: any
}) => {
    if (pipeLayerView === null) {
        pipeLayerView = view.layerViews.find(
            (view: { layer: { id: string } }) => view.layer.id === WDMapConst.BASE_PIPE,
        )
        pipeLayerView.highlightOptions = {
            color: '#ed8326',
            haloColor: '#ed8326',
            haloOpacity: 0.9,
            fillOpacity: 0.5,
            shadowColor: 'black',
            shadowOpacity: 0.5,
        }
    }
    if (junctionLayerView === null) {
        junctionLayerView = view.layerViews.find(
            (view: { layer: { id: string } }) => view.layer.id === WDMapConst.BASE_JUNCTION,
        )
        junctionLayerView.highlightOptions = {
            color: '#ed8326',
            haloColor: '#ed8326',
            haloOpacity: 0.9,
            fillOpacity: 0.5,
            shadowColor: 'black',
            shadowOpacity: 0.5,
        }
    }
    if (deviceLayerView === null) {
        deviceLayerView = view.layerViews.find(
            (view: { layer: { id: string } }) => view.layer.id === WDMapConst.BASE_DEVICE,
        )
        deviceLayerView.highlightOptions = {
            color: '#ed8326',
            haloColor: '#ed8326',
            haloOpacity: 0.9,
            fillOpacity: 0.5,
            shadowColor: 'black',
            shadowOpacity: 0.5,
        }
    }
    if (tankLayerView === null) {
        tankLayerView = view.layerViews.find(
            (view: { layer: { id: string } }) => view.layer.id === WDMapConst.BASE_TANK,
        )
        tankLayerView.highlightOptions = {
            color: '#ed8326',
            haloColor: '#ed8326',
            haloOpacity: 0.9,
            fillOpacity: 0.5,
            shadowColor: 'black',
            shadowOpacity: 0.5,
        }
    }
}

/**
 * 增加显示Popup的图层
 * @param map
 * @param view
 */
const doPopupDataUpdate = async (
    tankStorage: TankStorageData[],
    dailyWaterVolumeMap: Record<string, DailyFlowInfo[]>,
) => {
    if (activeItem.value !== ModelResultBasicType || profileChartShown.value) {
        togglePopupLayer(false)
    } else {
        popupFeature.features.forEach((feature) => {
            const { type, name } = feature.properties
            if (type === '水厂蓄水量') {
                const tank = tankStorage.find((t) => t.tankName === name)
                if (tank !== undefined) {
                    feature.properties.schedule = Helper.toFixed(
                        tank.totalStorageValue,
                        0,
                    ).toString()
                    feature.properties.current = Helper.toFixed(tank.storageValue, 0).toString()
                } else {
                    feature.properties.schedule = '-'
                    feature.properties.current = '-'
                }
            } else {
                const group = flatten(values(dailyWaterVolumeMap)).find((t) => t.groupName === name)
                if (group !== undefined) {
                    feature.properties.schedule = Helper.toFixed(group.forecastValue, 2).toString()
                    feature.properties.current = Helper.toFixed(group.currentValue, 2).toString()
                } else {
                    feature.properties.schedule = '-'
                    feature.properties.current = '-'
                }
            }
        })
        if (arcgisMap === null) {
            console.info('arcgisMap not found :>> ', arcgisMap)
            return
        }
        const lastPopupLayer = arcgisMap.findLayerById(POPUP_LAYER)
        if (lastPopupLayer !== undefined) {
            arcgisMap.layers.remove(lastPopupLayer)
        }
        const popupLayer = createPopupLayer()
        arcgisMap.layers.push(popupLayer)
    }
}

const togglePopupLayer = (visible = true) => {
    alarmVisible.value = visible
    const deviceLayer = arcgisMap.findLayerById(WDMapConst.BASE_DEVICE)
    if (deviceLayer !== undefined) {
        deviceLayer.visible = visible
    }
    if (visible) {
        emit('popup-render')
    } else {
        alarmFeatures.value = []
        let lastAlarmLayer = arcgisMap.findLayerById(ALARM_LAYER)
        if (lastAlarmLayer !== undefined) {
            arcgisMap.layers.remove(lastAlarmLayer)
            lastAlarmLayer = null
        }
        const lastPopupLayer = arcgisMap.findLayerById(POPUP_LAYER)
        if (lastPopupLayer !== undefined) {
            arcgisMap.layers.remove(lastPopupLayer)
        }
    }
}

const doAlarmDataUpdate = async (alarmLogs: Map<string, AlarmLogDto>) => {
    if (activeItem.value !== ModelResultBasicType || profileChartShown.value) {
        togglePopupLayer(false)
    } else {
        if (arcgisMap === null) {
            console.info('arcgisMap not found :>> ', arcgisMap)
            return
        }
        const lastAlarmLayer = arcgisMap.findLayerById(ALARM_LAYER)
        if (lastAlarmLayer !== undefined) {
            arcgisMap.layers.remove(lastAlarmLayer)
        }
        if (alarmLogs.size > 0) {
            alarmFeatures.value = Array.from(alarmLogs.values()).map((item) => ({
                attributes: item,
                type: 'alarm',
                graphic: null as any,
            }))
            // console.log('alarmFeatures.value :>> ', alarmFeatures.value)

            const alarmLayer = createAlarmLayer(alarmLogs)
            arcgisMap.layers.push(alarmLayer)
            arcgisMapView.whenLayerView(alarmLayer).then((layerView: any) => {
                alarmLayerView = layerView
                alarmLayerView.highlightOptions = {
                    color: '#ed8326',
                    haloColor: '#ed8326',
                    haloOpacity: 0.9,
                    fillOpacity: 0.5,
                    shadowColor: 'black',
                    shadowOpacity: 0.5,
                }
            })
        }
    }
}

const emit = defineEmits(['popup-render'])

defineExpose({
    doPopupDataUpdate,
    doAlarmDataUpdate,
})

const onRendered = (
    map: {
        findLayerById: (id: string) => {
            renderer: any
            minScale: number
            popupEnabled: boolean
        }
        layers: any
    },
    view: {
        whenLayerView: any
        highlightOptions: any
        layerViews: any
        popup: { clear: () => void }
        on: any
        hitTest: any
    },
) => {
    if (arcgisMap === null) {
        arcgisMap = map
        arcgisMapView = view
        view.highlightOptions = {
            color: '#ed8326',
            haloColor: '#ed8326',
            haloOpacity: 0.9,
            fillOpacity: 0.5,
            shadowColor: 'black',
            shadowOpacity: 0.5,
        }
    }
    updateLayerRenderer(map)
    console.debug('onRendered :>> ', 'updateLayerRenderer')
    // emit('popup-render')

    // remove highlight feature
    view.on('click', function (event: any) {
        // Search for graphics at the clicked location. View events can be used
        // as screen locations as they expose an x,y coordinate that conforms
        // to the ScreenPoint definition.
        view.hitTest(event).then(function (response: any) {
            // only get the graphics returned from myLayer
            const graphicHits = response.results?.filter(
                (hitResult: any) =>
                    hitResult.type === 'graphic' &&
                    [
                        WDMapConst.BASE_PIPE,
                        WDMapConst.BASE_JUNCTION,
                        WDMapConst.BASE_DEVICE,
                        WDMapConst.BASE_TANK,
                        ALARM_LAYER,
                    ].includes(hitResult.layer.id),
            )
            if (profileChartShown.value) {
                activeFeature.value = null
                removeHighlightHandle()
            } else if (graphicHits.length === 0) {
                activeFeature.value = null
                removeHighlightHandle()
            } else {
                updateLayerView(view)
                const graphic = graphicHits[0]
                const layerId = graphic.layer.id
                switch (layerId) {
                    case WDMapConst.BASE_PIPE:
                        fetchPipePopupData(graphic)
                        break
                    case WDMapConst.BASE_JUNCTION:
                        fetchJunctionPopupData(graphic)
                        break
                    case WDMapConst.BASE_DEVICE:
                        fetchDevicePopupData(graphic)
                        break
                    case WDMapConst.BASE_TANK:
                        fetchTankPopupData(graphic)
                        break
                    case ALARM_LAYER:
                        fetchAlarmPopupData(graphic)
                        break
                    default:
                        break
                }
            }
        })
    })
}

watch(domainStore.profileTableData, (list) => {
    if (list.length === 0) {
        arcgisMapView!.popup.clear()
        arcgisMapView!.popup.close()
    }
})
</script>

<template>
    <div class="map-panel">
        <result-map
            ref="$resultMap"
            :scenario="props.scenario!"
            :base-map="{
            gis: {
                pipe: gisStore.gisMap.get('wd-pipe'),
                junction: gisStore.gisMap.get('wd-junction'),
            },
            mapInfo: {
                tMapTK: mapBasicConfig.tk,
                center: mapBasicConfig.center,
                zoom: mapBasicConfig.zoom,
                baseUrl: mapBasicConfig.baseUrl,
                baseLayerType: mapBasicConfig.baseLayerType as 'WMTS',
                wkid: mapBasicConfig.wkid,
                opacity:mapBasicConfig.opacity
            },
        } as any"
            :popup="{
            fetchTSResult: fetchModelTSData,
            devicePopupData:( ()=>{}) as any,
            popupCallBack: {
                junction: ()=>null,
                pipe: ()=>null,
                device: ()=>null,
                tank:  ()=>null,
            },
        }"
            :result-map="{
            gis: {
                pipe: gisStore.gisMap.get('wd-pipe'),
                junction: gisStore.gisMap.get('wd-junction'),
            },
            dataSet: domainStore.timeSeriesList,
            renderType: 'grade',
        }as any"
            :result-item="{
            resultItems: legendStore.resultItem,
            fetchResultItemData: fetchResultItemData  as any,
        }"
            :map-legend="{
                legendItems: legendStore.classifyLegendList,
            }"
            :profile-chart="{
                isShow: true,
                profileTableData: domainStore.profileTableData,
                fetchProfileMap: fetchProfileMap,
            }"
            :layer-control="{
                isShow: true,
                layerControlItems: MapLayerControlTreeData,
                iconMap: iconMap,
                defaultCheckedKeys: defaultLayerIds,
            }"
            :statistic-analysis="{
            isShow: true,
        }  as any"
            @on-rendered="onRendered"
            @onProfileChartShown="onProfileChartShown"
        >
        </result-map>
        <StationSelect
            v-if="devices.length > 0 && props.isOnline"
            :devices="devices"
            :item="activeItem"
            :fetchTSResult="fetchOnlineTSData"
        ></StationSelect>
        <StationInfo
            :feature="activeFeature"
            :indicators="activeDeviceIndicators"
            :fetchTSResult="fetchOnlineTSData"
            :loading="false"
        ></StationInfo>
        <FeatureInfo :feature="activeFeature"></FeatureInfo>
        <FeatureChart :feature="activeFeature" :fetchTSResult="fetchModelTSData"></FeatureChart>

        <AlarmInfoList
            ref="$alarmInfo"
            v-if="props.isOnline && alarmFeatures.length > 0"
            :features="alarmFeatures"
            :feature="activeFeature"
        ></AlarmInfoList>
    </div>
</template>

<style lang="scss">
.map-panel {
    height: 100%;
}

.map-panel .geoscene-ui .geoscene-popup {
    display: none;
}

.map-panel .switch-btn {
    left: 20px;
    right: auto;
}
.result-item-main {
    .arco-menu,
    .arco-menu-item,
    .arco-menu-item:hover {
        background-color: transparent;
    }

    .menu-item_label {
        display: none;
    }

    .arco-menu-selected {
        &:hover {
            border-radius: 10px;
        }
        border-radius: 10px;
        opacity: 0.8;
        background-color: transparent;
        box-sizing: border-box;
        border: 1px solid rgba(var(--primary-6));
        // border-image 不支持圆角
        // border-image: linear-gradient(
        //         49deg,
        //         rgba(20, 144, 255, 0.6) 5%,
        //         rgba(255, 255, 255, 0) 117%
        //     )
        //     1;

        backdrop-filter: blur(388px);
    }

    .arco-menu-inner {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 4px;
    }

    .arco-menu-item {
        line-height: 60px;
        width: 62px;
        .img {
            width: 32px;
            height: 32px;
            margin: -10px 2px;
        }
    }
}
.geoscene-view .geoscene-view-surface--inset-outline:focus::after {
    outline: auto 0px Highlight !important;
    outline: auto 0px -webkit-focus-ring-color !important;
}

.map-layer-control-main {
    background-color: rgba(var(--primary-7), 0.1);
}
</style>

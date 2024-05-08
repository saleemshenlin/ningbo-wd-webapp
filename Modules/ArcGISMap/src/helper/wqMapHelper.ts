import { IBasicGIS } from './../pages/WQMap/types'
import { IDataSet, ILegendItem } from './../store/types'
import SimpleRenderer from '@geoscene/core/renderers/SimpleRenderer'
import {
    ArrowSymbol,
    ArrowSymbolLine,
    ArrowSymbolNegative,
    DefaultDeviceSymbol,
    DefaultDevicePressureSymbol,
    DefaultDeviceFlowSymbol,
    DefaultDeviceEvaluationSymbol,
    DefaultDeviceFactorySymbol,
} from '../symbol/wdSymbol'
import Color from '@geoscene/core/Color'
import GeoJSONLayer from '@geoscene/core/layers/GeoJSONLayer'
import LabelClass from '@geoscene/core/layers/support/LabelClass'
import {
    BASE_RIVER,
    MODEL_RIVER,
    BASE_SECTION_EXAM,
    BASE_SEWAGE_PLANT,
    BASE_INDUSTRIAL_ENTERPRISE,
    BASE_RAIN_GAUGE,
    BASE_RESERVOIR,
    BASE_HYDROLOGICAL_STATION,
    BASE_DRAINAGE_BASIN,
    BASE_DISTRICT,
    BASE_POLYGON,
} from '../store/const'
import { transferJSONToUrl } from './jsonToUrl'
import ArcGISMap from '@geoscene/core/Map'
import MapView from '@geoscene/core/views/MapView'
import { addZoomToLayerCallback } from './zoomToLayer'
import { rgbToColor } from './rgbToColor'
import PictureMarkerSymbol from '@geoscene/core/symbols/PictureMarkerSymbol'
import { valueExpression, uniqueValueInfos } from './config'
import { CZDRAINAGEBASIN, CZDISTRICT, CZDRAINAGEBASINSymbol } from './dmaHelper'
// #region basic gis

// 河道图层的样式
export function makeBaseRiverLayer(
    geojson: string,
    setPopupContent: (feature: { graphic: __geoscene.Graphic }) => HTMLDivElement | null,
): GeoJSONLayer {
    const renderer: __geoscene.UniqueValueRenderer = {
        defaultSymbol: { type: 'simple-line', color: '#165DFF', width: 3 } as any,
        type: 'unique-value',
        // valueExpression,
        // uniqueValueInfos,
    } as any

    const url = transferJSONToUrl(geojson)
    const geojsonLayer = new GeoJSONLayer({
        id: BASE_RIVER,
        url,
        copyright: 'DHI China',
        outFields: ['*'],
        fields: [
            { name: 'Id', type: 'string' },
            { name: 'ModelFeatureId', type: 'string' },
            { name: 'RiverName', type: 'string' },
            { name: 'Chainage', type: 'double' },
            { name: 'LeftDam', type: 'double' },
            { name: 'RightDam', type: 'double' },
            { name: 'BottomDam', type: 'double' },
        ],
        renderer,
        popupTemplate: {
            title: `河道相关信息`,
            content: setPopupContent,
            outFields: ['*'],
        },
        popupEnabled: false,
        visible: false,
    })
    return geojsonLayer
}

/** 设备图层 */
export function makeBaseDeviceCommonLayer(
    type: string,
    geojson: string,
    symbol: PictureMarkerSymbol = setSymbol(type),
    setPopupContent: (feature: { graphic: __geoscene.Graphic }) => HTMLDivElement | null,
): GeoJSONLayer {
    const renderer: __geoscene.renderers.SimpleRenderer = {
        type: 'simple',
        symbol, // DefaultDeviceSymbol,
    } as any

    // const clusterConfig = setClusterConfig(type)

    const geojsonLayer = new GeoJSONLayer({
        id: setDeviceLayerId(type),
        url: transferJSONToUrl(geojson),
        // featureReduction: clusterConfig,
        copyright: 'DHI China',
        outFields: ['*'],
        fields: [
            { name: 'MUID', type: 'string' },
            { name: 'name', type: 'string' },
            { name: 'label', type: 'string' },
            { name: 'description', type: 'string' },
            { name: 'group', type: 'string' },
        ],
        renderer,
        popupTemplate: {
            title: `${type}: {name}`,
            content: setPopupContent,
            outFields: ['*'],
            overwriteActions: true, // remove zoom to button
        },
    })

    return geojsonLayer
}

/** 行政区域 */
export function makeBaseDistrictLayer(
    geojson: string,
    setPopupContent: (feature: { graphic: __geoscene.Graphic }) => HTMLDivElement | null,
): GeoJSONLayer {
    const defaultSym = {
        type: 'simple-fill', // autocasts as new SimpleMarkerSymbol()
        size: 25,
        color: [15, 27, 45, 0],
        outline: {
            width: 3,
            color: [51, 124, 233, 0.8],
            style: 'short-dot',
        },
    }
    const uniqueValueInfos = CZDISTRICT.map((dma) => {
        return {
            value: dma,
            symbol: defaultSym,
        }
    })

    const renderer: __geoscene.UniqueValueRenderer = {
        defaultSymbol: defaultSym as any,
        type: 'unique-value', // autocasts as new UniqueValueRenderer()
        field: 'OBJECTID',
        uniqueValueInfos,
    } as any

    const geojsonLayer = new GeoJSONLayer({
        id: BASE_DISTRICT,
        url: transferJSONToUrl(geojson),
        copyright: 'DHI China',
        outFields: ['*'],
        fields: [
            { name: 'MUID', type: 'long' },
            { name: 'NAME', type: 'string' },
            { name: 'PAC', type: 'double' },
            { name: 'SHAPE_Leng', type: 'double' },
            { name: 'SHAPE_Area', type: 'double' },
        ],
        renderer,
        popupTemplate: {
            title: `行政区域相关信息`,
            content: setPopupContent,
            outFields: ['*'],
        },
        popupEnabled: false,
    })
    return geojsonLayer
}

/** 流域图层 */
export function makeBaseDrainageBasinLayer(
    geojson: string,
    setPopupContent: (feature: { graphic: __geoscene.Graphic }) => HTMLDivElement | null,
): GeoJSONLayer {
    const defaultSym = {
        type: 'simple-fill', // autocasts as new SimpleMarkerSymbol()
        size: 25,
        color: [15, 27, 45, 0.2],
        style: 'solid',
        outline: {
            width: 1,
            color: [51, 124, 233, 0.5],
        },
    }
    const renderer: __geoscene.UniqueValueRenderer = {
        defaultSymbol: defaultSym as any,
        type: 'unique-value', // autocasts as new UniqueValueRenderer()
        field: 'name',
        uniqueValueInfos: CZDRAINAGEBASINSymbol,
    } as any
    // 区域显示名称
    const statesLabelClass = new LabelClass({
        labelExpressionInfo: { expression: '$feature.name' },
        symbol: {
            type: 'text', // autocasts as new TextSymbol()
            color: 'black',
            haloSize: 2,
        },
    })

    const geojsonLayer = new GeoJSONLayer({
        id: BASE_DRAINAGE_BASIN,
        url: transferJSONToUrl(geojson),
        copyright: 'DHI China',
        outFields: ['*'],
        fields: [
            { name: 'MUID', type: 'string' },
            { name: 'name', type: 'string' },
        ],
        renderer,
        popupTemplate: {
            title: `流域相关信息`,
            content: setPopupContent,
            outFields: ['*'],
        },
        popupEnabled: false,
        labelingInfo: [statesLabelClass],
    })
    return geojsonLayer
}

const convertPictureMarkerSymbol = (url: any): any => {
    // 如果url为空,则取默认值
    // console.log('convertPictureMarkerSymbol url>>>', url)
    if (url !== '' && url !== undefined && url !== null) {
        return {
            type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
            url,
            width: 30,
            height: 37,
            yoffset: -9,
            xoffset: -7,
        } as any
    }
    return ''
}

/** 设置图层ID  */
const setDeviceLayerId = (type: string): string => {
    let deviceId = ''
    switch (type) {
        case 'sectionExam':
            deviceId = BASE_SECTION_EXAM
            break
        case 'sewagePlant':
            deviceId = BASE_SEWAGE_PLANT
            break
        case 'industrialEnterprise':
            deviceId = BASE_INDUSTRIAL_ENTERPRISE
            break
        case 'rainGauge':
            deviceId = BASE_RAIN_GAUGE
            break
        case 'reservoir':
            deviceId = BASE_RESERVOIR
            break
        case 'hydrologicalStation':
            deviceId = BASE_HYDROLOGICAL_STATION
            break
        default:
            break
    }
    return deviceId
}

/** 设置设备图标 */
const setSymbol = (type: string): PictureMarkerSymbol => {
    let symbolIcon: PictureMarkerSymbol = DefaultDeviceSymbol
    switch (type) {
        case 'sectionExam':
            symbolIcon = DefaultDeviceEvaluationSymbol
            break
        case 'sewagePlant':
            symbolIcon = DefaultDeviceFactorySymbol
            break
        case 'industrialEnterprise':
            symbolIcon = DefaultDevicePressureSymbol
            break
        case 'reservoir':
            symbolIcon = DefaultDeviceFlowSymbol
            break
        case 'rainGauge':
            symbolIcon = DefaultDeviceSymbol
            break
        case 'hydrologicalStation':
            symbolIcon = DefaultDeviceSymbol
            break
        default:
            break
    }
    return symbolIcon
}

export async function renderBaseLayer(
    map: ArcGISMap,
    view: MapView,
    props: IBasicGIS,
    cb: (feature: { graphic: __geoscene.Graphic }, layerId: string) => HTMLDivElement | null,
    onRendered?: (
        layer: __geoscene.GeoJSONLayer,
        layerView: __geoscene.GeoJSONLayerView,
        view: __geoscene.MapView,
    ) => void,
    deviceTypeConst?: Record<string, any>[],
    layerControl?: string[],
): Promise<void> {
    // 河道 不显示
    if (props.river !== undefined && map.findLayerById(BASE_RIVER) === undefined) {
        const riverLayer = makeBaseRiverLayer(props.river, (feature) => {
            return cb(feature, BASE_RIVER)
        })
        addZoomToLayerCallback(riverLayer, view)
        if (onRendered !== undefined) {
            view.whenLayerView(riverLayer).then((layerView) => {
                onRendered(riverLayer, layerView, view)
            })
        }
        map.add(riverLayer)
    }
    // 设备图层 - sectionExam -考核断面
    if (props.sectionExam !== undefined && map.findLayerById(BASE_SECTION_EXAM) === undefined) {
        const symbol = deviceTypeConst?.find((item) => item.key === 'sectionExam')?.image
        const sectionExamLayer = makeBaseDeviceCommonLayer(
            'sectionExam',
            props.sectionExam,
            convertPictureMarkerSymbol(symbol) === ''
                ? DefaultDeviceFlowSymbol
                : convertPictureMarkerSymbol(symbol),
            (feature) => {
                return cb(feature, BASE_SECTION_EXAM)
            },
        )
        // 设置图标
        // addZoomToLayerCallback(sectionExamLayer, view)
        if (onRendered !== undefined) {
            view.whenLayerView(sectionExamLayer).then((layerView) => {
                onRendered(sectionExamLayer, layerView, view)
            })
        }
        map.add(sectionExamLayer)
    }
    // 设备图层 - sewagePlant -污水厂
    if (props.sewagePlant !== undefined && map.findLayerById(BASE_SEWAGE_PLANT) === undefined) {
        const symbol = deviceTypeConst?.find((item) => item.key === 'sewagePlant')?.image
        const sewagePlantLayer = makeBaseDeviceCommonLayer(
            'sewagePlant',
            props.sewagePlant,
            convertPictureMarkerSymbol(symbol) === ''
                ? DefaultDeviceFlowSymbol
                : convertPictureMarkerSymbol(symbol),
            (feature) => {
                return cb(feature, BASE_SEWAGE_PLANT)
            },
        )
        // addZoomToLayerCallback(sewagePlantLayer, view)
        if (onRendered !== undefined) {
            view.whenLayerView(sewagePlantLayer).then((layerView) => {
                onRendered(sewagePlantLayer, layerView, view)
            })
        }
        map.add(sewagePlantLayer)
    }

    // 设备图层 - industrialEnterprise -工业企业
    if (
        props.industrialEnterprise !== undefined &&
        map.findLayerById(BASE_INDUSTRIAL_ENTERPRISE) === undefined
    ) {
        const symbol = deviceTypeConst?.find((item) => item.key === 'industrialEnterprise')?.image
        const industrialEnterpriseLayer = makeBaseDeviceCommonLayer(
            'industrialEnterprise',
            props.industrialEnterprise,
            convertPictureMarkerSymbol(symbol) === ''
                ? DefaultDeviceFlowSymbol
                : convertPictureMarkerSymbol(symbol),
            (feature) => {
                return cb(feature, BASE_INDUSTRIAL_ENTERPRISE)
            },
        )
        // addZoomToLayerCallback(industrialEnterpriseLayer, view)
        if (onRendered !== undefined) {
            view.whenLayerView(industrialEnterpriseLayer).then((layerView) => {
                onRendered(industrialEnterpriseLayer, layerView, view)
            })
        }
        map.add(industrialEnterpriseLayer)
    }

    // 设备图层 - rainGauge -雨量站
    if (props.rainGauge !== undefined && map.findLayerById(BASE_RAIN_GAUGE) === undefined) {
        const symbol = deviceTypeConst?.find((item) => item.key === 'rainGauge')?.image
        const rainGaugeLayer = makeBaseDeviceCommonLayer(
            'rainGauge',
            props.rainGauge,
            convertPictureMarkerSymbol(symbol) === ''
                ? DefaultDeviceFlowSymbol
                : convertPictureMarkerSymbol(symbol),
            (feature) => {
                return cb(feature, BASE_RAIN_GAUGE)
            },
        )
        // addZoomToLayerCallback(rainGaugeLayer, view)
        if (onRendered !== undefined) {
            view.whenLayerView(rainGaugeLayer).then((layerView) => {
                onRendered(rainGaugeLayer, layerView, view)
            })
        }
        map.add(rainGaugeLayer)
    }

    // 设备图层 - reservoir -水库
    if (props.reservoir !== undefined && map.findLayerById(BASE_RESERVOIR) === undefined) {
        const symbol = deviceTypeConst?.find((item) => item.key === 'reservoir')?.image
        const reservoirLayer = makeBaseDeviceCommonLayer(
            'reservoir',
            props.reservoir,
            convertPictureMarkerSymbol(symbol) === ''
                ? DefaultDeviceFlowSymbol
                : convertPictureMarkerSymbol(symbol),
            (feature) => {
                return cb(feature, BASE_RESERVOIR)
            },
        )
        // addZoomToLayerCallback(reservoirLayer, view)
        if (onRendered !== undefined) {
            view.whenLayerView(reservoirLayer).then((layerView) => {
                onRendered(reservoirLayer, layerView, view)
            })
        }
        map.add(reservoirLayer)
    }

    // 设备图层 - hydrologicalStation -水文站
    if (
        props.hydrologicalStation !== undefined &&
        map.findLayerById(BASE_HYDROLOGICAL_STATION) === undefined
    ) {
        const symbol = deviceTypeConst?.find((item) => item.key === 'hydrologicalStation')?.image
        const hydrologicalStationLayer = makeBaseDeviceCommonLayer(
            'hydrologicalStation',
            props.hydrologicalStation,
            convertPictureMarkerSymbol(symbol) === ''
                ? DefaultDeviceFlowSymbol
                : convertPictureMarkerSymbol(symbol),
            (feature) => {
                return cb(feature, BASE_HYDROLOGICAL_STATION)
            },
        )
        // addZoomToLayerCallback(hydrologicalStationLayer, view)
        if (onRendered !== undefined) {
            view.whenLayerView(hydrologicalStationLayer).then((layerView) => {
                onRendered(hydrologicalStationLayer, layerView, view)
            })
        }
        map.add(hydrologicalStationLayer)
    }

    // 行政边界 图层序号:1
    if (props.district !== undefined && map.findLayerById(BASE_DISTRICT) === undefined) {
        const districtLayer = makeBaseDistrictLayer(props.district, (feature) => {
            return cb(feature, BASE_DISTRICT)
        })
        if (onRendered !== undefined) {
            view.whenLayerView(districtLayer).then((layerView) => {
                onRendered(districtLayer, layerView, view)
            })
        }
        map.add(districtLayer)
        // reorderLayer(map, BASE_DISTRICT, 100)
    }

    // 四大流域 图层序号:2
    if (props.drainageBasin !== undefined && map.findLayerById(BASE_DRAINAGE_BASIN) === undefined) {
        const drainageBasinLayer = makeBaseDrainageBasinLayer(props.drainageBasin, (feature) => {
            return cb(feature, BASE_DRAINAGE_BASIN)
        })
        if (onRendered !== undefined) {
            view.whenLayerView(drainageBasinLayer).then((layerView) => {
                onRendered(drainageBasinLayer, layerView, view)
            })
        }
        map.add(drainageBasinLayer)

        // 位于map最下面
        // reorderLayer(map, BASE_DRAINAGE_BASIN, 10)
    }

    // 移除掉底图 baseLayer
    // const baseLayer = map.findLayerById('baseLayer')
    // const baseLayerLabel = map.findLayerById('baseLayer-label')
    // if (baseLayer) {
    //     map.removeMany([baseLayer, baseLayerLabel])
    // }

    // 查看所有的图层
    // console.log('map.allLayers>>>', map.allLayers)
    controlLayerVisible(map, layerControl!)
}

/** 图层顺序调整 */
export const reorderLayer = (map: ArcGISMap, layerId: string, index: number): void => {
    const layer = map.findLayerById(layerId)
    if (layer !== undefined) {
        map.reorder(layer, index)
    }
}

export function toggleBaseLayerVisible(map: ArcGISMap, visible = false): void {
    const riverLayer = map.findLayerById(BASE_RIVER)
    if (riverLayer !== undefined) {
        riverLayer.visible = visible
    }
}

export function toggleResultLayerVisible(map: ArcGISMap, visible = false): void {
    const riverLayer = map.findLayerById(MODEL_RIVER)
    if (riverLayer !== undefined) {
        riverLayer.visible = visible
    }
}

// #endregion basic gis

// #region result gis
export function makeResultRiverLayer(geojson: string, dateTimes: string[]): GeoJSONLayer {
    const renderer: __geoscene.SimpleRenderer = {
        type: 'unique-value',
        defaultSymbol: {
            type: 'simple-line',
            width: 3.5,
            style: 'solid',
            color: '#1fc6ff',
        },
        // valueExpression: "When($feature.f0 > 0, 'true', $feature.f0 == 0, '0', 'false')",
        // uniqueValueInfos: [
        //     {
        //         value: 'true',
        //         symbol: ArrowSymbol,
        //     },
        //     {
        //         value: '0',
        //         symbol: ArrowSymbolLine,
        //     },
        //     {
        //         value: 'false',
        //         symbol: ArrowSymbolNegative,
        //     },
        //     {
        //         value: 'null',
        //         symbol: {
        //             type: 'simple-line',
        //             width: 3.5,
        //             style: 'solid',
        //             color: '#2c296d',
        //         },
        //     },
        // ],
    } as any

    const url = transferJSONToUrl(geojson)
    const geojsonLayer = new GeoJSONLayer({
        id: MODEL_RIVER,
        url,
        copyright: 'DHI China',
        outFields: ['*'],
        renderer,
        fields: [
            { name: 'ModelFeatureId', type: 'string' },
            ...dateTimes.reduce<any[]>(
                (list, date, index) => [
                    ...list,
                    {
                        name: `r${index}`,
                        type: 'double',
                    },
                    {
                        name: `f${index}`,
                        type: 'double',
                    },
                ],
                [],
            ),
            { name: 'index', type: 'long' },
        ],
        visible: false,
        editingEnabled: true,
    })

    return geojsonLayer
}

export async function renderResultLayer(
    map: ArcGISMap,
    gisProps: IBasicGIS,
    dateTimes: string[],
    view: MapView,
): Promise<void> {
    console.log('renderResultLayer>>>', gisProps)
    const riverLayer = map.findLayerById(MODEL_RIVER)
    const layers = []
    if (riverLayer !== undefined) {
        layers.push(riverLayer)
    }
    if (layers.length > 0) {
        map.removeMany([riverLayer])
    }
    if (gisProps.river !== undefined) {
        // console.log('makeResultRiverLayer>>>', gisProps.river)
        const riverLayer = makeResultRiverLayer(gisProps.river, dateTimes) // false
        addZoomToLayerCallback(riverLayer, view)
        map.add(riverLayer)
    }
}

// #endregion result gis

// #region  渲染结果
export async function updateResultSet(
    map: ArcGISMap,
    dataSet: IDataSet,
    resultItem: string,
    legends: ILegendItem[],
    formatValue: (val: number) => number,
    layerControl?: string[],
): Promise<void> {
    // console.log('渲染结果>>>>', dataSet, resultItem, legends)
    console.time('queryFeatures :>> ')
    // toggleBaseLayerVisible(map, false)
    let layer: GeoJSONLayer
    layer = map.findLayerById(MODEL_RIVER) as GeoJSONLayer
    // console.log('renderResultLayer>>>', layer.visible)
    ;(layer.renderer as __geoscene.UniqueValueRenderer).valueExpression = `return "null"`
    const oldFeatures = await layer.queryFeatures()
    // console.log('oldFeatures>>', oldFeatures)
    console.timeEnd('queryFeatures :>> ')
    const features = dataSet.iDs.reduce<__geoscene.Graphic[]>((featureList, id, index) => {
        const feature = oldFeatures.features[index]
        // console.log('feature :>> ', feature, id, dataSet.data[index])
        if (feature !== undefined) {
            for (let timeIndex = 0; timeIndex < dataSet.time.length; timeIndex++) {
                const result = dataSet.data[index][timeIndex]
                feature.attributes[`r${timeIndex}`] = Math.abs(formatValue(result))
                // 不需要流向
                // if (layer.id === MODEL_RIVER) {
                //     feature.attributes[`f${timeIndex}`] = formatValue(result)
                // }
            }
            // if (index === 100) {
            //     console.timeEnd('update Feature attributes :>> ')
            // }
            return [...featureList, feature]
        } else {
            console.info(id, '>> not found')
            return featureList
        }
    }, [])
    console.time('applyEdits :>> ')
    await layer.applyEdits({
        updateFeatures: features,
    })
    console.timeEnd('applyEdits :>> ')
    updateRender(resultItem, layer.renderer as SimpleRenderer, legends)
    if (layerControl?.includes(MODEL_RIVER)) {
        layer.visible = true
    }
    // layer.visible = true
}

export function makeColorStopsWithValue(
    legends: ILegendItem[],
): Array<{ value: number; color: Color }> {
    return legends.reduce<Array<{ value: number; color: Color }>>((prev, step, index) => {
        if (index === legends.length - 1) {
            return [...prev, { value: step.minValue, color: rgbToColor(step) }]
        }
        return [...prev, { value: step.maxValue, color: rgbToColor(step) }]
    }, [])
}

export function makeColorStops(
    legends: ILegendItem[],
): Array<{ value: number | string; color: Color }> {
    const resLegend = legends.reduce<Array<{ value: number | string; color: Color }>>(
        (prev, step, index) => {
            if (index === 0) {
                return [{ value: step.grade, color: rgbToColor(step) }]
            }
            return [...prev, { value: step.grade, color: rgbToColor(step) }]
        },
        [],
    )

    console.log('resLegend :>> ', resLegend)
    return resLegend
}

export function makeLineSize(legends: ILegendItem[]): __geoscene.SizeVariable {
    const referenceScale = 9244650
    return {
        type: 'size',
        field: 'r0',
        minDataValue: legends[0].minValue,
        maxDataValue: legends[legends.length - 1].minValue,
        minSize: {
            type: 'size',
            valueExpression: '$view.scale',
            // adjust the minSize of the features by scale
            stops: [
                { value: referenceScale, size: 4 },
                { value: referenceScale * 2, size: 0 },
                { value: referenceScale * 4, size: 0 },
                { value: referenceScale * 8, size: 0 },
            ],
        },
        maxSize: {
            type: 'size',
            valueExpression: '$view.scale',
            // adjust the max size by scale
            stops: [
                { value: referenceScale, size: 4 },
                { value: referenceScale * 2, size: 0 },
                { value: referenceScale * 4, size: 0 },
                { value: referenceScale * 8, size: 0 },
            ],
        },
    } as any
}

// 设置带有箭头的线
// export function makeArrowLineSize(legends: ILegendItem[]): __geoscene.SizeVariable {

// }

export function updateRender(
    type: string,
    render: SimpleRenderer,
    legends: ILegendItem[],
): SimpleRenderer {
    // console.log('updateRender :>> ', render, legends)
    const colorVariable: __geoscene.ColorVariable = {
        type: 'color',
        field: 'r0',
        stops: makeColorStopsWithValue(legends),
    } as any
    render.visualVariables = [colorVariable]
    console.log('updateRender>>>', render)
    return render
}

export function updateResultStep(map: ArcGISMap, type: string, index: number): void {
    // 查看图层的是否显示
    let layer = map.findLayerById(MODEL_RIVER) as GeoJSONLayer
    if (layer === undefined) return
    console.log('updateResultStep>>', layer.visible)
    let renderer = layer.renderer as __geoscene.UniqueValueRenderer
    // 没有流向
    // renderer.valueExpression = `return "null"`
    if (!renderer.visualVariables) return
    renderer.visualVariables = renderer.visualVariables.map((element) => {
        element.field = `r${index}`
        return element
    })
    console.log('layer :>> ', layer, renderer.valueExpression, renderer.visualVariables)
    layer.renderer = renderer
}

// #endregion result gis

/**
 * 控制图层显示
 */
export const controlLayerVisible = (map: ArcGISMap, layerSet: string[]): void => {
    // console.log('layerSet :>> ', layerSet)
    const toggle = (key: string): void => {
        const layer = map.findLayerById(key)
        if (layer !== undefined) {
            layer.visible = layerSet.includes(key)
        }
    }
    ;[
        BASE_RIVER,
        MODEL_RIVER,
        BASE_SECTION_EXAM,
        BASE_SEWAGE_PLANT,
        BASE_INDUSTRIAL_ENTERPRISE,
        BASE_RAIN_GAUGE,
        BASE_RESERVOIR,
        BASE_HYDROLOGICAL_STATION,
        BASE_DISTRICT,
        BASE_DRAINAGE_BASIN,
    ].forEach((key) => {
        toggle(key)
    })
}

export const defaultBaseMapUrl =
    'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer'

export const defaultLODs = [
    {
        level: 0,
        resolution: 156543.03392800014,
        scale: 5.91657527591555e8,
    },
    {
        level: 1,
        resolution: 78271.51696399994,
        scale: 2.95828763795777e8,
    },
    {
        level: 2,
        resolution: 39135.75848200009,
        scale: 1.47914381897889e8,
    },
    {
        level: 3,
        resolution: 19567.87924099992,
        scale: 7.3957190948944e7,
    },
    {
        level: 4,
        resolution: 9783.93962049996,
        scale: 3.6978595474472e7,
    },
    {
        level: 5,
        resolution: 4891.96981024998,
        scale: 1.8489297737236e7,
    },
    {
        level: 6,
        resolution: 2445.98490512499,
        scale: 9244648.868618,
    },
    {
        level: 7,
        resolution: 1222.992452562495,
        scale: 4622324.434309,
    },
    {
        level: 8,
        resolution: 611.4962262813797,
        scale: 2311162.217155,
    },
    {
        level: 9,
        resolution: 305.74811314055756,
        scale: 1155581.108577,
    },
    {
        level: 10,
        resolution: 152.87405657041106,
        scale: 577790.554289,
    },
    {
        level: 11,
        resolution: 76.43702828507324,
        scale: 288895.277144,
    },
    {
        level: 12,
        resolution: 38.21851414253662,
        scale: 144447.638572,
    },
    {
        level: 13,
        resolution: 19.10925707126831,
        scale: 72223.819286,
    },
    {
        level: 14,
        resolution: 9.554628535634155,
        scale: 36111.909643,
    },
    {
        level: 15,
        resolution: 4.77731426794937,
        scale: 18055.954822,
    },
    {
        level: 16,
        resolution: 2.388657133974685,
        scale: 9027.977411,
    },
    {
        level: 17,
        resolution: 1.1943285668550503,
        scale: 4513.988705,
    },
    {
        level: 18,
        resolution: 0.5971642835598172,
        scale: 2256.994353,
    },
    {
        level: 19,
        resolution: 0.29858214164761665,
        scale: 1128.497176,
    },
    {
        level: 20,
        resolution: 0.149291070823808,
        scale: 564.248588,
    },
    {
        level: 21,
        resolution: 0.074645535411904,
        scale: 282.124294,
    },
    {
        level: 21,
        resolution: 0.037322767705952,
        scale: 141.062147,
    },
] as any[]

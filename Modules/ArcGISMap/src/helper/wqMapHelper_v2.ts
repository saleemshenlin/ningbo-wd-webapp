import { IBasicGIS } from './../pages/WQMap/types'
import { IDataSet, ILegendItem } from './../store/types'
import SimpleRenderer from '@geoscene/core/renderers/SimpleRenderer'
import {
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
    // console.log('renderResultLayer>>>', gisProps)
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
    ;[BASE_RIVER, MODEL_RIVER].forEach((key) => {
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

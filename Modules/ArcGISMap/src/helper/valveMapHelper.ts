import {
    BASE_CLOSING_VALVE,
    BASE_DEVICE_EVALUATION,
    BASE_DEVICE_FACTORY,
    BASE_DEVICE_FLOW,
    BASE_HIGHLIGHT_PIPE,
    BASE_PIPE,
    BASE_JUNCTION,
    BASE_PUMP,
    BASE_TANK,
    BASE_VALVE,
    BASE_DEVICE,
    MODEL_JUNCTION,
    MODEL_PIPE,
    MODEL_PUMP,
    MODEL_TANK,
    MODEL_VALVE,
    MODEL_DEVICE,
    BASE_DMA,
    MODEL_DMA,
    BASE_DEVICE_PRESSURE,
} from '../store/const'

import {
    ArrowSymbol,
    ArrowSymbolLine,
    ArrowSymbolNegative,
    DefaultValveSymbol,
} from '../symbol/wdSymbol'

import GeoJSONLayer from '@geoscene/core/layers/GeoJSONLayer'
import FeatureLayer from '@geoscene/core/layers/FeatureLayer'

import { transferJSONToUrl } from './jsonToUrl'
import ArcGISMap from '@geoscene/core/Map'
import MapView from '@geoscene/core/views/MapView'
import { IWDBasicGIS } from '../store/types'
import { addZoomToLayerCallback } from './zoomToLayer'
import { isEmpty } from 'lodash'
// #region ref

// #endregion

// #region basic gis

// 管道图层的样式
export function makeBasePipeLayer(
    geojson: string,
    setPopupContent: (feature: { graphic: __geoscene.Graphic }) => HTMLDivElement | null,
): GeoJSONLayer {
    const renderer: __geoscene.UniqueValueRenderer = {
        defaultSymbol: { type: 'simple-line', color: '#7DD61B', width: 3 } as any,
        type: 'unique-value',
        // valueExpression:
        //     "When($feature.Diameter >= 800, 'red', $feature.Diameter >= 300 && $feature.Diameter < 800, 'yellow', $feature.Diameter >= 110  && $feature.Diameter < 300, 'green', 'blue')",
        // uniqueValueInfos: [
        //     {
        //         value: 'blue',
        //         symbol: { type: 'simple-line', color: '#1FC6FF', width: 3 } as any,
        //     } as any,
        //     {
        //         value: 'green',
        //         symbol: { type: 'simple-line', color: '#7DD61B', width: 3 } as any,
        //     } as any,
        //     {
        //         value: 'yellow',
        //         symbol: { type: 'simple-line', color: '#F5E74F', width: 3 } as any,
        //     } as any,
        //     {
        //         value: 'red',
        //         symbol: { type: 'simple-line', color: '#F5594F', width: 3 } as any,
        //     } as any,
        // ],
    } as any

    const url = transferJSONToUrl(geojson)
    const geojsonLayer = new GeoJSONLayer({
        id: BASE_PIPE,
        url,
        copyright: 'DHI China',
        outFields: ['*'],
        fields: [
            { name: 'MUID', type: 'string' },
            { name: 'AssetName', type: 'string' },
            { name: 'CDate', type: 'string' },
            { name: 'DataSource', type: 'string' },
            { name: 'Description', type: 'string' },
            { name: 'Diameter', type: 'double' },
            { name: 'FromNode', type: 'string' },
            { name: 'ToNode', type: 'string' },
            { name: 'Length', type: 'double' },
            { name: 'GeometricLength', type: 'double' },
            { name: 'Material', type: 'string' },
            { name: 'Thickness', type: 'double' },
            { name: 'PipeStatus', type: 'double' },
            { name: 'ZoneID', type: 'string' },
            { name: 'Note', type: 'string' },
            { name: 'StreetName', type: 'string' },
            { name: 'L', type: 'double' },
            { name: 'Highlight', type: 'double' },
            { name: 'longitude', type: 'double' },
            { name: 'latitude', type: 'double' },
        ],
        renderer,
        popupEnabled: false,
        // popupTemplate: {
        //     title: `管线相关信息`,
        //     content: setPopupContent,
        //     outFields: ['*'],
        // },
    })

    return geojsonLayer
}

// 节点图层
export function makeBaseJunctionLayer(
    geojson: string,
    setPopupContent: (feature: { graphic: __geoscene.Graphic }) => HTMLDivElement | null,
): GeoJSONLayer {
    const renderer: __geoscene.renderers.SimpleRenderer = {
        type: 'simple',
        symbol: {
            type: 'simple-marker',
            color: '#fff', // #f8cf09
            size: 3,
            outline: {
                width: 0.5,
                color: '#165DFF',
            },
        },
    } as any

    const geojsonLayer = new GeoJSONLayer({
        id: BASE_JUNCTION,
        url: transferJSONToUrl(geojson),
        copyright: 'DHI China',
        outFields: ['*'],
        fields: [
            { name: 'MUID', type: 'string' },
            { name: 'Elev', type: 'double' },
            { name: 'ZoneID', type: 'string' },
            { name: 'Description', type: 'string' },
            { name: 'Note', type: 'string' },
            { name: 'Diameter', type: 'double' },
            { name: 'AssetName', type: 'string' },
        ],
        renderer,
        popupEnabled: false,
    })
    return geojsonLayer
}

// 高亮管道图层 featureLayer
export function makeBaseHighPipeLayer(
    graphics: any,
    setPopupContent: (feature: { graphic: __geoscene.Graphic }) => HTMLDivElement | null,
): FeatureLayer {
    console.log('graphics  high light', graphics)

    const featureLayer = new FeatureLayer({
        title: BASE_HIGHLIGHT_PIPE,
        id: BASE_HIGHLIGHT_PIPE,
        source: JSON.parse(JSON.stringify(graphics)),
        objectIdField: 'MUID',
        fields: [
            { name: 'MUID', type: 'string' },
            { name: 'Diameter', type: 'double' },
        ],
        spatialReference: { wkid: 4326 },
        renderer: {
            type: 'simple',
            symbol: {
                type: 'simple-line',
                color: '#B319FF',
                width: 4,
            } as any,
        },
        geometryType: 'polyline',
        popupEnabled: false,
    } as any)

    return featureLayer
}

// 关阀 FeatureLayer
export function makeClosingValveFeatureLayer(
    graphics: any,
    setPopupContent: (feature: { graphic: __geoscene.Graphic }) => HTMLDivElement | null,
): FeatureLayer {
    console.log('graphics closing valve', graphics)
    const featureLayer = new FeatureLayer({
        title: BASE_CLOSING_VALVE,
        id: BASE_CLOSING_VALVE,
        source: JSON.parse(JSON.stringify(graphics)),
        objectIdField: 'gisId',
        fields: [
            { name: 'gisId', type: 'string' },
            { name: 'diameter', type: 'double' },
        ],
        spatialReference: { wkid: 4326 },
        renderer: {
            type: 'simple',
            symbol: DefaultValveSymbol,
        },
        popupEnabled: false,
    } as any)

    return featureLayer
}

// 关阀 GeoJSONLayer
export function makeClosingValveLayer(
    geojson: string,
    setPopupContent: (feature: { graphic: __geoscene.Graphic }) => HTMLDivElement | null,
): GeoJSONLayer {
    const renderer: __geoscene.renderers.SimpleRenderer = {
        type: 'simple',
        symbol: DefaultValveSymbol,
    } as any

    const geojsonLayer = new GeoJSONLayer({
        id: BASE_CLOSING_VALVE,
        url: transferJSONToUrl(geojson),
        copyright: 'DHI China',
        outFields: ['*'],
        fields: [
            { name: 'MUID', type: 'string' },
            { name: 'ValveType', type: 'double' },
            { name: 'ValveStatus', type: 'double' },
            { name: 'FromNode', type: 'string' },
            { name: 'ToNode', type: 'string' },
            { name: 'DataSource', type: 'string' },
            { name: 'Note', type: 'string' },
            { name: 'Diameter', type: 'double' },
            { name: 'Description', type: 'string' },
            { name: 'StreetName', type: 'string' },
            { name: 'SettingNo', type: 'double' },
            { name: 'Setting', type: 'double' },
        ],
        renderer,
        popupTemplate: {
            title: `关阀相关信息`,
            content: setPopupContent,
            outFields: ['*'],
        },
    })
    return geojsonLayer
}

export async function renderWDBaseLayer(
    map: ArcGISMap,
    view: MapView,
    props: IWDBasicGIS,
    cb: (feature: { graphic: __geoscene.Graphic }, layerId: string) => HTMLDivElement | null,
    onRendered?: (
        layer: __geoscene.GeoJSONLayer,
        layerView: __geoscene.GeoJSONLayerView,
        view: __geoscene.MapView,
    ) => void,
    highlightOptions?: {
        color: string | number[] // 填充颜色
        haloColor: string | number[] // 边框颜色
    },
): Promise<void> {
    // 查看当前图层
    console.log('map.layers', map.layers)

    // 管道图层
    if (props.pipe !== undefined && map.findLayerById(BASE_PIPE) === undefined) {
        const pipeLayer = makeBasePipeLayer(props.pipe, (feature) => {
            return cb(feature, BASE_PIPE)
        })

        addZoomToLayerCallback(pipeLayer, view)
        if (onRendered !== undefined) {
            view.whenLayerView(pipeLayer).then((layerView) => {
                onRendered(pipeLayer, layerView, view)
            })
        }
        map.add(pipeLayer)
    }

    // 节点图层
    if (props.junction !== undefined && map.findLayerById(BASE_JUNCTION) === undefined) {
        const junctionLayer = makeBaseJunctionLayer(props.junction, (feature) => {
            return cb(feature, BASE_JUNCTION)
        })
        map.add(junctionLayer)
    }

    // 高亮管道图层
    if (props.highlightPipe !== undefined) {
        const highPipeLayerRes = map.findLayerById(BASE_HIGHLIGHT_PIPE) as FeatureLayer
        if (highPipeLayerRes === undefined && props.highlightPipe !== '') {
            const highPipeLayer = makeBaseHighPipeLayer(props.highlightPipe, (feature) =>
                cb(feature, BASE_HIGHLIGHT_PIPE),
            )
            map.add(highPipeLayer)
        } else {
            const newSource = JSON.parse(JSON.stringify(props.highlightPipe)) // 新数据源
            highPipeLayerRes.queryFeatures().then((res) => {
                const oldSource = res.features // 老数据源
                console.log('oldSource', oldSource)
                if (newSource.length > oldSource.length) {
                    // 找到newSource中新增尾巴
                    const graphic = newSource.at(-1)
                    const addEdits = {
                        addFeatures: [graphic],
                    }
                    highPipeLayerRes.applyEdits(addEdits)
                } else {
                    if (newSource.length === 0) {
                        const deleteEdits = {
                            deleteFeatures: oldSource,
                        }
                        highPipeLayerRes.applyEdits(deleteEdits)
                    } else if (oldSource.length > newSource.length) {
                        const differenceGraphic = oldSource.find((oldItem: any) => {
                            return !newSource.some((newItem: any) => {
                                return (
                                    JSON.stringify(newItem.geometry.paths.flat(Infinity)) ===
                                    JSON.stringify(oldItem.geometry.paths.flat(Infinity))
                                )
                            })
                        })
                        console.log('differenceGraphic', differenceGraphic)
                        if (differenceGraphic !== undefined) {
                            const deleteEdits = {
                                deleteFeatures: [differenceGraphic],
                            }
                            highPipeLayerRes.applyEdits(deleteEdits)
                        }
                    }
                }
                return res.features
            })
        }
    }
    // 关阀图层
    if (props.closingValve !== undefined) {
        // 检查FeatureLayer是否存在
        const closingLayerRes = map.findLayerById(BASE_CLOSING_VALVE) as FeatureLayer
        console.log('closingLayerRes>>', closingLayerRes, props.closingValve)
        if (closingLayerRes !== undefined && props.closingValve !== '') {
            closingLayerRes.queryFeatures().then((results) => {
                console.log('closingLayerRes results>>', results)
                // 如果有数据，清除数据
                if (!isEmpty(results)) {
                    closingLayerRes.source.removeAll()
                    closingLayerRes.source.addMany(JSON.parse(JSON.stringify(props.closingValve)))
                }
            })
        } else if (closingLayerRes !== undefined && props.closingValve === '') {
            map.remove(closingLayerRes)
        } else {
            if (props.closingValve !== '') {
                const closingValveLayer = makeClosingValveFeatureLayer(
                    props.closingValve,
                    (feature) => cb(feature, BASE_CLOSING_VALVE),
                )
                map.add(closingValveLayer)
            }
        }
    }
}

export function toggleBaseLayerVisible(map: ArcGISMap, visible = false): void {
    const pipeLayer = map.findLayerById(BASE_PIPE)
    const junctionLayer = map.findLayerById(BASE_JUNCTION)
    const pumpLayer = map.findLayerById(BASE_PUMP)
    const tankLayer = map.findLayerById(BASE_TANK)
    const valveLayer = map.findLayerById(BASE_VALVE)
    const deviceLayer = map.findLayerById(BASE_DEVICE)
    const dmaLayer = map.findLayerById(BASE_DMA)
    const deviceEvaluationLayer = map.findLayerById(BASE_DEVICE_EVALUATION)
    const deviceFactoryLayer = map.findLayerById(BASE_DEVICE_FACTORY)
    const devicePressureLayer = map.findLayerById(BASE_DEVICE_PRESSURE)
    const deviceFlowLayer = map.findLayerById(BASE_DEVICE_FLOW)
    if (pipeLayer !== undefined) {
        pipeLayer.visible = visible
    }

    if (junctionLayer !== undefined) {
        junctionLayer.visible = visible
    }

    if (pumpLayer !== undefined) {
        pumpLayer.visible = visible
    }

    if (tankLayer !== undefined) {
        tankLayer.visible = visible
    }

    if (valveLayer !== undefined) {
        valveLayer.visible = visible
    }

    if (deviceLayer !== undefined) {
        deviceLayer.visible = visible
    }
    if (dmaLayer !== undefined) {
        dmaLayer.visible = visible
    }
    if (deviceEvaluationLayer !== undefined) {
        deviceEvaluationLayer.visible = visible
    }
    if (deviceFactoryLayer !== undefined) {
        deviceFactoryLayer.visible = visible
    }
    if (devicePressureLayer !== undefined) {
        devicePressureLayer.visible = visible
    }
    if (deviceFlowLayer !== undefined) {
        deviceFlowLayer.visible = visible
    }
}

export function toggleResultLayerVisible(map: ArcGISMap, visible = false): void {
    const pipeLayer = map.findLayerById(MODEL_PIPE)
    const junctionLayer = map.findLayerById(MODEL_JUNCTION)
    const pumpLayer = map.findLayerById(MODEL_PUMP)
    const tankLayer = map.findLayerById(MODEL_TANK)
    const valveLayer = map.findLayerById(MODEL_VALVE)
    const deviceLayer = map.findLayerById(MODEL_DEVICE)
    const dmaLayer = map.findLayerById(MODEL_DMA)
    if (pipeLayer !== undefined) {
        pipeLayer.visible = visible
    }

    if (junctionLayer !== undefined) {
        junctionLayer.visible = visible
    }

    if (pumpLayer !== undefined) {
        pumpLayer.visible = visible
    }

    if (tankLayer !== undefined) {
        tankLayer.visible = visible
    }

    if (valveLayer !== undefined) {
        valveLayer.visible = visible
    }

    if (deviceLayer !== undefined) {
        deviceLayer.visible = visible
    }
    if (dmaLayer !== undefined) {
        dmaLayer.visible = visible
    }
}

// #endregion basic gis

// #region result gis
export function makeResultPipeLayer(geojson: string, dateTimes: string[]): GeoJSONLayer {
    const renderer: __geoscene.SimpleRenderer = {
        type: 'unique-value',
        symbol: {
            type: 'simple-line',
            width: 2,
            style: 'solid',
        },
        valueExpression: "When($feature.f0 > 0, 'true', $feature.f0 == 0, '0', 'false')",
        uniqueValueInfos: [
            {
                value: 'true',
                symbol: ArrowSymbol,
            },
            {
                value: '0',
                symbol: ArrowSymbolLine,
            },
            {
                value: 'false',
                symbol: ArrowSymbolNegative,
            },
            {
                value: 'null',
                symbol: {
                    type: 'simple-line',
                    width: 2,
                    style: 'solid',
                },
            },
        ],
    } as any

    const url = transferJSONToUrl(geojson)
    const geojsonLayer = new GeoJSONLayer({
        id: MODEL_PIPE,
        url,
        copyright: 'DHI China',
        outFields: ['*'],
        renderer,
        fields: [
            { name: 'MUID', type: 'string' },
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

export function makeResultJunctionLayer(geojson: string, dateTimes: string[]): GeoJSONLayer {
    const renderer: __geoscene.SimpleRenderer = {
        type: 'simple', //
        symbol: {
            type: 'simple-marker',
            size: 6,
            outline: {
                width: 0,
            },
        },
    } as any

    const url = transferJSONToUrl(geojson)
    const geojsonLayer = new GeoJSONLayer({
        id: MODEL_JUNCTION,
        url,
        copyright: 'DHI China',
        outFields: ['*'],
        renderer,
        fields: [
            { name: 'MUID', type: 'string' },
            ...dateTimes.map<any[]>(
                // 根据map过滤数据源。结果集:为
                (date, index) =>
                    ({
                        name: `r${index}`,
                        type: 'double',
                    } as any),
            ),
            { name: 'index', type: 'long' },
        ],
        visible: false,
        editingEnabled: true,
    })
    return geojsonLayer
}

export async function renderWDResultLayer(
    map: ArcGISMap,
    gisProps: IWDBasicGIS,
    dateTimes: string[],
): Promise<void> {
    const pipeLayer = map.findLayerById(MODEL_PIPE)
    const junctionLayer = map.findLayerById(MODEL_JUNCTION)
    const layers = []
    if (pipeLayer !== undefined) {
        layers.push(pipeLayer)
    }

    if (junctionLayer !== undefined) {
        layers.push(junctionLayer)
    }

    if (layers.length > 0) {
        map.removeMany([pipeLayer, junctionLayer])
    }

    if (gisProps.pipe !== undefined) {
        const pipeLayer = makeResultPipeLayer(gisProps.pipe, dateTimes)
        map.add(pipeLayer)
    }
    if (gisProps.junction !== undefined) {
        const junctionLayer = makeResultJunctionLayer(gisProps.junction, dateTimes)
        map.add(junctionLayer)
    }
}

// #endregion result gis

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

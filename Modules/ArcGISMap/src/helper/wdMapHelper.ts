import {
    BASE_CLOSING_VALVE,
    BASE_DEVICE_EVALUATION,
    BASE_DEVICE_FACTORY,
    BASE_DEVICE_FLOW,
    BASE_HIGHLIGHT_PIPE,
} from './../store/const'
import { IDataSet, ILegendItem } from './../store/types'
import SimpleRenderer from '@geoscene/core/renderers/SimpleRenderer'
import {
    ArrowSymbol,
    ArrowSymbolLine,
    ArrowSymbolNegative,
    DefaultChlorineSymbol,
    DefaultDeviceSymbol,
    DefaultFlowSymbol,
    DefaultPressureSymbol,
    DefaultPumpSymbol,
    DefaultTankSymbol,
    DefaultValveSymbol,
    DefaultValveClosingSymbol,
    DefaultDevicePressureSymbol,
    DefaultDeviceFlowSymbol,
    DefaultDeviceEvaluationSymbol,
    DefaultDeviceFactorySymbol,
} from '../symbol/wdSymbol'
import Color from '@geoscene/core/Color'
import GeoJSONLayer from '@geoscene/core/layers/GeoJSONLayer'
import {
    BASE_PIPE,
    BASE_JUNCTION,
    BASE_PRESSURE,
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
import { transferJSONToUrl } from './jsonToUrl'
import ArcGISMap from '@geoscene/core/Map'
import MapView from '@geoscene/core/views/MapView'
import { IWDBasicGIS } from '../store/types'
import { addZoomToLayerCallback } from './zoomToLayer'
import { rgbToColor } from './rgbToColor'
import PictureMarkerSymbol from '@geoscene/core/symbols/PictureMarkerSymbol'
import FeatureLayer from '@geoscene/core/layers/FeatureLayer'
import { TJDMA, defaultSym } from './dmaHelper'
import { valueExpression, uniqueValueInfos } from './config'
// #region basic gis

export function makeBasePressureLayer(geojson: string): GeoJSONLayer {
    // * 3个元素及数据混搭到一起,并加入到一层的写法
    const renderer: SimpleRenderer = {
        type: 'unique-value',
        field: 'type',
        symbol: {
            type: 'simple',
            width: 4,
            style: 'solid',
        },
        uniqueValueInfos: [
            {
                value: 'Pressure',
                symbol: DefaultPressureSymbol,
            },
            {
                value: 'Flow',
                symbol: DefaultFlowSymbol,
            },
            {
                value: 'Chlorine',
                symbol: DefaultChlorineSymbol,
            },
        ],
    } as any

    const labelClass: __geoscene.LabelClass = {
        symbol: {
            type: 'text', // autocasts as new TextSymbol()
            color: new Color('black'),
            haloColor: new Color('#fff'),
            haloSize: 2,
            xoffset: 10,
            yoffset: -5,
            font: {
                family: 'Noto Sans Regular',
                size: 10,
            },
        },
        labelPlacement: 'above-left',
        labelExpressionInfo: {
            expression: '$feature.MUID', // 需要显示对应的字段
        },
    } as any

    const pressureLayer = new GeoJSONLayer({
        id: BASE_PRESSURE,
        copyright: 'DHI China',
        url: transferJSONToUrl(geojson),
        renderer,
        fields: [
            { name: 'MUID', type: 'string' },
            { name: 'type', type: 'string' },
            { name: 'location', type: 'string' },
            { name: 'deviceHeight', type: 'double' },
            { name: 'groundHeight', type: 'double' },
            { name: 'company', type: 'string' },
        ],
        visible: true,
        labelingInfo: [labelClass],
    })

    return pressureLayer
}

// 管道图层的样式
export function makeBasePipeLayer(
    geojson: string,
    setPopupContent: (feature: { graphic: __geoscene.Graphic }) => HTMLDivElement | null,
): GeoJSONLayer {
    const renderer: __geoscene.UniqueValueRenderer = {
        defaultSymbol: { type: 'simple-line', color: '#165DFF', width: 3 } as any,
        type: 'unique-value',
        valueExpression,
        uniqueValueInfos,
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
        popupTemplate: {
            title: `管线相关信息`,
            content: setPopupContent,
            outFields: ['*'],
        },
    })

    return geojsonLayer
}

export function makeBaseJunctionLayer(
    geojson: string,
    setPopupContent: (feature: { graphic: __geoscene.Graphic }) => HTMLDivElement | null,
): GeoJSONLayer {
    const renderer: __geoscene.renderers.SimpleRenderer = {
        type: 'simple',
        symbol: {
            type: 'simple-marker',
            color: '#fff', // #f8cf09
            size: 5,
            outline: {
                width: 1,
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
        popupTemplate: {
            title: `节点相关信息`,
            content: setPopupContent,
            outFields: ['*'],
        },
    })
    return geojsonLayer
}

export function makeBasePumpLayer(
    geojson: string,
    setPopupContent: (feature: { graphic: __geoscene.Graphic }) => HTMLDivElement | null,
): GeoJSONLayer {
    const renderer: __geoscene.renderers.SimpleRenderer = {
        type: 'simple',
        symbol: DefaultPumpSymbol,
    } as any

    const geojsonLayer = new GeoJSONLayer({
        id: BASE_PUMP,
        url: transferJSONToUrl(geojson),
        copyright: 'DHI China',
        outFields: ['*'],
        fields: [
            { name: 'MUID', type: 'string' },
            { name: 'PumpType', type: 'double' },
            { name: 'PumpState', type: 'double' },
            { name: 'Speed', type: 'double' },
            { name: 'CDate', type: 'string' },
            { name: 'FromNode', type: 'string' },
            { name: 'ToNode', type: 'string' },
        ],
        renderer,
        popupTemplate: {
            title: `水泵相关信息`,
            content: setPopupContent,
            outFields: ['*'],
        },
    })

    return geojsonLayer
}

export function makeBaseTankLayer(
    geojson: string,
    symbol: PictureMarkerSymbol = DefaultTankSymbol,
    setPopupContent: (feature: { graphic: __geoscene.Graphic }) => HTMLDivElement | null,
): GeoJSONLayer {
    console.log('makeBaseTankLayer', symbol)
    const renderer: __geoscene.renderers.SimpleRenderer = {
        type: 'simple',
        symbol,
    } as any

    const geojsonLayer = new GeoJSONLayer({
        id: BASE_TANK,
        url: transferJSONToUrl(geojson),
        copyright: 'DHI China',
        outFields: ['*'],
        fields: [
            { name: 'MUID', type: 'string' },
            { name: 'Elev', type: 'double' },
            { name: 'AssetName', type: 'string' },
        ],
        renderer,
        popupTemplate: {
            title: `水池相关信息`,
            content: setPopupContent,
            outFields: ['*'],
        },
    })

    return geojsonLayer
}

export function makeBaseValveLayer(
    geojson: string,
    symbol: PictureMarkerSymbol = DefaultValveSymbol,
    setPopupContent: (feature: { graphic: __geoscene.Graphic }) => HTMLDivElement | null,
): GeoJSONLayer {
    const renderer: __geoscene.renderers.SimpleRenderer = {
        type: 'simple',
        symbol,
    } as any

    const geojsonLayer = new GeoJSONLayer({
        id: BASE_VALVE,
        url: transferJSONToUrl(geojson),
        // featureReduction: clusterConfig,
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
            title: `阀门相关信息`,
            content: setPopupContent,
            outFields: ['*'],
        },
    })
    return geojsonLayer
}

export function makeBaseDeviceLayer(
    geojson: string,
    setPopupContent: (feature: { graphic: __geoscene.Graphic }) => HTMLDivElement | null,
): GeoJSONLayer {
    const renderer: __geoscene.renderers.SimpleRenderer = {
        type: 'simple',
        symbol: DefaultDeviceSymbol,
    } as any

    const geojsonLayer = new GeoJSONLayer({
        id: BASE_DEVICE,
        url: transferJSONToUrl(geojson),
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
            title: `设备名称: {name}`,
            content: setPopupContent,
            outFields: ['*'],
            overwriteActions: true, // remove zoom to button
        },
    })

    return geojsonLayer
}

export function makeBaseDeviceCommonLayer(
    type: string,
    geojson: string,
    symbol: PictureMarkerSymbol = setSymbol(type),
    setPopupContent: (feature: { graphic: __geoscene.Graphic }) => HTMLDivElement | null,
): GeoJSONLayer {
    const renderer: __geoscene.renderers.SimpleRenderer = {
        type: 'simple',
        symbol, // DefaultDeviceSymbol
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

//! 加载多边形
export function makeBaseDMALayer(
    geojson: string,
    setPopupContent: (feature: { graphic: __geoscene.Graphic }) => HTMLDivElement | null,
): GeoJSONLayer {
    const uniqueValueInfos = TJDMA.map((dma) => {
        return {
            value: dma,
            symbol: defaultSym,
        }
    })
    const renderer: __geoscene.UniqueValueRenderer = {
        defaultSymbol: defaultSym as any,
        type: 'unique-value', // autocasts as new UniqueValueRenderer()
        field: 'MUID',
        uniqueValueInfos,
    } as any
    const geojsonLayer = new GeoJSONLayer({
        id: BASE_DMA,
        url: transferJSONToUrl(geojson),
        copyright: 'DHI China',
        outFields: ['*'],
        fields: [
            { name: 'MUID', type: 'string' },
            { name: 'Note', type: 'string' },
        ],
        renderer,
        popupTemplate: {
            title: `DMA相关信息`,
            content: setPopupContent,
            outFields: ['*'],
        },
    })
    return geojsonLayer
}

// 高亮管道图层 featureLayer
export function makeBaseHighPipeLayer(
    graphics: any,
    setPopupContent: (feature: { graphic: __geoscene.Graphic }) => HTMLDivElement | null,
): FeatureLayer {
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
            symbol: DefaultValveClosingSymbol,
        },
        popupEnabled: false,
    } as any)

    return featureLayer
}

export async function renderWDBaseLayer(
    map: ArcGISMap,
    view: MapView,
    props: IWDBasicGIS,
    cb: (feature: { graphic: __geoscene.Graphic }, layerId: string) => HTMLDivElement | null,
    layerSet: string[],
    onRendered?: (
        layer: __geoscene.GeoJSONLayer,
        layerView: __geoscene.GeoJSONLayerView,
        view: __geoscene.MapView,
    ) => void,
    highlightOptions?: {
        color: string | number[] // 填充颜色
        haloColor: string | number[] // 边框颜色
    },
    symbolMap?: Record<string, any>, // 图标
): Promise<void> {
    // 查看当前图层
    // console.log('map.layers', map.layers)
    // 加入DMA图层
    if (props.dma !== undefined && map.findLayerById(BASE_DMA) === undefined) {
        const dmaLayer = makeBaseDMALayer(props.dma, (feature) => {
            return cb(feature, BASE_DMA)
        })
        if (onRendered !== undefined) {
            view.whenLayerView(dmaLayer).then((layerView) => {
                if (highlightOptions !== undefined) {
                    console.log('highlightOptions', highlightOptions)
                    const { color, haloColor } = highlightOptions
                    layerView.highlightOptions = {
                        color: new Color(color),
                        haloColor: new Color(haloColor),
                    }
                }
                onRendered(dmaLayer, layerView, view)
            })
        }
        map.add(dmaLayer)
    }

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
    if (props.junction !== undefined && map.findLayerById(BASE_JUNCTION) === undefined) {
        const junctionLayer = makeBaseJunctionLayer(props.junction, (feature) => {
            return cb(feature, BASE_JUNCTION)
        })
        if (onRendered !== undefined) {
            view.whenLayerView(junctionLayer).then((layerView) => {
                onRendered(junctionLayer, layerView, view)
            })
        }
        map.add(junctionLayer)
    }
    // 加入水泵图层
    if (props.pump !== undefined && map.findLayerById(BASE_PUMP) === undefined) {
        const pumpLayer = makeBasePumpLayer(props.pump, (feature) => {
            return cb(feature, BASE_PUMP)
        })
        map.add(pumpLayer)
    }
    // 加入水池图层
    if (props.tank !== undefined && map.findLayerById(BASE_TANK) === undefined) {
        const tankLayer = makeBaseTankLayer(
            props.tank,
            // 如果返回来为空,则使用默认的图标
            convertPictureMarkerSymbol(symbolMap?.BASE_TANK) === ''
                ? DefaultTankSymbol
                : convertPictureMarkerSymbol(symbolMap?.BASE_TANK),
            (feature) => {
                return cb(feature, BASE_TANK)
            },
        )
        map.add(tankLayer)
    }
    // 加入阀门图层
    if (props.valve !== undefined && map.findLayerById(BASE_VALVE) === undefined) {
        const valveLayer = makeBaseValveLayer(
            props.valve,
            convertPictureMarkerSymbol(symbolMap?.BASE_VALVE) === ''
                ? DefaultValveSymbol
                : convertPictureMarkerSymbol(symbolMap?.BASE_VALVE),
            (feature) => {
                return cb(feature, BASE_VALVE)
            },
        )
        if (onRendered !== undefined) {
            view.whenLayerView(valveLayer).then((layerView) => {
                onRendered(valveLayer, layerView, view)
            })
        }
        map.add(valveLayer)
    }
    // 加入设备图层
    if (props.device !== undefined && map.findLayerById(BASE_DEVICE) === undefined) {
        const deviceLayer = makeBaseDeviceLayer(props.device, (feature) => {
            return cb(feature, BASE_DEVICE)
        })
        map.add(deviceLayer)
    }
    // TODO 待处理抽象 加入设备-考核表图层
    if (
        props.device_evaluation !== undefined &&
        map.findLayerById(BASE_DEVICE_EVALUATION) === undefined
    ) {
        const Layer = makeBaseDeviceCommonLayer(
            '考核表',
            props.device_evaluation,
            convertPictureMarkerSymbol(symbolMap?.BASE_DEVICE_EVALUATION) === ''
                ? DefaultDeviceEvaluationSymbol
                : convertPictureMarkerSymbol(symbolMap?.BASE_DEVICE_EVALUATION),
            (feature) => {
                return cb(feature, BASE_DEVICE_EVALUATION)
            },
        )
        if (onRendered !== undefined) {
            view.whenLayerView(Layer).then((layerView) => {
                onRendered(Layer, layerView, view)
            })
        }
        map.add(Layer)
    }
    // TODO 待处理抽象 加入设备-厂站图层
    if (
        props.device_factory !== undefined &&
        map.findLayerById(BASE_DEVICE_FACTORY) === undefined
    ) {
        const Layer = makeBaseDeviceCommonLayer(
            '厂站',
            props.device_factory,
            convertPictureMarkerSymbol(symbolMap?.BASE_DEVICE_FACTORY) === ''
                ? DefaultDeviceFactorySymbol
                : convertPictureMarkerSymbol(symbolMap?.BASE_DEVICE_FACTORY),
            (feature) => {
                return cb(feature, BASE_DEVICE_FACTORY)
            },
        )
        if (onRendered !== undefined) {
            view.whenLayerView(Layer).then((layerView) => {
                onRendered(Layer, layerView, view)
            })
        }
        map.add(Layer)
    }
    // TODO 待处理抽象 加入设备-压力计图层
    if (
        props.device_pressure !== undefined &&
        map.findLayerById(BASE_DEVICE_PRESSURE) === undefined
    ) {
        const Layer = makeBaseDeviceCommonLayer(
            '压力计',
            props.device_pressure,
            convertPictureMarkerSymbol(symbolMap?.BASE_DEVICE_PRESSURE) === ''
                ? DefaultDevicePressureSymbol
                : convertPictureMarkerSymbol(symbolMap?.BASE_DEVICE_PRESSURE),
            (feature) => {
                return cb(feature, BASE_DEVICE_PRESSURE)
            },
        )
        if (onRendered !== undefined) {
            view.whenLayerView(Layer).then((layerView) => {
                onRendered(Layer, layerView, view)
            })
        }
        map.add(Layer)
    }
    // TODO 待处理抽象 加入设备-流量计图层
    if (props.device_flow !== undefined && map.findLayerById(BASE_DEVICE_FLOW) === undefined) {
        const Layer = makeBaseDeviceCommonLayer(
            '流量计',
            props.device_flow,
            convertPictureMarkerSymbol(symbolMap?.BASE_DEVICE_FLOW) === ''
                ? DefaultDeviceFlowSymbol
                : convertPictureMarkerSymbol(symbolMap?.BASE_DEVICE_FLOW),
            (feature) => {
                return cb(feature, BASE_DEVICE_FLOW)
            },
        )
        if (onRendered !== undefined) {
            view.whenLayerView(Layer).then((layerView) => {
                onRendered(Layer, layerView, view)
            })
        }
        map.add(Layer)
    }

    // 高亮管道图层
    if (props.highlightPipe !== undefined) {
        const recordHighlightPipe = props.highlightPipe
        console.log(
            'props.highlightPipe',
            props.highlightPipe,
            map.findLayerById(BASE_HIGHLIGHT_PIPE),
            recordHighlightPipe,
        )
        // 如果高亮管道图层没有建立,并且props.highlightPipe !=='',则建立高亮管道图层
        if (map.findLayerById(BASE_HIGHLIGHT_PIPE) === undefined && props.highlightPipe !== '') {
            const highPipeLayer = makeBaseHighPipeLayer(props.highlightPipe, (feature) =>
                cb(feature, BASE_HIGHLIGHT_PIPE),
            )
            map.add(highPipeLayer)
        }
        if (map.findLayerById(BASE_HIGHLIGHT_PIPE) !== undefined && props.highlightPipe === '') {
            map.remove(map.findLayerById(BASE_HIGHLIGHT_PIPE))
        }
        // recordHighlightPipe 与 props.highlightPipe 不相等,则更新图层
        if (
            map.findLayerById(BASE_HIGHLIGHT_PIPE) !== undefined &&
            props.highlightPipe !== '' &&
            recordHighlightPipe !== props.highlightPipe
        ) {
            // 更新图层,先删除,在生成图层
            map.remove(map.findLayerById(BASE_HIGHLIGHT_PIPE))
            const highPipeLayer = makeBaseHighPipeLayer(props.highlightPipe, (feature) =>
                cb(feature, BASE_HIGHLIGHT_PIPE),
            )
            map.add(highPipeLayer)
        }
    }

    // 关阀图层
    if (props.closingValve !== undefined) {
        const recordClosingValve = props.closingValve
        console.log(
            'props.closingValve',
            props.closingValve,
            map.findLayerById(BASE_CLOSING_VALVE),
            recordClosingValve,
        )
        if (map.findLayerById(BASE_CLOSING_VALVE) === undefined && props.closingValve !== '') {
            const closeValveLayer = makeClosingValveFeatureLayer(props.closingValve, (feature) =>
                cb(feature, BASE_CLOSING_VALVE),
            )
            map.add(closeValveLayer)
        }
        if (map.findLayerById(BASE_CLOSING_VALVE) !== undefined && props.closingValve === '') {
            map.remove(map.findLayerById(BASE_CLOSING_VALVE))
        }

        if (
            map.findLayerById(BASE_CLOSING_VALVE) !== undefined &&
            props.closingValve !== '' &&
            recordClosingValve !== props.closingValve
        ) {
            // 更新图层,先删除,在生成图层
            map.remove(map.findLayerById(BASE_CLOSING_VALVE))
            const closeValveLayer = makeClosingValveFeatureLayer(props.closingValve, (feature) =>
                cb(feature, BASE_CLOSING_VALVE),
            )
            map.add(closeValveLayer)
        }
    }
    // controlLayerVisible(map, layerSet)
}

export function toggleBaseValveLayerVisible(map: ArcGISMap, visible = false): void {
    const highPipeLayer = map.findLayerById(BASE_HIGHLIGHT_PIPE)
    const closingValveLayer = map.findLayerById(BASE_CLOSING_VALVE)
    if (highPipeLayer !== undefined) {
        highPipeLayer.visible = visible
    }
    if (closingValveLayer !== undefined) {
        closingValveLayer.visible = visible
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
            width: 3.5,
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
                    width: 3.5,
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

// #region  渲染结果
export async function updateResultSet(
    map: ArcGISMap,
    dataSet: IDataSet,
    resultItem: string,
    legends: ILegendItem[],
    formatValue: (val: number) => number,
    layerControl?: string[],
): Promise<void> {
    console.time('queryFeatures :>> ')
    toggleBaseLayerVisible(map, false)
    console.log('渲染结果>>>>', layerControl)
    if (!layerControl!.includes('BASE_HIGHLIGHT_PIPE')) {
        toggleBaseValveLayerVisible(map, false)
    }
    let layer: GeoJSONLayer
    if (resultItem === 'Pressure') {
        layer = map.findLayerById(MODEL_JUNCTION) as GeoJSONLayer
        // 处理BASE_PIPE颜色都变成为蓝色
        changeBasePipeRenderer(map, BASE_PIPE, true)
        // map.findLayerById(BASE_PIPE).visible = true
    } else if (resultItem === 'Velocity') {
        layer = map.findLayerById(MODEL_PIPE) as GeoJSONLayer
        ;(layer.renderer as __geoscene.UniqueValueRenderer).valueExpression = `return "null"`
    } else if (resultItem === 'Flow') {
        layer = map.findLayerById(MODEL_PIPE) as GeoJSONLayer
        ;(
            layer.renderer as __geoscene.UniqueValueRenderer
        ).valueExpression = `When($feature.f${0} > 0, 'true', $feature.f${0} == 0, '0', 'false')`
    } else if (resultItem === 'HydroChronology') {
        layer = map.findLayerById(MODEL_PIPE) as GeoJSONLayer
        ;(layer.renderer as __geoscene.UniqueValueRenderer).valueExpression = `return "null"`
    } else if (resultItem === 'WaterSupplyBoundary') {
        layer = map.findLayerById(MODEL_PIPE) as GeoJSONLayer
        ;(layer.renderer as __geoscene.UniqueValueRenderer).valueExpression = `return "null"`
        // map.findLayerById(BASE_PIPE).visible = true
    } else {
        console.log('resultItem :>> not found', resultItem)
        return
    }
    const oldFeatures = await layer.queryFeatures()
    // console.log('oldFeatures :>> ', oldFeatures)
    console.timeEnd('queryFeatures :>> ')
    // debug 生产feature地图
    // console.time('make feature map :>> ')
    // const featureMap = oldFeatures.features.reduce((map, graphic) => {
    //     return map.set(graphic.attributes.MUID, graphic)
    // }, new Map())
    // console.timeEnd('make feature map :>> ')
    const features = dataSet.iDs.reduce<__geoscene.Graphic[]>((featureList, id, index) => {
        // console.time('reduce find :>> ')
        // const feature = oldFeatures.features.find((graphic) => {
        //     return graphic.attributes.MUID === id
        // })
        // console.timeEnd('reduce find :>> ')
        // console.time('reduce get Map :>> ')
        const feature = oldFeatures.features[index]
        // console.timeEnd('reduce get Map :>> ')
        if (feature !== undefined) {
            // debugger 对比要素
            // if (feature2.attributes.MUID !== feature.attributes.MUID) {
            //     console.log(
            //         'feature2 !== feature:>> ',
            //         feature2.attributes.MUID,
            //         feature.attributes.MUID,
            //     )
            // }
            // if (oldFeatures.features[index].attributes.MUID !== feature.attributes.MUID) {
            //     console.log(
            //         'features[index] !== feature:>> ',
            //         oldFeatures.features[index].attributes.MUID,
            //         feature.attributes.MUID,
            //     )
            // }
            // if (index === 100) {
            //     console.time('update Feature attributes :>> ')
            // }
            for (let timeIndex = 0; timeIndex < dataSet.time.length; timeIndex++) {
                const result = dataSet.data[timeIndex][index]
                feature.attributes[`r${timeIndex}`] = Math.abs(formatValue(result))
                if (layer.id === MODEL_PIPE) {
                    feature.attributes[`f${timeIndex}`] = formatValue(result)
                }
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
    // console.timeEnd(`update Features :>> ${dataSet.iDs.length}`)
    // console.log('features>>>', features)
    console.time('applyEdits :>> ')
    await layer.applyEdits({
        updateFeatures: features,
    })
    console.timeEnd('applyEdits :>> ')
    updateRender(resultItem, layer.renderer as SimpleRenderer, legends)

    layer.visible = true
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
    // 压力渲染
    if (type === 'Pressure') {
        const colorVariable: __geoscene.ColorVariable = {
            type: 'color',
            field: 'r0',
            stops: makeColorStopsWithValue(legends),
        } as any
        const sizeVariable = makeLineSize(legends)
        render.visualVariables = [colorVariable, sizeVariable]
    }
    // 流速渲染 无方向
    else if (type === 'Velocity' || type === 'HydroChronology') {
        const colorVariable: __geoscene.ColorVariable = {
            type: 'color',
            field: 'r0',
            stops: makeColorStopsWithValue(legends),
        } as any
        render.visualVariables = [colorVariable]
    } else if (type === 'Flow') {
        const colorVariable: __geoscene.ColorVariable = {
            type: 'color',
            field: 'r0',
            stops: makeColorStopsWithValue(legends),
        } as any
        const sizeVariable: __geoscene.SizeVariable = makeLineSize(legends)
        render.visualVariables = [colorVariable, sizeVariable]
    } else if (type === 'WaterSupplyBoundary') {
        const colorVariable: __geoscene.ColorVariable = {
            type: 'color',
            field: 'r0',
            stops: makeColorStops(legends),
        } as any
        render.visualVariables = [colorVariable]
    }
    console.log('render>>>', render.visualVariables)
    return render
}

export function updateResultStep(map: ArcGISMap, type: string, index: number): void {
    let layer = map.findLayerById(MODEL_JUNCTION) as GeoJSONLayer
    let renderer = layer.renderer as __geoscene.UniqueValueRenderer
    if (type === 'Velocity') {
        layer = map.findLayerById(MODEL_PIPE) as GeoJSONLayer
        renderer = layer.renderer as __geoscene.UniqueValueRenderer
        renderer.valueExpression = `return "null"`
    } else if (type === 'Flow') {
        layer = map.findLayerById(MODEL_PIPE) as GeoJSONLayer
        renderer = layer.renderer as __geoscene.UniqueValueRenderer
        renderer.valueExpression = `When($feature.f${index} > 0, 'true', $feature.f${index} == 0, '0', 'false')`
    } else if (type === 'HydroChronology') {
        layer = map.findLayerById(MODEL_PIPE) as GeoJSONLayer
        renderer = layer.renderer as __geoscene.UniqueValueRenderer
        renderer.valueExpression = `return "null"`
    } else if (type === 'WaterSupplyBoundary') {
        layer = map.findLayerById(MODEL_PIPE) as GeoJSONLayer
        renderer = layer.renderer as __geoscene.UniqueValueRenderer
        renderer.valueExpression = `return "null"`
    }
    renderer.visualVariables = renderer.visualVariables.map((element) => {
        element.field = `r${index}`
        return element
    })
    console.log('layer :>> ', layer)
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
        BASE_PIPE,
        BASE_JUNCTION,
        BASE_PUMP,
        BASE_TANK,
        BASE_VALVE,
        BASE_DEVICE,
        BASE_DMA,
        BASE_DEVICE_EVALUATION,
        BASE_DEVICE_FACTORY,
        BASE_DEVICE_FLOW,
        BASE_DEVICE_PRESSURE,
        BASE_CLOSING_VALVE,
        BASE_HIGHLIGHT_PIPE,
    ].forEach((key) => {
        toggle(key)
    })
}

/**
 * 设置设备图标
 */
const setSymbol = (type: string): PictureMarkerSymbol => {
    let symbolIcon: PictureMarkerSymbol = DefaultDeviceSymbol
    switch (type) {
        case '考核表':
            symbolIcon = DefaultDeviceEvaluationSymbol
            break
        case '厂站':
            symbolIcon = DefaultDeviceFactorySymbol
            break
        case '压力计':
            symbolIcon = DefaultDevicePressureSymbol
            break
        case '流量计':
            symbolIcon = DefaultDeviceFlowSymbol
            break
        default:
            break
    }
    return symbolIcon
}

/**
 *  设置图层ID
 * */
const setDeviceLayerId = (type: string): string => {
    let deviceId = ''
    switch (type) {
        case '考核表':
            deviceId = BASE_DEVICE_EVALUATION
            break
        case '厂站':
            deviceId = BASE_DEVICE_FACTORY
            break
        case '压力计':
            deviceId = BASE_DEVICE_PRESSURE
            break
        case '流量计':
            deviceId = BASE_DEVICE_FLOW
            break
        default:
            break
    }
    return deviceId
}

/**
 * 改变BASE_PIPE渲染
 * dynamic : true 动态播放
 */

export const changeBasePipeRenderer = (
    map: ArcGISMap,
    type: string,
    dynamic: boolean = false,
): void => {
    console.log('changeBasePipeRenderer :>> ', type, dynamic)
    const pipeLayer = map.findLayerById(type) as GeoJSONLayer
    pipeLayer.visible = false
    const defaultSymbolDynamic = { type: 'simple-line', color: '#72A0C1', width: 3 } as any
    const defaultSymbol = { type: 'simple-line', color: '#165DFF', width: 3 } as any
    let renderer = {}

    if (!dynamic) {
        renderer = {
            defaultSymbol,
            type: 'unique-value',
            valueExpression,
            uniqueValueInfos,
        } as any
    } else {
        renderer = {
            defaultSymbol: defaultSymbolDynamic,
            type: 'unique-value',
        } as any
    }
    console.log('renderer :>> ', renderer, pipeLayer.renderer)
    pipeLayer.renderer = renderer as __geoscene.UniqueValueRenderer
    pipeLayer.visible = true
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

const convertPictureMarkerSymbol = (url: any): any => {
    // 如果url为空,则取默认值
    console.log('convertPictureMarkerSymbol url>>>', url)
    if (url !== '' && url !== undefined && url !== null) {
        return {
            type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
            url,
            width: 15,
            height: 17,
            yoffset: -9,
            xoffset: -7,
        } as any
    }
    return ''
}

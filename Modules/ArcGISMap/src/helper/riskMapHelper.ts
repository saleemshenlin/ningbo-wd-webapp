import GeoJSONLayer from '@geoscene/core/layers/GeoJSONLayer'
import {
    BASE_DEVICE,
    BASE_DEVICE_EVALUATION,
    BASE_DEVICE_FACTORY,
    BASE_DEVICE_FLOW,
    BASE_DEVICE_PRESSURE,
    BASE_DMA,
    BASE_JUNCTION,
    BASE_PIPE,
    BASE_PUMP,
    BASE_TANK,
    BASE_VALVE,
} from '../store/const'
import { transferJSONToUrl } from './jsonToUrl'
import ArcGISMap from '@geoscene/core/Map'
import MapView from '@geoscene/core/views/MapView'
import { IWDBasicGIS } from '../store/types'
import {
    DefaultDeviceEvaluationSymbol,
    DefaultDeviceFactorySymbol,
    DefaultDeviceFlowSymbol,
    DefaultDevicePressureSymbol,
    DefaultDeviceSymbol,
    DefaultPumpSymbol,
    DefaultTankSymbol,
    DefaultValveSymbol,
} from '../symbol/wdSymbol'
import PictureMarkerSymbol from '@geoscene/core/symbols/PictureMarkerSymbol'
import { makeBaseDeviceLayer } from './wdMapHelper'
import { TJDMA, defaultSym } from './dmaHelper'
import { addZoomToLayerCallback } from './zoomToLayer'

// DMA
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
        popupEnabled: false,
    })
    return geojsonLayer
}

// 管道图层的样式
export function makeBasePipeLayer(
    geojson: string,
    setPopupContent?: (feature: { graphic: __geoscene.Graphic }) => HTMLDivElement | null,
): GeoJSONLayer {
    const renderer: __geoscene.UniqueValueRenderer = {
        defaultSymbol: { type: 'simple-line', color: '#165DFF', width: 3 } as any,
        type: 'unique-value',
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
            { name: 'grade', type: 'double' },
        ],
        renderer,
        popupEnabled: false,
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
        popupEnabled: false,
    })
    return geojsonLayer
}

// 水泵图层
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
        popupEnabled: false,
    })

    return geojsonLayer
}

// 水池
export function makeBaseTankLayer(
    geojson: string,
    symbol: PictureMarkerSymbol = DefaultTankSymbol,
    setPopupContent: (feature: { graphic: __geoscene.Graphic }) => HTMLDivElement | null,
): GeoJSONLayer {
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
        popupEnabled: false,
    })

    return geojsonLayer
}

// 阀门
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
        popupEnabled: false,
    })
    return geojsonLayer
}

// 设备图层
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

    const geojsonLayer = new GeoJSONLayer({
        id: setDeviceLayerId(type),
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
        popupEnabled: false,
    })

    return geojsonLayer
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

export async function renderWDBaseLayer(
    map: ArcGISMap,
    view: MapView,
    props: IWDBasicGIS,
    cb: (feature: { graphic: __geoscene.Graphic }, layerId: string) => HTMLDivElement | null,
    data: Array<Record<string, any>>,
    legend: Array<Record<string, any>>,
    layerControl: string[],
    symbolMap: Record<string, string>,
    onRendered?: (
        layer: __geoscene.GeoJSONLayer,
        layerView: __geoscene.GeoJSONLayerView,
        view: __geoscene.MapView,
    ) => void,
): Promise<void> {
    console.log('图标>>>', symbolMap)
    // 加入DMA图层
    if (props.dma !== undefined && map.findLayerById(BASE_DMA) === undefined) {
        const dmaLayer = makeBaseDMALayer(props.dma, (feature) => {
            return cb(feature, BASE_DMA)
        })
        if (onRendered !== undefined) {
            view.whenLayerView(dmaLayer).then((layerView) => {
                onRendered(dmaLayer, layerView, view)
            })
        }
        map.add(dmaLayer)
    }

    if (props.pipe !== undefined && map.findLayerById(BASE_PIPE) === undefined) {
        const pipeLayer = makeResultPipeLayer(props.pipe, data, legend)
        addZoomToLayerCallback(pipeLayer, view)
        map.add(pipeLayer)
        await updateResultSet(data, map)
    }

    if (props.junction !== undefined && map.findLayerById(BASE_JUNCTION) === undefined) {
        const junctionLayer = makeBaseJunctionLayer(props.junction, (feature) => {
            return cb(feature, BASE_JUNCTION)
        })
        map.add(junctionLayer)
    }

    if (props.pump !== undefined && map.findLayerById(BASE_PUMP) === undefined) {
        const pumpLayer = makeBasePumpLayer(props.pump, (feature) => {
            return cb(feature, BASE_PUMP)
        })
        map.add(pumpLayer)
    }

    if (props.tank !== undefined && map.findLayerById(BASE_TANK) === undefined) {
        const tankLayer = makeBaseTankLayer(
            props.tank,
            convertPictureMarkerSymbol(symbolMap?.BASE_TANK),
            (feature) => {
                return cb(feature, BASE_TANK)
            },
        )
        map.add(tankLayer)
    }

    if (props.valve !== undefined && map.findLayerById(BASE_VALVE) === undefined) {
        const valveLayer = makeBaseValveLayer(
            props.valve,
            convertPictureMarkerSymbol(symbolMap?.BASE_VALVE),
            (feature) => {
                return cb(feature, BASE_VALVE)
            },
        )
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
            convertPictureMarkerSymbol(symbolMap?.BASE_DEVICE_EVALUATION),
            (feature) => {
                return cb(feature, BASE_DEVICE_EVALUATION)
            },
        )
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
            convertPictureMarkerSymbol(symbolMap?.BASE_DEVICE_FACTORY),
            (feature) => {
                return cb(feature, BASE_DEVICE_FACTORY)
            },
        )
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
            convertPictureMarkerSymbol(symbolMap?.BASE_DEVICE_PRESSURE),
            (feature) => {
                return cb(feature, BASE_DEVICE_PRESSURE)
            },
        )
        map.add(Layer)
    }
    // TODO 待处理抽象 加入设备-流量计图层
    if (props.device_flow !== undefined && map.findLayerById(BASE_DEVICE_FLOW) === undefined) {
        const Layer = makeBaseDeviceCommonLayer(
            '流量计',
            props.device_flow,
            convertPictureMarkerSymbol(symbolMap?.BASE_DEVICE_FLOW),
            (feature) => {
                return cb(feature, BASE_DEVICE_FLOW)
            },
        )
        map.add(Layer)
    }

    controlLayerVisible(map, layerControl)
}

/**
 * 控制图层显示
 */
export const controlLayerVisible = (map: ArcGISMap, layerSet: string[]): void => {
    // console.log('layerSet', layerSet)

    const toggle = (key: string): void => {
        const layer = map.findLayerById(key)
        if (layer !== undefined) {
            layer.visible = layerSet.includes(key)
            if (key === 'BASE_DMA') {
                map.reorder(layer, 1)
            }
            // 显示图层顺序
            // console.log('显示图层顺序>>>', map.layers)
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
    ].forEach((key) => {
        toggle(key)
    })
}

/**
 * 重新渲染pipe图层
 */
export const renderResultPipeLayer = async (
    map: ArcGISMap,
    view: MapView,
    props: IWDBasicGIS,
    data: Array<Record<string, any>>,
    legend: Array<Record<string, string>>,
): Promise<void> => {
    console.log('renderResultPipeLayer', data, legend)
    const layer = map.findLayerById(BASE_PIPE) as GeoJSONLayer
    if (layer !== undefined) {
        map.remove(layer)
    }
    const pipeLayer = makeResultPipeLayer(props.pipe!, data, legend)
    map.add(pipeLayer)
    map.reorder(pipeLayer, 1)
    await updateResultSet(data, map)
}

export function makeResultPipeLayer(
    geojson: string,
    data: Array<Record<string, any>>,
    legend: Array<Record<string, string>>,
): GeoJSONLayer {
    // const valueExpression = legend.map((item) => {
    //     return `$feature.grade = ${item.grade}, '${item.grade}'`
    // })
    const uniqueValueInfos = legend.map((item) => {
        return {
            value: item.grade,
            symbol: {
                type: 'simple-line',
                color: item.color,
                width: 3,
            },
        }
    })
    const renderer: __geoscene.UniqueValueRenderer = {
        defaultSymbol: { type: 'simple-line', color: '#165DFF', width: 3 } as any,
        type: 'unique-value',
        field: 'grade',
        // valueExpression: `When(${valueExpression.join(', ')})`,
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
            { name: 'grade', type: 'double' },
        ],
        renderer,
        popupEnabled: false,
        editingEnabled: true,
    })

    return geojsonLayer
}

/**
 * 更改地图元素的数据
 */
export const updateResultSet = async (
    dataSet: Array<Record<string, any>>,
    map: ArcGISMap,
): Promise<void> => {
    const pipeLayer = map.findLayerById(BASE_PIPE) as GeoJSONLayer
    pipeLayer.visible = false
    const oldFeatures = await pipeLayer.queryFeatures()
    oldFeatures.features.forEach((feature) => {
        dataSet.forEach((item) => {
            if (item.data.includes(feature.attributes.MUID)) {
                feature.attributes.grade = item.grade
            }
        })
    })

    await pipeLayer.applyEdits({
        updateFeatures: oldFeatures.features,
    })
    pipeLayer.visible = true
    // 渲染
    // const renderer = pipeLayer.renderer as __geoscene.UniqueValueRenderer
    // renderer.field = 'grade'
}

/**
 * 渲染基础管道图层
 */
export const renderBasicPipeLayers = (gis: string, map: ArcGISMap): GeoJSONLayer => {
    const pipeLayer = map.findLayerById(BASE_PIPE) as GeoJSONLayer
    if (pipeLayer !== undefined) {
        map.remove(pipeLayer)
    }
    return makeBasePipeLayer(gis)
}

const convertPictureMarkerSymbol = (url: any): PictureMarkerSymbol => {
    return {
        type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
        url,
        width: 15,
        height: 17,
        yoffset: -9,
        xoffset: -7,
    } as any
}

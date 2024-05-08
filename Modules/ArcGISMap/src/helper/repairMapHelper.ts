import Color from '@geoscene/core/Color'
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
    REPAIR_PIPE,
    BASE_TANK,
    BASE_VALVE,
    REPAIR_JUNCTION,
    REPAIR_TEMP_JUNCTION,
} from '../store/const'
import { IWDBasicGIS } from '../store/types'
import { ILegend, IPipeData } from '../pages/RepairMap/type'
import MapView from '@geoscene/core/views/MapView'
import ArcGISMap from '@geoscene/core/Map'
import { transferJSONToUrl } from './jsonToUrl'
import GeoJSONLayer from '@geoscene/core/layers/GeoJSONLayer'
import { addZoomToLayerCallback } from './zoomToLayer'
import {
    DefaultDeviceEvaluationSymbol,
    DefaultDeviceFactorySymbol,
    DefaultDeviceFlowSymbol,
    DefaultDevicePressureSymbol,
    DefaultDeviceSymbol,
    DefaultPumpSymbol,
    DefaultRepairSymbol,
    DefaultTankSymbol,
    DefaultValveSymbol,
} from '../symbol/wdSymbol'
import PictureMarkerSymbol from '@geoscene/core/symbols/PictureMarkerSymbol'
import FeatureLayer from '@geoscene/core/layers/FeatureLayer'
import { TJDMA, defaultSym } from './dmaHelper'

export function makeBaseDMALayer(geojson: string): GeoJSONLayer {
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

export function makeBasePipeLayer(geojson: string, legend: ILegend[]): GeoJSONLayer {
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
        defaultSymbol: { type: 'simple-line', color: '#7DD61B', width: 3 } as any,
        type: 'unique-value',
        field: 'grade',
        uniqueValueInfos,
    } as any

    const url = transferJSONToUrl(geojson)
    const geojsonLayer = new GeoJSONLayer({
        id: BASE_PIPE,
        url,
        copyright: 'DHI China',
        outFields: ['*'],
        fields: [
            { name: 'grade', type: 'double' }, // 关键字段
            { name: 'MUID', type: 'oid' }, // byId方法
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
        editingEnabled: true,
    })

    return geojsonLayer
}

export function makeBaseJunctionLayer(geojson: string): GeoJSONLayer {
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
    symbol: PictureMarkerSymbol = DefaultPumpSymbol,
): GeoJSONLayer {
    const renderer: __geoscene.renderers.SimpleRenderer = {
        type: 'simple',
        symbol,
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

export function makeBaseTankLayer(
    geojson: string,
    symbol: PictureMarkerSymbol = DefaultTankSymbol,
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

export function makeBaseValveLayer(
    geojson: string,
    symbol: PictureMarkerSymbol = DefaultValveSymbol,
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

export function makeBaseDeviceLayer(geojson: string): GeoJSONLayer {
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
        popupEnabled: false,
    })

    return geojsonLayer
}

export function makeBaseDeviceCommonLayer(
    type: string,
    geojson: string,
    symbol: PictureMarkerSymbol = setSymbol(type),
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

// 抢修管理_图层渲染
export function makeRepairPipeLayer(geojson: string): GeoJSONLayer {
    const renderer: __geoscene.UniqueValueRenderer = {
        defaultSymbol: { type: 'simple-line', color: '#165DFF', width: 5 } as any,
        type: 'unique-value',
    } as any

    const url = transferJSONToUrl(geojson)
    const geojsonLayer = new GeoJSONLayer({
        id: REPAIR_PIPE,
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
        editingEnabled: true,
    })

    return geojsonLayer
}

// 抢修管理_标记节点_FeatureLayer
export function makeRepairJunctionLayer(graphics: any): FeatureLayer {
    const featureLayer = new FeatureLayer({
        title: REPAIR_JUNCTION,
        id: REPAIR_JUNCTION,
        source: JSON.parse(JSON.stringify(graphics)),
        objectIdField: 'ObjectID',
        fields: [
            { name: 'ObjectID', type: 'oid' },
            { name: 'listId', type: 'string' },
        ],
        spatialReference: { wkid: 4326 },
        renderer: {
            type: 'simple',
            symbol: DefaultRepairSymbol,
        },
        popupEnabled: false,
    } as any)

    return featureLayer
}

// 抢修管理_临时标记节点_FeatureLayer
export function makeRepairTempJunctionLayer(graphics: any): FeatureLayer {
    console.log('graphics', graphics)
    const result = graphics === undefined ? '' : graphics
    const featureLayer = new FeatureLayer({
        title: REPAIR_TEMP_JUNCTION,
        id: REPAIR_TEMP_JUNCTION,
        source: JSON.parse(JSON.stringify(result)),
        objectIdField: 'ObjectID',
        fields: [
            { name: 'ObjectID', type: 'oid' },
            { name: 'other', type: 'string' },
        ],
        spatialReference: { wkid: 4326 },
        renderer: {
            type: 'simple',
            symbol: DefaultRepairSymbol,
        },
        popupEnabled: false,
    } as any)

    return featureLayer
}

export async function renderWDBaseLayer(
    map: ArcGISMap,
    view: MapView,
    props: IWDBasicGIS,
    dataSet: IPipeData[],
    legend: ILegend[],
    onRendered?: (
        layer: __geoscene.GeoJSONLayer,
        layerView: __geoscene.GeoJSONLayerView,
        view: __geoscene.MapView,
    ) => void,
    highlightOptions?: {
        color: string | number[] // 填充颜色
        haloColor: string | number[] // 边框颜色
    },
    symbolMap?: Record<string, any>,
    layerControl?: string[],
): Promise<void> {
    // 查看当前图层
    // console.log('map.layers', map.layers)
    // 加入DMA图层
    if (props.dma !== undefined && map.findLayerById(BASE_DMA) === undefined) {
        const dmaLayer = makeBaseDMALayer(props.dma)
        if (onRendered !== undefined) {
            view.whenLayerView(dmaLayer).then((layerView: __geoscene.GeoJSONLayerView) => {
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
        const pipeLayer = makeBasePipeLayer(props.pipe, legend)
        addZoomToLayerCallback(pipeLayer, view)
        map.add(pipeLayer)
        console.log('创建pipe layer')
        await renderPipeLayer(map, dataSet)
    }
    if (props.junction !== undefined && map.findLayerById(BASE_JUNCTION) === undefined) {
        const junctionLayer = makeBaseJunctionLayer(props.junction)
        map.add(junctionLayer)
    }
    // 加入水泵图层
    if (props.pump !== undefined && map.findLayerById(BASE_PUMP) === undefined) {
        const pumpLayer = makeBasePumpLayer(props.pump)
        map.add(pumpLayer)
    }
    // 加入水池图层
    if (props.tank !== undefined && map.findLayerById(BASE_TANK) === undefined) {
        const tankLayer = makeBaseTankLayer(
            props.tank,
            convertPictureMarkerSymbol(symbolMap?.BASE_TANK),
        )
        map.add(tankLayer)
    }
    // 加入阀门图层
    if (props.valve !== undefined && map.findLayerById(BASE_VALVE) === undefined) {
        const valveLayer = makeBaseValveLayer(
            props.valve,
            convertPictureMarkerSymbol(symbolMap?.BASE_VALVE),
        )
        map.add(valveLayer)
    }
    // 加入设备图层
    if (props.device !== undefined && map.findLayerById(BASE_DEVICE) === undefined) {
        const deviceLayer = makeBaseDeviceLayer(props.device)
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
        )
        map.add(Layer)
    }
    // TODO 待处理抽象 加入设备-流量计图层
    if (props.device_flow !== undefined && map.findLayerById(BASE_DEVICE_FLOW) === undefined) {
        const Layer = makeBaseDeviceCommonLayer(
            '流量计',
            props.device_flow,
            convertPictureMarkerSymbol(symbolMap?.BASE_DEVICE_FLOW),
        )
        map.add(Layer)
    }

    // 抢修管理_维修渲染图层
    if (props.repair_pipe !== undefined && map.findLayerById(REPAIR_PIPE) === undefined) {
        const repairLayer = makeRepairPipeLayer(props.repair_pipe)
        if (onRendered !== undefined) {
            view.whenLayerView(repairLayer).then((layerView) => {
                onRendered(repairLayer, layerView, view)
            })
        }
        map.add(repairLayer)
    }

    // 抢修管理_节点图层
    if (props.repair_junction !== undefined && map.findLayerById(REPAIR_JUNCTION) === undefined) {
        const repairJunctionLayer = makeRepairJunctionLayer(props.repair_junction)
        map.add(repairJunctionLayer)
        console.log('REPAIR_JUNCTION 创建完毕!')
    }

    // 抢修管理_临时标记节点图层
    if (
        props.repair_temp_junction !== undefined &&
        map.findLayerById(REPAIR_TEMP_JUNCTION) === undefined
    ) {
        const repairTempJunctionLayer = makeRepairTempJunctionLayer(props.repair_temp_junction)
        map.add(repairTempJunctionLayer)
    }

    controlLayerVisible(map, layerControl as string[])
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
 * 控制图层显示
 */
export const controlLayerVisible = (map: ArcGISMap, layerSet: string[]): void => {
    // console.log('layerSet', layerSet)

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
        REPAIR_PIPE,
        REPAIR_JUNCTION,
        REPAIR_TEMP_JUNCTION,
    ].forEach((key) => {
        toggle(key)
    })
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

export const renderPipeLayer = async (map: ArcGISMap, pipeData: IPipeData[]): Promise<void> => {
    console.log('更新>>>', pipeData)
    const layer = map.findLayerById('BASE_PIPE') as GeoJSONLayer
    layer.visible = false
    const oldFeatures = await layer.queryFeatures()
    if (pipeData.length === 0) {
        oldFeatures.features.forEach((feature) => {
            feature.attributes.grade = 1
        })
    } else {
        oldFeatures.features.forEach((feature) => {
            feature.attributes.grade = 1
            pipeData.forEach((item) => {
                if (item.data.includes(feature.attributes.MUID)) {
                    feature.attributes.grade = item.grade
                }
            })
        })
    }
    await layer.applyEdits({
        updateFeatures: oldFeatures.features,
    })
    layer.visible = true
}

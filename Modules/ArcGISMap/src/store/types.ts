import type MapView from '@geoscene/core/views/MapView'
import type Graphic from '@geoscene/core/Graphic'
import type GeoJSONLayerView from '@geoscene/core/views/layers/GeoJSONLayerView'
import type GeoJSONLayer from '@geoscene/core/layers/GeoJSONLayer'

export interface IWDBasicGIS {
    pipe?: string
    junction?: string
    pump?: string
    tank?: string
    valve?: string
    device?: string
    dma?: string
    device_pressure?: string
    device_evaluation?: string
    device_factory?: string
    device_flow?: string
    highlightPipe?: string // 高亮
    closingValve?: string // 关阀
    cutOffWater?: string // 停水用户
    repair_pipe?: string // 管道图层
    repair_junction?: string // 标记图层
    repair_temp_junction?: string // 临时标记图层 用于创建
    river?: string // 河流
}

export type geometryType = 'point' | 'multipoint' | 'polyline' | 'polygon' | 'multipatch' | 'mesh'

export interface ILegendItem {
    grade: number
    maxValue: number
    minValue: number
    red: number
    green: number
    blue: number
    description?: string
}

export interface IDataSet {
    time: string[]
    iDs: string[]
    data: number[][]
    key?: string
}

export interface IResultMap {
    wdResultGIS?: IWDBasicGIS | null
    dataSet: IDataSet | null
    resultItem: string
    index: number
    legend: ILegendItem[]
    formatValue: (val: number) => number
}

export interface IBaseMap {
    center: [number, number]
    baseUrl: string
    baseLayerType: 'ArcGIS' | 'WMTS' | 'PNG' | 'Vector'
    tMapTK: string
    zoom: number
    wkid: number
    opacity?: number
}

export interface IBaseGeoJSONMap {
    wdBasicGIS: IWDBasicGIS | null
    popup: (feature: { graphic: Graphic }, layerId: string) => HTMLDivElement | null
    onRendered?: (layer: GeoJSONLayer, layerView: GeoJSONLayerView, mapView: MapView) => void
    highlightOptions?: { color: number[] | string; haloColor: number[] | string }
    layerControl: string[]
    section?: number // 节点 | 管道
    resultItem?: ResultItem // 压力等
    symbolMap?: Record<string, string> // 图标
    type?: string // 业务类型
}

export interface IPORJ4 {
    name: string
    proj4: string
}

export interface IValveMapBaseGeo {
    wdBasicGIS: IWDBasicGIS | null
    onRendered?: (layer: GeoJSONLayer, layerView: GeoJSONLayerView, mapView: MapView) => void
}

export const enum SYMBOL {
    GREATER = 0,
    GREATEREQUAL = 1,
    LESSER = 2,
    LESSEREQUAL = 3,
    BETWEEN = 4,
}

export type ISection = 1 | 2

export const enum ResultItem {
    Pressure = 0,
    Flow = 1,
    Velocity = 2,
    ChlorineJunction = 3,
    ChlorinePipe = 4,
    WaterAgeJunction = 5,
    WaterAgePipe = 6,
    AbsFlow = 7,
    Boundary = 8,
    Pollutant = 9,
}

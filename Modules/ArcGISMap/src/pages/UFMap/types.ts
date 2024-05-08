import type ArcGISMap from '@geoscene/core/Map'
import type { IDataSet, ILegendItem } from './../../store/types'
import type MapView from '@geoscene/core/views/MapView'
import type Graphic from '@geoscene/core/Graphic'
import type GeoJSONLayerView from '@geoscene/core/views/layers/GeoJSONLayerView'
import type GeoJSONLayer from '@geoscene/core/layers/GeoJSONLayer'

export const enum ResultItem {
    Pressure = 0,
}

export interface IBasicGIS {
    mesh: string
    [key: string]: string
}

export interface IBaseGeoJSONMap {
    basicGIS: IBasicGIS | null
    popup: (feature: { graphic: Graphic }, layerId: string) => HTMLDivElement | null
    onRendered?: (layer: GeoJSONLayer, layerView: GeoJSONLayerView, mapView: MapView) => void
    highlightOptions?: { color: number[] | string; haloColor: number[] | string }
    layerControl: string[]
    section?: number // 节点 | 管道
    resultItem?: ResultItem // 压力等
    symbolMap?: Record<string, string> // 图标
    type?: string // 业务类型
    deviceTypeConst?: Record<string, any>[] // 长治图标
}

export interface IResultMap {
    resultGIS?: IBasicGIS | null
    dataSet: IDataSet | null
    resultItem: string
    index: number
    legend: ILegendItem[]
    formatValue: (val: number) => number
}

export interface IMapExpose {
    map: ArcGISMap
    viewGoTo: (positions: number[]) => void
    view: MapView | null
}

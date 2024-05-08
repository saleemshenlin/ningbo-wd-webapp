import GeoJSONLayer from '@geoscene/core/layers/GeoJSONLayer'
import MapView from '@geoscene/core/views/MapView'
import GeoJSONLayerView from '@geoscene/core/views/layers/GeoJSONLayerView'
import { ILegend, IPipeData } from './type'

export interface IResultMap {
    dataSet: IPipeData[]
    legend: ILegend[]
}

export interface IBaseGeoJSONMap {
    wdBasicGIS: IWDBasicGIS | null
    layerControl: string[]
    onRendered?: (layer: GeoJSONLayer, layerView: GeoJSONLayerView, mapView: MapView) => void
    highlightOptions?: { color: number[] | string; haloColor: number[] | string }
    symbolMap?: Record<string, any> // 图标
}

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
    repair?: string // 维修图层
}

import type MapView from '@geoscene/core/views/MapView'
import type GeoJSONLayerView from '@geoscene/core/views/layers/GeoJSONLayerView'
import type GeoJSONLayer from '@geoscene/core/layers/GeoJSONLayer'
export interface IResultMap {
    dataSet: Array<Record<string, any>>
    legend: Array<Record<string, any>>
}

export interface IBaseGeoJSONMap {
    wdBasicGIS: IWDBasicGIS | null
    layerControl: string[]
    symbolMap?: Record<string, string> // 图标
    onRendered?: (layer: GeoJSONLayer, layerView: GeoJSONLayerView, mapView: MapView) => void
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
}

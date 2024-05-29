import type { AddLayerObject, MapMouseEvent, MapOptions, StyleSpecification } from 'maplibre-gl'

export interface IPORJ4 {
    name: string
    proj4: string
}

export interface IMapConfig {
    source: string | StyleSpecification
    center: [number, number]
    zoom: number
    options?: MapOptions
}

export interface IMapResult {
    resultItem: string
    timeList: string[]
    idList: string[]
    data: number[][]
    currentIndex: number
    layerId: string
}

export interface IBasicGIS {
    promoteId: string
    geojson?: GeoJSON.GeoJSON
    url?: string
    style: AddLayerObject
    popup?: (f: GeoJSON.Feature, e: MapMouseEvent) => HTMLDivElement | null
    fitness?: boolean
    withArrow?: AddLayerObject
    beforeId?: string
    refresh?: boolean // 用于判断是否需要刷新
}

import type { AddLayerObject, StyleSpecification } from 'maplibre-gl'

export interface IPORJ4 {
    name: string
    proj4: string
}

export interface IMapConfig {
    source: string | StyleSpecification
    center: [number, number]
    zoom: number
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
    popup?: (f: GeoJSON.Feature) => HTMLDivElement | null
    fitness?: boolean
    withArrow?: AddLayerObject
}

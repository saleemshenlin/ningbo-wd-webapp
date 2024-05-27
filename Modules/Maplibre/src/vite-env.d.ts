/// <reference types="vite/client" />

declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}

declare module '@turf/bbox' {
    export default function bbox(geojson: GeoJSON): [number, number, number, number]
}

declare module '@turf/center' {
    export default function center<P = Properties>(
        geojson: AllGeoJSON,
        options?: {
            properties?: P
            bbox?: BBox
            id?: Id
        },
    ): Feature<Point, P>
}

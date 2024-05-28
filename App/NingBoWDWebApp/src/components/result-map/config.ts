import { makeTMapSource } from 'dhi-dss-mf-map-maplibre/source'
import type { IMapConfig } from 'dhi-dss-mf-map-maplibre'

export const mapConfig: IMapConfig = {
    source: makeTMapSource('vec', 'cva', 'w', import.meta.env.VITE_APP_MAPTK),
    center: [121.329303, 28.538657],
    zoom: 11,
}

import { useResult } from '@/store/Result'
import { useGisQueryApiStore } from 'dhi-dss-api-store/gis-service'
import { MODEL_PIPE, IBasicGIS, MODEL_JUNCTION, legend2Color } from 'dhi-dss-mf-map-maplibre'
import { fnSimpleLine, fnSimplePoint } from 'dhi-dss-mf-map-maplibre/style'
import { getActivePinia } from 'pinia'
import { reactive } from 'vue'

export function useModelGIS() {
    const gisQueryApiStore = useGisQueryApiStore()
    const resultStore = useResult()
    const modelLayers = reactive<Record<string, IBasicGIS>>({
        [MODEL_PIPE]: {
            geojson: JSON.parse(gisQueryApiStore.gisMap.get('wd-pipe')!),
            style: fnSimpleLine({
                id: MODEL_PIPE,
                sourceName: MODEL_PIPE,
                color: '#165DFF',
                highlightColor: '#ff0000',
                width: 3,
            }),
            popup: (f) => {
                return null
            },
            fitness: true,
            promoteId: 'Muid',
        } as IBasicGIS,
        [MODEL_JUNCTION]: {
            geojson: JSON.parse(gisQueryApiStore.gisMap.get('wd-junction')!),
            style: fnSimplePoint({
                id: MODEL_JUNCTION,
                sourceName: MODEL_JUNCTION,
                color: '#165DFF',
                highlightColor: '#ff0000',
                size: 5,
            }),
            popup: (f) => {
                return null
            },
            fitness: true,
            promoteId: 'Muid',
        } as IBasicGIS,
    })

    const changeModelLayerStyle = (layerId: string) => {
        switch (layerId) {
            case MODEL_PIPE:
                modelLayers[MODEL_PIPE].style = fnSimpleLine({
                    id: MODEL_PIPE,
                    sourceName: MODEL_PIPE,
                    color: legend2Color(resultStore.classifyLegendList!, 'r0', false),
                    width: 4,
                })
                modelLayers[MODEL_PIPE].geojson = JSON.parse(resultStore.timeSeriesList.gis!) as any
                break
            case MODEL_JUNCTION:
                modelLayers[MODEL_JUNCTION].style = fnSimplePoint({
                    id: MODEL_JUNCTION,
                    sourceName: MODEL_JUNCTION,
                    color: legend2Color(resultStore.classifyLegendList!, 'r0', false),
                    size: 4,
                })
                modelLayers[MODEL_JUNCTION].geojson = JSON.parse(
                    resultStore.timeSeriesList.gis!,
                ) as any
                break
            default:
                break
        }
    }

    return {
        modelLayers,
        changeModelLayerStyle,
    }
}

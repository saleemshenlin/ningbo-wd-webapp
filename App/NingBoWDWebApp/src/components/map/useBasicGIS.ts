import { useGisQueryApiStore } from 'dhi-dss-api-store/gis-service'
import { BASE_PIPE, BASE_JUNCTION, IBasicGIS } from 'dhi-dss-mf-map-maplibre'
import { fnSimpleLine, fnSimplePoint } from 'dhi-dss-mf-map-maplibre/style'
import { getActivePinia } from 'pinia'
import { reactive } from 'vue'

export function useBasicGIS() {
    const gisQueryApiStore = useGisQueryApiStore(getActivePinia())
    const basicLayers = reactive<Record<string, IBasicGIS>>({
        [BASE_PIPE]: {
            geojson: JSON.parse(gisQueryApiStore.gisMap.get('wd-pipe')!),
            style: fnSimpleLine({
                id: BASE_PIPE,
                sourceName: BASE_PIPE,
                color: [
                    'case',
                    ['==', ['get', 'AssetName'], '一期'],
                    '#01D7C9',
                    ['==', ['get', 'AssetName'], '二期'],
                    '#5E82F8',
                    ['==', ['get', 'AssetName'], '三期'],
                    '#FF7272',
                    ['==', ['get', 'AssetName'], '四期'],
                    '#1490FF',
                    '#165DFF', // 其他情况的颜色
                ],
                highlightColor: '#ff0000',
                width: 3,
            }),
            popup: (f) => {
                return null
            },
            fitness: true,
            promoteId: 'Muid',
        } as IBasicGIS,
        [BASE_JUNCTION]: {
            geojson: JSON.parse(gisQueryApiStore.gisMap.get('wd-junction')!),
            style: fnSimplePoint(
                {
                    id: BASE_JUNCTION,
                    sourceName: BASE_JUNCTION,
                    color: '#FFFFFF',
                    highlightColor: '#ff0000',
                    size: 5,
                },
                {
                    paint: {
                        // 设置圆圈的底色为白色
                        'circle-color': '#FFFFFF',
                        // 可选：设置圆圈的半径大小，这里以固定值为例，实际可以根据需要动态设置
                        'circle-radius': 3,
                        // 设置边线（描边）的颜色，依据AssetName字段
                        'circle-stroke-color': [
                            'case',
                            ['==', ['get', 'ZoneID'], '一期'],
                            '#01D7C9',
                            ['==', ['get', 'ZoneID'], '二期'],
                            '#5E82F8',
                            ['==', ['get', 'ZoneID'], '三期'],
                            '#FF7272',
                            ['==', ['get', 'ZoneID'], '四期'],
                            '#1490FF',
                            '#165DFF', // 其他情况的颜色
                        ],

                        // 设置边线的宽度
                        'circle-stroke-width': 1,
                    },
                },
            ),
            popup: (f) => {
                return null
            },
            fitness: true,
            promoteId: 'Muid',
        } as IBasicGIS,
    })

    return {
        basicLayers,
    }
}

import { useGisQueryApiStore } from 'dhi-dss-api-store/gis-service'
import { BASE_PIPE, BASE_JUNCTION, IBasicGIS, ANIMATION_POINT } from 'dhi-dss-mf-map-maplibre'
import {
    PulsingDot,
    fnPointImage,
    fnSimpleLine,
    fnSimplePoint,
} from 'dhi-dss-mf-map-maplibre/style'
import { getActivePinia } from 'pinia'
import { reactive } from 'vue'
import type { Map } from 'maplibre-gl'
import ValvePNG from '@/assets/map/valve.png'

export const BASE_CLOSING_VALVE = 'BASE_CLOSING_VALVE'
export const BASE_CLOSING_PIPE = 'BASE_CLOSING_PIPE'
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
                    '#7dd61b', // 其他情况的颜色
                ],
                highlightColor: '#ff0000',
                width: 3,
            }),
            fitness: true,
            promoteId: 'MUID',
        } as IBasicGIS,
        [BASE_CLOSING_PIPE]: {
            geojson: { type: 'FeatureCollection', features: [] },
            style: fnSimpleLine({
                id: BASE_CLOSING_PIPE,
                sourceName: BASE_CLOSING_PIPE,
                color: '#b319ff',
                highlightColor: '#ff0000',
                width: 3,
            }),
            promoteId: 'MUID',
            refresh: true,
        } as IBasicGIS,
        [ANIMATION_POINT]: {
            geojson: {
                type: 'FeatureCollection',
                features: [],
            },
            style: fnPointImage({
                id: ANIMATION_POINT,
                sourceName: ANIMATION_POINT,
                imageName: 'highlight-point',
                size: 0.6,
            }),
            promoteId: 'id',
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
            fitness: true,
            promoteId: 'Muid',
        } as IBasicGIS,
        [BASE_CLOSING_VALVE]: {
            geojson: { type: 'FeatureCollection', features: [] },
            style: fnPointImage({
                id: BASE_CLOSING_VALVE,
                sourceName: BASE_CLOSING_VALVE,
                imageName: 'closing-valve',
                size: 0.5,
            }),
            promoteId: 'id',
            fitness: true,
            refresh: true,
        } as IBasicGIS,
    })

    /**
     * 添加图片到地图
     */
    const addImage = async (map: Map) => {
        const loadImageAndAddToMap = async (
            map: Map,
            imageUrl: string,
            imageName: string,
            sdf: boolean = true,
        ) => {
            const image = await map.loadImage(imageUrl)
            map.addImage(imageName, image.data, { sdf })
        }

        // await loadImageAndAddToMap(map, ArrowPNG, 'pipe-arrow')
        await loadImageAndAddToMap(map, ValvePNG, 'closing-valve', false) // false 不透明
        // await loadImageAndAddToMap(map, OutletPNG, 'outlet', false) // false 不透明
        // await loadImageAndAddToMap(map, GatePNG, 'gate', false) // false 不透明
        // await loadImageAndAddToMap(map, GatePNG, 'gate', false)
        // await loadImageAndAddToMap(map, ManholePNG, 'manhole', false)
        // await loadImageAndAddToMap(map, SensitivePoint1PNG, 'sensitive-point-1', false)
        // await loadImageAndAddToMap(map, SensitivePoint2PNG, 'sensitive-point-2', false)
        // await loadImageAndAddToMap(map, SensitivePoint3PNG, 'sensitive-point-3', false)

        // 高亮点
        const pulsingDot = new PulsingDot(map)
        map.addImage('highlight-point', pulsingDot, { pixelRatio: 2 })
    }

    return {
        basicLayers,
        addImage,
    }
}

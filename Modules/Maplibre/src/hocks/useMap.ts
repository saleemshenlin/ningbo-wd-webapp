import { onMounted, onUnmounted, Ref, ref } from 'vue'
import {
    FeatureIdentifier,
    GeoJSONSource,
    Map,
    MapGeoJSONFeature,
    MapMouseEvent,
    Popup,
    VectorTileSource,
} from 'maplibre-gl'
import { IBasicGIS, IMapConfig, IMapResult } from '../types'
import bbox from '@turf/bbox'
import center from '@turf/center'
import { isArray } from 'lodash'
import { logger } from '../helper/showError'
import type { Feature, FeatureCollection, LineString, Point } from 'geojson'

export function useMap($map: Ref<HTMLDivElement | null>, props: IMapConfig) {
    const scene = ref<Map | null>(null)
    const layerList = ref<string[]>([])
    const hoverId = ref<string | null>(null)

    /**
     * 创建地图
     */
    const createScene = () => {
        scene.value = new Map({
            container: $map.value!,
            style: props.source,
            center: props.center,
            zoom: props.zoom,
        }) as any
    }

    /**
     * 渲染Vector图层
     * @param layerId
     * @param config
     * @param onLoad
     */
    const renderVectorLayer = (
        layerId: string,
        config: IBasicGIS,
        onLoad?: (l: string) => void,
    ) => {
        const url = config.url!
        const existSource = scene.value!.getSource(layerId) as VectorTileSource
        if (existSource !== undefined) {
            existSource.setUrl(url)
        } else {
            scene.value!.addSource(layerId, {
                type: 'vector',
                url: url,
                promoteId: config.promoteId,
            })
        }
        const existLayer = scene.value!.getLayer(layerId)
        if (existLayer !== undefined) {
            scene.value!.removeLayer(layerId)
        }
        scene.value!.addLayer({
            ...config.style,
            id: layerId,
        })
        layerList.value.push(layerId)
        if (config.fitness) {
            const bounds = (existSource ?? scene.value!.getSource(layerId)).bounds
            if (isArray(bounds)) {
                scene.value!.fitBounds(bounds, {
                    padding: 100, // 可选参数，表示在边界周围增加的像素间距，以防止边界紧贴视图边缘
                })
            }
        }
        if (config.popup !== undefined) {
            initPopup(layerId, config.popup, (config.style as any)['source-layer'])
        }
    }

    /**
     * 渲染geojson图层
     */
    const renderGeoJSONLayer = (
        layerId: string,
        config: IBasicGIS,
        onLoad?: (l: string) => void,
    ) => {
        // const time1 = dayjs()
        // logger.debug('renderGeoJSONLayer start', time1.toDate())
        // * 组装 4861要素*180时间步长 需要1.2s
        const geojson = config.geojson!
        const existSource = scene.value!.getSource(layerId) as GeoJSONSource
        if (existSource !== undefined) {
            existSource.setData(geojson)
        } else {
            scene.value!.addSource(layerId, {
                type: 'geojson',
                data: geojson,
                promoteId: config.promoteId,
            })
        }
        const existLayer = scene.value!.getLayer(layerId)
        if (existLayer !== undefined) {
            scene.value!.removeLayer(layerId)
        }
        scene.value!.addLayer({
            ...config.style,
            id: layerId,
        })
        layerList.value.push(layerId)
        if (config.fitness) {
            const bounds = geojson.bbox
                ? (geojson.bbox as [number, number, number, number])
                : (bbox(geojson) as [number, number, number, number]) // 使用 turf.js 来计算 bounds（需要先安装 @turf/bbox 包）
            scene.value!.fitBounds(bounds, {
                padding: 50, // 可选参数，表示在边界周围增加的像素间距，以防止边界紧贴视图边缘
            })
        }
        if (config.withArrow) {
            scene.value!.addLayer({
                ...config.withArrow,
            })
            layerList.value.push(config.withArrow.id)
        }
        if (config.popup !== undefined) {
            initPopup(layerId, config.popup)
        }
        onLoad && onLoad(layerId)
    }

    /**
     * 渲染基础图层
     * @param basicLayers
     * @param onLoad
     */
    const renderBasicLayers = (
        basicLayers: Record<string, IBasicGIS>,
        onLoad?: (l: string) => void,
    ) => {
        Object.keys(basicLayers).forEach((layerId: string) => {
            // add Source
            const config = basicLayers[layerId]
            renderGeoJSONLayer(layerId, config, onLoad)
        })
    }

    /**
     * 渲染结果图层
     * @param resultSet
     * @param modelLayers
     */
    const renderResultLayer = (resultSet: IMapResult, modelLayers: Record<string, IBasicGIS>) => {
        const { layerId, idList, data, timeList } = resultSet
        if (!Object.keys(modelLayers).includes(layerId)) {
            logger.error('renderModelLayer geojson not found', layerId)
        }
        const layerConfig = modelLayers[layerId]
        try {
            clearResultLayers()
            if (layerConfig.geojson !== undefined) {
                if (data && data.length > 0) {
                    // 准备Properties
                    const features = (layerConfig.geojson as FeatureCollection).features.map(
                        (f, index) => {
                            const tsData = timeList.reduce((properties, _, timeIndex) => {
                                const result = data![index][timeIndex]
                                return {
                                    ...properties,
                                    [`r${timeIndex}`]: result,
                                }
                            }, {} as Record<string, number>)
                            return {
                                ...f,
                                properties: {
                                    id: idList[index],
                                    ...tsData,
                                },
                            }
                        },
                    )
                    renderGeoJSONLayer(layerId, {
                        ...layerConfig,
                        geojson: {
                            ...layerConfig.geojson,
                            features: features,
                        } as FeatureCollection,
                    })
                } else {
                    renderGeoJSONLayer(layerId, layerConfig)
                }
            } else if (layerConfig.url !== undefined) {
                renderVectorLayer(layerId, layerConfig)
            }
        } catch (error) {
            logger.error('renderModelLayer', error, resultSet, modelLayers)
        }
    }

    /**
     * 渲染第 index 步图层样式
     * @param layerId
     * @param index
     */
    const updateResultStep = (layerId: string, index: number) => {
        const layer = scene.value!.getLayer(layerId)
        if (layer !== undefined) {
            try {
                switch (layer.type) {
                    case 'line':
                        // * 仅仅替换颜色
                        // * ['interpolate', ['linear'], ['get', field]]
                        const styleLine = layer.getPaintProperty('line-color') as any
                        if (isArray(styleLine)) {
                            changeRenderIndex(styleLine, index)
                        }
                        scene.value!.setPaintProperty(layerId, 'line-color', styleLine)
                        break
                    case 'fill':
                        const styleFill = layer.getPaintProperty('fill-color') as any
                        if (isArray(styleFill)) {
                            changeRenderIndex(styleFill, index)
                        }
                        scene.value!.setPaintProperty(layerId, 'fill-color', styleFill)
                        scene.value!.setPaintProperty(layerId, 'fill-opacity', [
                            'case',
                            ['has', `r${index}`],
                            1,
                            0,
                        ])
                        break
                    // todo 其他类型
                }
            } catch (error) {
                logger.error('updateResultStep', layer, index)
            }
        }
    }

    /**
     * 显示或者隐藏图层
     * @param layerId
     * @param state
     */
    const toggleLayerVisible = (layerId: string, state: boolean) => {
        const visibility = state ? 'visible' : 'none'
        const layer = scene.value!.getLayer(layerId)
        if (layer !== undefined) {
            scene.value!.setLayoutProperty(layerId, 'visibility', visibility)
        }
        // 处理箭头图层
        const layerArrow = scene.value!.getLayer(`${layerId}_ARROW`)
        if (layerArrow !== undefined) {
            scene.value!.setLayoutProperty(`${layerId}_ARROW`, 'visibility', visibility)
        }
    }

    /**
     * 清除结果图层
     */
    const clearResultLayers = () => {
        layerList.value.forEach((l) => {
            if (l.includes('MODEL_')) {
                scene.value!.removeLayer(l)
            }
        })
        layerList.value = layerList.value.filter((l) => !l.includes('MODEL_'))
    }

    /**
     * 更改渲染的字段顺序
     * @param styleList
     * @param index
     */
    const changeRenderIndex = (styleList: any[], index: number) => {
        styleList.forEach((list: any[]) => {
            if (list[0] === 'interpolate' || list[0] === 'step') {
                list.forEach((item) => {
                    if (item.length === 2 && item[0] === 'get') {
                        item[1] = `r${index}`
                    }
                })
            }
        })
    }

    /**
     * 改变鼠标样式
     * @param className
     */
    const changeMapCursor = (className: 'pointer' | 'grab' | string) => {
        scene.value!.getCanvas().style.cursor = className
    }

    /**
     * 更改要素状态
     * @param feature *For vector tile sources, `sourceLayer` is required.*
     * @param state
     */
    const changeFeatureState = (
        feature: FeatureIdentifier,
        state: Record<'hover', boolean> | Record<'highlight', boolean> | Record<'clicked', boolean>,
    ) => {
        if (feature.id !== undefined) {
            scene.value!.setFeatureState(feature, state)
        }
    }

    /**
     * 创建点击弹窗
     * @param props sourceLayer *For vector tile sources, `sourceLayer` is required.*
     */
    const createPopup = (props: {
        e: MapMouseEvent & {
            features?: MapGeoJSONFeature[] | undefined
        } & Object
        layerId: string
        renderer: (f: Feature) => HTMLDivElement | null
        sourceLayer?: string
    }) => {
        const { e, layerId, renderer } = props
        if (e.features === undefined || e.features.length == 0) {
            return
        }
        const [feature] = e.features!
        const { geometry } = feature
        const geoType = feature.geometry.type
        let location = e.lngLat.toArray()
        switch (geoType) {
            case 'Point':
                location = [(geometry as Point).coordinates[0], (geometry as Point).coordinates[1]]
                break
            case 'LineString':
                const point = center(geometry as LineString)
                location = [point.geometry.coordinates[0], point.geometry.coordinates[1]]
                break
            // * 其他类型再编辑
        }
        const domContent = renderer(feature)
        if (domContent instanceof HTMLElement) {
            // 高亮
            changeFeatureState({ source: layerId, id: feature.id }, { clicked: true })
            const popup = new Popup({
                closeButton: false,
                className: `${feature.layer.id}-map-popup`,
            })
            popup.on('close', () => {
                changeFeatureState({ source: layerId, id: feature.id }, { clicked: false })
            })
            popup.setDOMContent(domContent!)
            popup.setLngLat(location)
            popup.addTo(scene.value! as any)
        }
    }

    /**
     * 初始化弹窗
     * @param layerId
     * @param popup
     * @param sourceLayer *For vector tile sources, `sourceLayer` is required.*
     */
    const initPopup = (
        layerId: string,
        popup: (f: Feature) => HTMLDivElement | null,
        sourceLayer?: string,
    ) => {
        scene.value!.on('mouseenter', layerId, (e) => {
            changeMapCursor('pointer')
            if (e.features === undefined || e.features.length == 0) {
                return
            }
            hoverId.value = e.features[0].id as string
            const feature = { source: layerId, id: e.features[0].id }
            if (sourceLayer !== undefined) {
                Object.assign(feature, { sourceLayer })
            }
            changeFeatureState(feature, { hover: true })
        })
        scene.value!.on('mouseleave', layerId, (e) => {
            changeMapCursor('grab')
            if (hoverId.value !== null) {
                const feature = { source: layerId, id: hoverId.value }
                if (sourceLayer !== undefined) {
                    Object.assign(feature, { sourceLayer })
                }
                changeFeatureState(feature, { hover: false })
            } else {
                hoverId.value = null
            }
        })
        scene.value!.on('click', layerId, (e) => {
            createPopup({
                e: e,
                layerId,
                renderer: popup!,
                sourceLayer,
            })
        })
    }

    onMounted(() => {
        // logger.debug('useTMap onMounted', $map.value);
        layerList.value = []
        createScene()
    })

    onUnmounted(() => {
        layerList.value = []
        scene.value! = null as any
    })

    return {
        scene: scene as unknown as Ref<Map | null>,
        renderBasicLayers,
        renderResultLayer,
        updateResultStep,
        toggleLayerVisible,
    }
}

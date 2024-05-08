import GeoJSONLayer from '@geoscene/core/layers/GeoJSONLayer'
import ArcGISMap from '@geoscene/core/Map'
import MapView from '@geoscene/core/views/MapView'
import FeatureLayer from '@geoscene/core/layers/FeatureLayer'
import { Helper } from '@dhicn/helper'
// import SimpleRenderer from '@geoscene/core/renderers/SimpleRenderer'
import {
    BASE_PIPE,
    BASE_JUNCTION,
    BASE_CLOSING_VALVE,
    BASE_HIGHLIGHT_PIPE,
    BASE_DMA,
    BASE_CUT_OFF_WATER,
    MODEL_PIPE,
} from '../store/const'
import { transferJSONToUrl } from './jsonToUrl'
import { IDataSet, ISection, IWDBasicGIS, ResultItem } from '../store/types'
// import { addZoomToLayerCallback } from './zoomToLayer'
import { isEmpty } from 'lodash'
import { DefaultCutOffWaterSVGSymbol, DefaultValveSymbol } from '../symbol/wdSymbol'
import { addZoomToLayerCallback } from './zoomToLayer'
import { TJDMA, defaultSym } from './dmaHelper'

export function makeModelPipeLayer(
    geojson: string,
    setPopupContent: (feature: { graphic: __geoscene.Graphic }) => HTMLDivElement | null,
): GeoJSONLayer {
    const renderer: __geoscene.UniqueValueRenderer = {
        defaultSymbol: { type: 'simple-line', color: '#7DD61B', width: 3 } as any,
        type: 'unique-value',
    } as any

    const url = transferJSONToUrl(geojson)
    const geojsonLayer = new GeoJSONLayer({
        id: MODEL_PIPE,
        url,
        copyright: 'DHI China',
        outFields: ['*'],
        fields: [
            { name: 'MUID', type: 'string' },
            { name: 'AssetName', type: 'string' },
            { name: 'CDate', type: 'string' },
            { name: 'DataSource', type: 'string' },
            { name: 'Description', type: 'string' },
            { name: 'Diameter', type: 'double' },
            { name: 'FromNode', type: 'string' },
            { name: 'ToNode', type: 'string' },
            { name: 'Length', type: 'double' },
            { name: 'GeometricLength', type: 'double' },
            { name: 'Material', type: 'string' },
            { name: 'Thickness', type: 'double' },
            { name: 'PipeStatus', type: 'double' },
            { name: 'ZoneID', type: 'string' },
            { name: 'Note', type: 'string' },
            { name: 'StreetName', type: 'string' },
            { name: 'L', type: 'double' },
            { name: 'Highlight', type: 'double' },
            { name: 'longitude', type: 'double' },
            { name: 'latitude', type: 'double' },
        ],
        renderer,
        popupEnabled: true,
    })

    return geojsonLayer
}

export function makeJunctionLayer(geojson: string, dateTimes: string[]): GeoJSONLayer {
    const renderer: __geoscene.renderers.ClassBreaksRenderer = {
        type: 'class-breaks', // autocasts as new ClassBreaksRenderer()
        defaultSymbol: {
            type: 'simple-marker',
            size: 2,
            color: 'orange',
            outline: {
                width: 0,
            },
        },
    } as any

    const geojsonLayer = new GeoJSONLayer({
        id: BASE_JUNCTION,
        url: transferJSONToUrl(geojson),
        copyright: 'DHI China',
        outFields: ['*'],
        fields: [
            { name: 'MUID', type: 'string' },
            ...dateTimes.map<any[]>(
                // 根据map过滤数据源。结果集:为
                (date, index) =>
                    ({
                        name: `r${index}`,
                        type: 'double',
                    } as any),
            ),
            { name: 'index', type: 'long' },
        ],
        renderer,
        popupEnabled: false,
        editingEnabled: true,
    })
    return geojsonLayer
}

// 管道图层的样式
export function makePipeLayer(geojson: string, dateTimes: string[]): GeoJSONLayer {
    console.log('makePipeLayer condition>>>>', dateTimes)
    const renderer: __geoscene.renderers.ClassBreaksRenderer = {
        type: 'class-breaks', // autocasts as new ClassBreaksRenderer()
        defaultSymbol: {
            color: 'orange',
            type: 'simple-line',
            width: 2,
        },
    } as any

    const url = transferJSONToUrl(geojson)
    const geojsonLayer = new GeoJSONLayer({
        id: BASE_PIPE,
        url,
        copyright: 'DHI China',
        outFields: ['*'],
        fields: [
            { name: 'MUID', type: 'string' },
            { name: 'Diameter', type: 'double' },
            ...dateTimes.map<any[]>(
                (date, index) =>
                    ({
                        name: `r${index}`,
                        type: 'double',
                    } as any),
            ),
            { name: 'index', type: 'long' },
        ],
        renderer,
        popupEnabled: false,
        editingEnabled: true,
    })
    console.log('makePipeLayer geojsonLayer>>>>', geojsonLayer.fields)
    return geojsonLayer
}

export function makeBaseDMALayer(
    geojson: string,
    setPopupContent: (feature: { graphic: __geoscene.Graphic }) => HTMLDivElement | null,
): GeoJSONLayer {
    const uniqueValueInfos = TJDMA.map((dma) => {
        return {
            value: dma,
            symbol: defaultSym,
        }
    })
    const renderer: __geoscene.UniqueValueRenderer = {
        defaultSymbol: defaultSym as any,
        type: 'unique-value', // autocasts as new UniqueValueRenderer()
        field: 'MUID',
        uniqueValueInfos,
    } as any
    const geojsonLayer = new GeoJSONLayer({
        id: BASE_DMA,
        url: transferJSONToUrl(geojson),
        copyright: 'DHI China',
        outFields: ['*'],
        fields: [
            { name: 'MUID', type: 'string' },
            { name: 'Note', type: 'string' },
        ],
        renderer,
        popupEnabled: false,
    })
    return geojsonLayer
}

// 高亮管道图层 featureLayer
export function makeBaseHighPipeLayer(
    graphics: any,
    setPopupContent: (feature: { graphic: __geoscene.Graphic }) => HTMLDivElement | null,
): FeatureLayer {
    // console.log('分析 graphics  high light', graphics)

    const featureLayer = new FeatureLayer({
        title: BASE_HIGHLIGHT_PIPE,
        id: BASE_HIGHLIGHT_PIPE,
        source: JSON.parse(JSON.stringify(graphics)),
        objectIdField: 'MUID',
        fields: [
            { name: 'MUID', type: 'string' },
            { name: 'Diameter', type: 'double' },
        ],
        spatialReference: { wkid: 4326 },
        renderer: {
            type: 'simple',
            symbol: {
                type: 'simple-line',
                color: '#B319FF',
                width: 4,
            } as any,
        },
        geometryType: 'polyline',
        popupEnabled: false,
    } as any)

    return featureLayer
}

// 关阀 FeatureLayer
export function makeClosingValveFeatureLayer(
    graphics: any,
    setPopupContent: (feature: { graphic: __geoscene.Graphic }) => HTMLDivElement | null,
): FeatureLayer {
    const featureLayer = new FeatureLayer({
        title: BASE_CLOSING_VALVE,
        id: BASE_CLOSING_VALVE,
        source: JSON.parse(JSON.stringify(graphics)),
        objectIdField: 'gisId',
        fields: [
            { name: 'gisId', type: 'string' },
            { name: 'diameter', type: 'double' },
        ],
        spatialReference: { wkid: 4326 },
        renderer: {
            type: 'simple',
            symbol: DefaultValveSymbol,
        },
        popupEnabled: false,
    } as any)

    return featureLayer
}

// 停水用户 FeatureLayer
export function makeCutOffWaterFeatureLayer(
    graphics: any,
    setPopupContent: (feature: { graphic: __geoscene.Graphic }) => HTMLDivElement | null,
): FeatureLayer {
    console.log('graphics gis cut off water', graphics)
    const featureLayer = new FeatureLayer({
        title: BASE_CUT_OFF_WATER,
        id: BASE_CUT_OFF_WATER,
        source: JSON.parse(JSON.stringify(graphics)),
        objectIdField: 'modelId',
        fields: [
            { name: 'modelId', type: 'string' },
            { name: 'note', type: 'string' },
        ],
        spatialReference: { wkid: 4326 },
        renderer: {
            type: 'simple',
            symbol: DefaultCutOffWaterSVGSymbol,
        },
        popupEnabled: false,
    } as any)

    return featureLayer
}

export async function renderWDBaseLayer(
    map: ArcGISMap,
    view: MapView,
    props: IWDBasicGIS,
    cb: (feature: { graphic: __geoscene.Graphic }, layerId: string) => HTMLDivElement | null,
    dataSet: IDataSet,
    section: ISection,
    resultItem: ResultItem,
    type: string,
    onRendered?: (
        layer: __geoscene.GeoJSONLayer,
        layerView: __geoscene.GeoJSONLayerView,
        view: __geoscene.MapView,
    ) => void,
    highlightOptions?: {
        color: string | number[] // 填充颜色
        haloColor: string | number[] // 边框颜色
    },
): Promise<void> {
    // 加入DMA图层
    if (props.dma !== undefined && map.findLayerById(BASE_DMA) === undefined) {
        const dmaLayer = makeBaseDMALayer(props.dma, (feature) => {
            return cb(feature, BASE_DMA)
        })
        if (onRendered !== undefined) {
            if (onRendered !== undefined) {
                view.whenLayerView(dmaLayer).then((layerView) => {
                    onRendered(dmaLayer, layerView, view)
                })
            }
        }
        map.add(dmaLayer)
    }

    // 基础管线图层
    if (props.pipe !== undefined && map.findLayerById(MODEL_PIPE) === undefined) {
        const pipeLayer = makeModelPipeLayer(props.pipe, (feature) => {
            return cb(feature, MODEL_PIPE)
        })
        map.add(pipeLayer)
    }

    // 渲染管线图层
    if (
        props.pipe !== undefined &&
        map.findLayerById(BASE_PIPE) === undefined &&
        section === 2 &&
        !isEmpty(dataSet)
    ) {
        const pipeLayer = makePipeLayer(props.pipe, dataSet.time)

        addZoomToLayerCallback(pipeLayer, view)
        if (onRendered !== undefined) {
            view.whenLayerView(pipeLayer).then((layerView) => {
                onRendered(pipeLayer, layerView, view)
            })
        }
        map.add(pipeLayer)
        await updateResultSet(dataSet, resultItem, map, section, type)
    }

    // 节点图层
    if (
        props.junction !== undefined &&
        map.findLayerById(BASE_JUNCTION) === undefined &&
        section === 1 &&
        !isEmpty(dataSet)
    ) {
        const junctionLayer = makeJunctionLayer(props.junction, dataSet.time)
        map.add(junctionLayer)
        view.whenLayerView(junctionLayer).then(async () => {
            await updateResultSet(dataSet, resultItem, map, section, type)
        })
        // sectionLayerVisible(map, section as ISection)
    }

    // 高亮管道图层
    // if (props.highlightPipe !== undefined && map.findLayerById(BASE_HIGHLIGHT_PIPE) === undefined) {
    //     const highPipeLayer = makeBaseHighPipeLayer(props.highlightPipe, (feature) =>
    //         cb(feature, BASE_HIGHLIGHT_PIPE),
    //     )
    //     map.add(highPipeLayer)
    //     if (!type.includes('valve')) {
    //         highPipeLayer.visible = false
    //     }
    // }

    // 高亮管道图层
    if (props.highlightPipe !== undefined) {
        // console.log(
        //     'props.highlightPipe',
        //     props.highlightPipe,
        //     map.findLayerById(BASE_HIGHLIGHT_PIPE),
        // )
        // 如果高亮管道图层没有建立,并且props.highlightPipe !=='',则建立高亮管道图层
        if (map.findLayerById(BASE_HIGHLIGHT_PIPE) === undefined && props.highlightPipe !== '') {
            const highPipeLayer = makeBaseHighPipeLayer(props.highlightPipe, (feature) =>
                cb(feature, BASE_HIGHLIGHT_PIPE),
            )
            map.add(highPipeLayer)
            if (!type.includes('valve')) {
                highPipeLayer.visible = false
            }
        }
        if (map.findLayerById(BASE_HIGHLIGHT_PIPE) !== undefined && props.highlightPipe === '') {
            map.remove(map.findLayerById(BASE_HIGHLIGHT_PIPE))
        }

        if (map.findLayerById(BASE_HIGHLIGHT_PIPE) !== undefined && props.highlightPipe !== '') {
            // 更新图层,先删除,在生成图层
            map.remove(map.findLayerById(BASE_HIGHLIGHT_PIPE))
            const highPipeLayer = makeBaseHighPipeLayer(props.highlightPipe, (feature) =>
                cb(feature, BASE_HIGHLIGHT_PIPE),
            )
            map.add(highPipeLayer)
            if (!type.includes('valve')) {
                highPipeLayer.visible = false
            }
        }
    }

    // // 关阀图层
    // if (props.closingValve !== undefined && map.findLayerById(BASE_CLOSING_VALVE) === undefined) {
    //     const closingValveLayer = makeClosingValveFeatureLayer(props.closingValve, (feature) =>
    //         cb(feature, BASE_CLOSING_VALVE),
    //     )
    //     map.add(closingValveLayer)
    //     if (!type.includes('valve')) {
    //         closingValveLayer.visible = false
    //     }
    // }

    if (props.closingValve !== undefined) {
        // console.log('props.closingValve', props.closingValve, map.findLayerById(BASE_CLOSING_VALVE))
        if (map.findLayerById(BASE_CLOSING_VALVE) === undefined && props.highlightPipe !== '') {
            const closeValveLayer = makeClosingValveFeatureLayer(props.closingValve, (feature) =>
                cb(feature, BASE_CLOSING_VALVE),
            )
            map.add(closeValveLayer)
            if (!type.includes('valve')) {
                closeValveLayer.visible = false
            }
        }
        if (map.findLayerById(BASE_CLOSING_VALVE) !== undefined && props.closingValve === '') {
            map.remove(map.findLayerById(BASE_CLOSING_VALVE))
        }

        if (map.findLayerById(BASE_CLOSING_VALVE) !== undefined && props.closingValve !== '') {
            // 更新图层,先删除,在生成图层
            map.remove(map.findLayerById(BASE_CLOSING_VALVE))
            const closeValveLayer = makeClosingValveFeatureLayer(props.closingValve, (feature) =>
                cb(feature, BASE_CLOSING_VALVE),
            )
            map.add(closeValveLayer)
            if (!type.includes('valve')) {
                closeValveLayer.visible = false
            }
        }
    }

    // 停水用户图层
    if (props.cutOffWater !== undefined) {
        const cutOffWaterLayerRes = map.findLayerById(BASE_CUT_OFF_WATER) as FeatureLayer
        // console.log('cutOffWaterLayerRes>>', cutOffWaterLayerRes, props.cutOffWater)
        if (cutOffWaterLayerRes !== undefined && props.cutOffWater !== '') {
            cutOffWaterLayerRes.queryFeatures().then((results) => {
                // 如果有数据，清除数据
                if (!isEmpty(results)) {
                    console.log('closingLayerRes results>>', 1)
                    cutOffWaterLayerRes.source.removeAll()
                    cutOffWaterLayerRes.source.addMany(
                        JSON.parse(JSON.stringify(props.cutOffWater)),
                    )
                }
            })
        } else if (cutOffWaterLayerRes !== undefined && props.cutOffWater === '') {
            map.remove(cutOffWaterLayerRes)
        } else {
            if (props.cutOffWater !== '') {
                const cutOffWaterLayer = makeCutOffWaterFeatureLayer(props.cutOffWater, (feature) =>
                    cb(feature, BASE_CUT_OFF_WATER),
                )
                map.add(cutOffWaterLayer)
            }
        }
    }

    sectionLayerVisible(map, section, type)
}

/**
 * 控制图层显示
 */
export const sectionLayerVisible = (map: ArcGISMap, section: ISection, type: string): void => {
    const pipeLayer = map.findLayerById(BASE_PIPE) as GeoJSONLayer
    const junctionLayer = map.findLayerById(BASE_JUNCTION) as GeoJSONLayer
    const modelPipeLayer = map.findLayerById(MODEL_PIPE) as GeoJSONLayer
    const valveLayer = map.findLayerById(BASE_CLOSING_VALVE) as FeatureLayer
    const highlightPipeLayer = map.findLayerById(BASE_HIGHLIGHT_PIPE) as GeoJSONLayer
    const cutOffWaterLayer = map.findLayerById(BASE_CUT_OFF_WATER) as FeatureLayer
    if (junctionLayer !== undefined && pipeLayer !== undefined) {
        // 1:节点 2:管道 当节点的时候,图层显示节点和管道.当管道的时候,图层显示管道,隐藏节点
        if (section === 1) {
            pipeLayer.visible = false
            modelPipeLayer.visible = true
            junctionLayer.visible = true
            // 不能把自定义图层设置为0,因为0是base_map
            if (cutOffWaterLayer !== undefined) {
                map.reorder(cutOffWaterLayer, 4)
            }
            if (valveLayer !== undefined) {
                type.includes('valve') ? map.reorder(valveLayer, 3) : (valveLayer.visible = false)
            }
            if (highlightPipeLayer !== undefined) {
                type.includes('valve')
                    ? map.reorder(highlightPipeLayer, 2)
                    : (highlightPipeLayer.visible = false)
            }

            map.reorder(junctionLayer, 5)
            map.reorder(modelPipeLayer, 1)
        } else {
            junctionLayer.visible = false
            modelPipeLayer.visible = false
            pipeLayer.visible = true

            if (cutOffWaterLayer !== undefined) {
                map.reorder(cutOffWaterLayer, 4)
            }
            if (valveLayer !== undefined) {
                type.includes('valve') ? map.reorder(valveLayer, 3) : (valveLayer.visible = false)
            }
            if (highlightPipeLayer !== undefined) {
                type.includes('valve')
                    ? map.reorder(highlightPipeLayer, 2)
                    : (highlightPipeLayer.visible = false)
            }
            map.reorder(pipeLayer, 1)
        }
    }
}

/** 根据结果渲染节点或者管道图层 */
export const updateResultSet = async (
    dataSet: IDataSet,
    resultItem: ResultItem,
    map: ArcGISMap,
    section: ISection,
    type: string,
): Promise<void> => {
    // sectionLayerVisible(map, section)
    console.log('updateResultSet>>', dataSet, resultItem, map, section, type)
    let layer: GeoJSONLayer
    if (section === 1) {
        layer = map.findLayerById(BASE_JUNCTION) as GeoJSONLayer
    } else {
        layer = map.findLayerById(BASE_PIPE) as GeoJSONLayer
    }

    const oldFeatures = await layer.queryFeatures()
    const features = dataSet.iDs.reduce<__geoscene.Graphic[]>((featureList, id, index) => {
        const feature = oldFeatures.features[index]
        if (feature !== undefined) {
            for (let timeIndex = 0; timeIndex < dataSet.time.length; timeIndex++) {
                const result = dataSet.data[timeIndex][index]
                feature.attributes[`r${timeIndex}`] = Helper.toFixed(
                    Math.abs(formatValue(resultItem, result)),
                )
                // if (layer.id === BASE_PIPE) {
                //     feature.attributes[`f${timeIndex}`] = Helper.toFixed(
                //         formatValue(resultItem, result),
                //     )
                // }
            }
            return [...featureList, feature]
        } else {
            console.info(id, '>> not found')
            return featureList
        }
    }, [])
    await layer.applyEdits({
        updateFeatures: features,
    })
    // 装载index = 0 的样式
    const renderer = layer.renderer as __geoscene.UniqueValueRenderer
    renderer.field = 'r0'
    // console.log('统计 updateResultSet>>>', layer.id, renderer.field)
    sectionLayerVisible(map, section, type)
}

// TODO:项目级别处理,防止每个项目压力计算逻辑不同
const formatValue = (resultItem: ResultItem, result: number): number => {
    switch (resultItem) {
        case ResultItem.Pressure:
            return result / 100
        default:
            return result
    }
}

/** 索引变化读取 */
export const updateResultStep = (map: ArcGISMap, resultItem: ResultItem, index: number): void => {
    let layer = map.findLayerById(BASE_JUNCTION) as GeoJSONLayer
    let renderer = layer.renderer as __geoscene.UniqueValueRenderer
    if (resultItem === ResultItem.Pressure || resultItem === ResultItem.WaterAgeJunction) {
        layer = map.findLayerById(BASE_JUNCTION) as GeoJSONLayer
    } else {
        layer = map.findLayerById(BASE_PIPE) as GeoJSONLayer
        renderer = layer.renderer as __geoscene.UniqueValueRenderer
    }
    renderer.field = `r${index}`

    layer.renderer = renderer
    console.log('统计 visualVariables>>', layer, renderer.field)
}

/** 更新当前地图元素的renderer */
export const updateCurrentLayerRender = (
    map: ArcGISMap,
    section: ISection,
    tag: boolean,
    render: any,
): void => {
    // console.log('统计 updateCurrentLayerRender>>>', section, tag, render)
    if (section === 1) {
        const junctionLayer = map.findLayerById(BASE_JUNCTION) as GeoJSONLayer
        if (junctionLayer === undefined) return
        ;(junctionLayer.renderer as any).classBreakInfos = []
        if (tag) {
            ;(junctionLayer.renderer as any).classBreakInfos = render
        }
        // console.log('统计 junctionLayer>>>', junctionLayer.renderer)
    } else {
        const pipeLayer = map.findLayerById(BASE_PIPE) as GeoJSONLayer
        if (pipeLayer === undefined) return
        ;(pipeLayer.renderer as any).classBreakInfos = []
        if (tag) {
            ;(pipeLayer.renderer as any).classBreakInfos = render
        }
        // console.log('统计 pipeLayer>>>', pipeLayer.renderer)
    }
}

// 控制图层显示
export const controlLayerVisible = (map: ArcGISMap, layerSet: string[]): void => {
    const toggle = (key: string): void => {
        const layer = map.findLayerById(key)
        if (layer !== undefined) {
            layer.visible = layerSet.includes(key)
        }
    }
    ;[BASE_DMA].forEach((key) => {
        toggle(key)
    })
}

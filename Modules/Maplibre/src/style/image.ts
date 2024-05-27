import type { AddLayerObject } from 'maplibre-gl'

/**
 * 线的中心点 添加 image 图层样式
 * @param layerId
 * @param sourceName
 * @param image 图片标识，需要通过map.addImage 加入后生效
 * @param color
 * @returns
 */
export const fnLineCenterImage = (
    props: {
        id: string
        sourceName: string
        imageName: string
        size?: number | any[]
        color?: string | any[]
    },
    options?: Record<string, any>,
) => {
    const layer = {
        id: props.id,
        type: 'symbol',
        source: props.sourceName,
        // 'source-layer': sourceName,
        // minzoom: 13,
        layout: {
            'icon-image': props.imageName,
            'icon-keep-upright': true,
            'icon-overlap': 'never',
            'icon-size': props.size ?? 1,
            'symbol-placement': 'line-center',
        },
        paint: {
            'icon-color': props.color ?? '#fff',
        },
    } as AddLayerObject

    if (options !== undefined) {
        Object.assign(layer, options)
    }
    return layer
}

/**
 * 点 添加 image 图层样式
 * @param id
 * @param sourceName
 * @param imageName
 * @param size
 * @returns
 */
export const fnPointImage = (
    props: {
        id: string
        sourceName: string
        imageName: string
        size?: number | any[]
    },
    options?: Record<string, any>,
) => {
    const layer = {
        id: props.id,
        type: 'symbol',
        source: props.sourceName,
        layout: {
            'icon-image': props.imageName,
            'icon-size': props.size ?? 1,
        },
    } as AddLayerObject

    if (options !== undefined) {
        Object.assign(layer, options)
    }
    return layer
}

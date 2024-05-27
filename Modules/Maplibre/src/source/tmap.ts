// 天地图配置

import { StyleSpecification } from 'maplibre-gl'

export const TMAP_URL = `https://t{d}.tianditu.gov.cn/DataServer?T={l}&X={x}&Y={y}&L={z}&tk={tk}`

/**
 * 生成天地图样式
 * @param mapLayer 'vec' 矢量底图 | 'img' 影像底图 | 'ter' 地形晕渲
 * @param labelLayer 'cva' 矢量注记 | 'cia' 影像注记 | 'cta' 地形注记
 * @param proj  'w' 球面墨卡托投影 | 'c' 经纬度投影,
 * @param tk 天地图密钥
 * @returns
 */
export const makeTMapSource = (
    mapLayer: 'vec' | 'img' | 'ter',
    labelLayer: 'cva' | 'cia' | 'cta',
    proj: 'w' | 'c',
    tk: string,
) => {
    const mapTiles = [0, 1, 2, 3, 4, 5].map((i) => {
        return TMAP_URL.replace('{d}', i.toString())
            .replace('{l}', `${mapLayer}_${proj}`)
            .replace('{tk}', tk)
    })
    const labelTiles = [0, 1, 2, 3, 4, 5].map((i) => {
        return TMAP_URL.replace('{d}', i.toString())
            .replace('{l}', `${labelLayer}_${proj}`)
            .replace('{tk}', tk)
    })

    return {
        version: 8,
        sources: {
            [`${mapLayer}_${proj}`]: {
                type: 'raster',
                tiles: mapTiles,
                tileSize: 256,
            },
            [`${labelLayer}_${proj}`]: {
                type: 'raster',
                tiles: labelTiles,
                tileSize: 256,
            },
        },
        layers: [
            {
                id: `${mapLayer}_${proj}`,
                type: 'raster',
                source: `${mapLayer}_${proj}`,
            },
            {
                id: `${labelLayer}_${proj}`,
                type: 'raster',
                source: `${labelLayer}_${proj}`,
            },
        ],
    } as StyleSpecification
}

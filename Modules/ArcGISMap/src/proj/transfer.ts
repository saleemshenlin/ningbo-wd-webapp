import proj4 from 'proj4'

/**
 * 转为WGS84，默认为Web Mercator
 * @param firstProjection
 * @param point
 */
export const toWGS84 = (point: [number, number], firstProjection: string = 'EPSG:4269') => {
    return proj4(firstProjection).inverse(point)
}

/**
 * 转为Web Mercator，默认为WGS84
 * @param point
 * @param firstProjection
 */
export const toEPSG3857 = (point: [number, number], firstProjection: string = 'EPSG:3857') => {
    return proj4(firstProjection).forward(point)
}

/**
 * 坐标转换
 * @param firstProjection
 * @param secondProjection
 * @param point
 */
export const transfer = (
    firstProjection: string,
    secondProjection: string,
    point: [number, number],
) => {
    return proj4(firstProjection, secondProjection, point)
}

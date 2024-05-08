import BaseTileLayer from '@geoscene/core/layers/BaseTileLayer'
import Color from '@geoscene/core/Color'
import geosceneRequest from '@geoscene/core/request'
import TileInfo from '@geoscene/core/layers/support/TileInfo'
export const PNGMapLayer = (BaseTileLayer as any).createSubclass({
    properties: {
        urlTemplate: null,
        tint: {
            value: null,
            type: Color,
        },
    },
    getTileUrl: function (level: number, row: number, col: number) {
        console.log('getTileUrl :>> ', level, col, row, this.urlTemplate)
        return this.urlTemplate
            .replace('{level}', formatCRL(level, 2, 10))
            .replace('{col}', formatCRL(col, 8, 16))
            .replace('{row}', formatCRL(row, 8, 16))
    },
    fetchTile: async function (
        level: number,
        row: number,
        col: number,
        options: Record<string, any>,
    ) {
        const url = this.getTileUrl(level + 1, row, col)
        console.log('fetchTile :>> ', url)
        return await geosceneRequest(url, {
            responseType: 'image',
            // 新增下面两句,解决乱片问题
            allowImageDataAccess: true,
            signal: options.signal,
        } as any)
            .then((response: any) => {
                const image = response.data
                const width = this.tileInfo.size[0]
                const height = this.tileInfo.size[1]
                const canvas = document.createElement('canvas')
                const context = canvas.getContext('2d') as CanvasRenderingContext2D
                canvas.width = width
                canvas.height = height
                if (this.tint as boolean) {
                    context.fillStyle = this.tint.toCss()
                    context.fillRect(0, 0, width, height)
                    context.globalCompositeOperation = 'difference'
                }
                context.drawImage(image, 0, 0, width, height)
                return canvas
            })
            .catch((err) => {
                console.error('fetchTile error :>> ', err)
            })
    },
})

export const pngTileInfo = new TileInfo({
    // "dpi": 90.71428571428571,
    dpi: 96,
    size: [256, 256],
    // compressionQuality: 0,
    origin: {
        x: -400,
        y: 400,
    },
    spatialReference: {
        wkid: 4490,
    },
    lods: [
        { level: 0, resolution: 1.4078260157100582, scale: 591657527.591555 },
        { level: 1, resolution: 0.703913007855028, scale: 295828763.795777 },
        { level: 2, resolution: 0.35195650392751515, scale: 147914381.897889 },
        { level: 3, resolution: 0.17597825196375638, scale: 73957190.948944 },
        { level: 4, resolution: 0.08798912598187819, scale: 36978595.474472 },
        { level: 5, resolution: 0.043994562990939096, scale: 18489297.737236 },
        { level: 6, resolution: 0.021997281495469548, scale: 9244648.868618 },
        { level: 7, resolution: 0.010998640747734774, scale: 4622324.434309 },
        { level: 8, resolution: 0.005499320373868577, scale: 2311162.217155 },
        { level: 9, resolution: 0.0027496601869330985, scale: 1155581.108577 },
        { level: 10, resolution: 0.0013748308744068413, scale: 577790.882489 },
        { level: 11, resolution: 0.0006874150467326798, scale: 288895.277144 },
        { level: 12, resolution: 0.0003437075233663399, scale: 144447.638572 },
        { level: 13, resolution: 0.00017185376168316996, scale: 72223.819286 },
        { level: 14, resolution: 0.00008592688084158498, scale: 36111.909643 },
        { level: 15, resolution: 0.00004296344042198222, scale: 18055.954822 },
        { level: 16, resolution: 0.00002148172021099111, scale: 9027.977411 },
        { level: 17, resolution: 0.000010740860104305824, scale: 4513.988705 },
        { level: 18, resolution: 0.0000053704300533426425, scale: 2256.994353 },
        { level: 19, resolution: 0.000002685215025481591, scale: 1128.497176 },
    ],
})

export const formatCRL = (num: number, len: number, radix: number = 10): string => {
    let str = num.toString(radix)
    while (str.length < len) {
        str = '0' + str
    }
    return str
}

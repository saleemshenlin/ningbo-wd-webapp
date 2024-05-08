import BaseTileLayer from '@geoscene/core/layers/BaseTileLayer'
import Color from '@geoscene/core/Color'
import geosceneRequest from '@geoscene/core/request'
import TileInfo from '@geoscene/core/layers/support/TileInfo'
export const TMapLayer = (BaseTileLayer as any).createSubclass({
    properties: {
        urlTemplate: null,
        tint: {
            value: null,
            type: Color,
        },
        subDomains: null,
        tk: '',
    },
    getTileUrl: function (level: number, row: number, col: number) {
        return this.urlTemplate
            .replace('{level}', level)
            .replace('{col}', col)
            .replace('{row}', row)
            .replace('{tk}', this.tk)
            .replace(
                '{subDomain}',
                this.subDomains[Math.round(Math.random() * (this.subDomains.length - 1))],
            )
    },
    fetchTile: async function (
        level: number,
        row: number,
        col: number,
        options: Record<string, any>,
    ) {
        const url = this.getTileUrl(level + 1, row, col)
        return await geosceneRequest(url, {
            responseType: 'image',
            // 新增下面两句,解决乱片问题
            allowImageDataAccess: true,
            signal: options.signal,
        } as any).then((response: any) => {
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
    },
})

export const tmapTileInfo = new TileInfo({
    // "dpi": 90.71428571428571,
    dpi: 96,
    size: [256, 256],
    // compressionQuality: 0,
    origin: {
        x: -180,
        y: 90,
    },
    spatialReference: {
        wkid: 4490,
    },
    lods: [
        { level: 0, resolution: 0.703125, scale: 295829355.454566 },
        { level: 1, resolution: 0.3515625, scale: 147914677.727283 },
        { level: 2, resolution: 0.17578125, scale: 73957338.863641 },
        { level: 3, resolution: 0.087890625, scale: 36978669.431821 },
        { level: 4, resolution: 0.0439453125, scale: 18489334.71591 },
        { level: 5, resolution: 0.02197265625, scale: 9244667.357955 },
        { level: 6, resolution: 0.010986328125, scale: 4622333.678978 },
        { level: 7, resolution: 0.0054931640625, scale: 2311166.839489 },
        { level: 8, resolution: 0.00274658203125, scale: 1155583.419744 },
        { level: 9, resolution: 0.001373291015625, scale: 577791.709872 },
        { level: 10, resolution: 0.0006866455078125, scale: 288895.854936 },
        { level: 11, resolution: 0.00034332275390625, scale: 144447.927468 },
        { level: 12, resolution: 0.000171661376953125, scale: 72223.963734 },
        { level: 13, resolution: 8.58306884765625e-5, scale: 36111.981867 },
        { level: 14, resolution: 4.291534423828125e-5, scale: 18055.990934 },
        { level: 15, resolution: 2.1457672119140625e-5, scale: 9027.995467 },
        { level: 16, resolution: 1.0728836059570313e-5, scale: 4513.997733 },
        { level: 17, resolution: 5.3644180297851563e-6, scale: 2256.998867 },
        { level: 18, resolution: 0.000002682209014892578, scale: 1128.499433 },
    ],
})

export const tmapWTileInfo = new TileInfo({
    // "dpi": 90.71428571428571,
    dpi: 96,
    size: [256, 256],
    // compressionQuality: 0,
    origin: {
        x: -20037508.3427892,
        y: 20037508.3427892,
    },
    spatialReference: {
        wkid: 4490,
    },
    lods: [
        { level: 0, resolution: 0.703125, scale: 295829355.454566 },
        { level: 1, resolution: 0.3515625, scale: 147914677.727283 },
        { level: 2, resolution: 0.17578125, scale: 73957338.863641 },
        { level: 3, resolution: 0.087890625, scale: 36978669.431821 },
        { level: 4, resolution: 0.0439453125, scale: 18489334.71591 },
        { level: 5, resolution: 0.02197265625, scale: 9244667.357955 },
        { level: 6, resolution: 0.010986328125, scale: 4622333.678978 },
        { level: 7, resolution: 0.0054931640625, scale: 2311166.839489 },
        { level: 8, resolution: 0.00274658203125, scale: 1155583.419744 },
        { level: 9, resolution: 0.001373291015625, scale: 577791.709872 },
        { level: 10, resolution: 0.0006866455078125, scale: 288895.854936 },
        { level: 11, resolution: 0.00034332275390625, scale: 144447.927468 },
        { level: 12, resolution: 0.000171661376953125, scale: 72223.963734 },
        { level: 13, resolution: 8.58306884765625e-5, scale: 36111.981867 },
        { level: 14, resolution: 4.291534423828125e-5, scale: 18055.990934 },
        { level: 15, resolution: 2.1457672119140625e-5, scale: 9027.995467 },
        { level: 16, resolution: 1.0728836059570313e-5, scale: 4513.997733 },
        { level: 17, resolution: 5.3644180297851563e-6, scale: 2256.998867 },
        { level: 18, resolution: 0.000002682209014892578, scale: 1128.499433 },
    ],
})

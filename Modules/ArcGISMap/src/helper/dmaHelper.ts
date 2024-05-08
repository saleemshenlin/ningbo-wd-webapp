export const TJDMA = [
    'DMA1',
    'DMA2',
    'DMA3',
    'DMA4',
    'DMA5',
    'DMA6',
    'DMA7',
    'DMA8',
    'DMA9',
    'DMA10',
    'DMA11',
]

// DMA默认样式
export const defaultSym = {
    type: 'simple-fill', // autocasts as new SimpleMarkerSymbol()
    size: 25,
    color: [15, 27, 45, 0.2],
    style: 'solid',
    outline: {
        width: 1,
        color: [51, 124, 233, 0.5],
    },
}

// 长治- 行政区划
export const CZDISTRICT = [
    '上党区',
    '平顺县',
    '壶关县',
    '长子县',
    '武乡县',
    '黎城县',
    '襄垣县',
    '沁县',
    '沁源县',
    '屯留区',
    '潞城区',
    '潞州区',
]

// 长治-流域
export const CZDRAINAGEBASIN = ['浊漳南源', '浊漳北源', '浊漳西源', '浊漳干流', '沁河']
export const CZDRAINAGEBASINSymbol = [
    {
        value: '浊漳南源',
        symbol: {
            type: 'simple-fill', // autocasts as new SimpleMarkerSymbol()
            color: [64, 128, 255, 0.3],
        } as any,
    },
    {
        value: '浊漳北源',
        symbol: {
            type: 'simple-fill', // autocasts as new SimpleMarkerSymbol()
            color: [35, 195, 67, 0.3],
        } as any,
    },
    {
        value: '浊漳西源',
        symbol: {
            type: 'simple-fill', // autocasts as new SimpleMarkerSymbol()
            color: [247, 101, 96, 0.3],
        } as any,
    },
    {
        value: '浊漳干流',
        symbol: {
            type: 'simple-fill', // autocasts as new SimpleMarkerSymbol()
            color: [255, 154, 46, 0.3],
        } as any,
    },
    {
        value: '沁河',
        symbol: {
            type: 'simple-fill', // autocasts as new SimpleMarkerSymbol()
            color: [141, 78, 218, 0.3],
        } as any,
    },
]

import type { ClassifyLegendInfo } from '@dhicn/domain-paas-sdk-ts/model-configuration'

export const StatisticItemConfigLabel = {
    AvgValue: '平均值',
    MaxValue: '最大值',
    MinValue: '最小值',
}

// 流速保留4位,其他的ResultItem保留2位, 2023-07-19之后都保留2位
export const DecimalPlaces = [
    {
        title: '压力',
        decimal: 2,
    },
    {
        title: '流量',
        decimal: 2,
    },
    {
        title: '流速',
        decimal: 2,
    },
    {
        title: '水龄',
        decimal: 2,
    },
]

export const getInterpolatedColor = (
    stops: ClassifyLegendInfo[],
    value: number,
): { r: number; g: number; b: number } => {
    // 找到value所在的两个颜色区间
    // console.log('getInterpolatedColor :>> ', stops, value)
    let color = { r: 255, g: 255, b: 255 }
    if (stops.length <= 2) {
        return color
    }
    // 如果值大于或等于最后stop的minValue,直接返回最后stop的颜色
    if (value >= (stops[stops.length - 1].minValue as number)) {
        color = {
            r: stops[stops.length - 1].red as number,
            g: stops[stops.length - 1].green as number,
            b: stops[stops.length - 1].blue as number,
        }
        return color
    }
    let stop1: ClassifyLegendInfo | null = null
    let stop2: ClassifyLegendInfo | null = null
    for (let i = 0; i < stops.length; i++) {
        if (stops[i].minValue != null && value >= (stops[i].minValue as number)) {
            color = {
                r: stops[i].red as number,
                g: stops[i].green as number,
                b: stops[i].blue as number,
            }
        }
        if (
            i > 0 &&
            value >= (stops[i - 1].minValue as number) &&
            value < (stops[i].maxValue as number)
        ) {
            stop1 = stops[i - 1]
            stop2 = stops[i]
            break
        }
    }

    if (stop1 === null || stop2 === null) {
        return color
    }

    // console.log('getInterpolatedColor :>> ', stop1, stop2)
    // 获取区间大小和值在区间的比例
    const interval = (stop2.maxValue as number) - (stop1.maxValue as number)
    const ratio = (value - (stop1.maxValue as number)) / interval

    // 计算RGB值
    const r = Math.round((stop1.red as number) * (1 - ratio) + (stop2.red as number) * ratio)
    const g = Math.round((stop1.green as number) * (1 - ratio) + (stop2.green as number) * ratio)
    const b = Math.round((stop1.blue as number) * (1 - ratio) + (stop2.blue as number) * ratio)

    return { r, g, b }
}

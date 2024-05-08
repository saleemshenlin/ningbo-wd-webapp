import { IChartStyle } from './type'

export const DateTitle = '日期'
export const ChartCategory = ['实测值', '模拟值']

export const chartProps: Record<string, IChartStyle> = {
    实测值: {
        fillColor: (color: string) => `l(270) 0:#ffffff 1:${color}`,
        lineColor: (color: string) => 'transparent',
        lineStyle: {},
        colorIndex: 0,
    },
    模拟值: {
        fillColor: (color: string) => 'transparent',
        lineColor: (color: string) => color,
        lineStyle: {
            lineDash: [1, 5],
        },
        colorIndex: 1,
    },
}

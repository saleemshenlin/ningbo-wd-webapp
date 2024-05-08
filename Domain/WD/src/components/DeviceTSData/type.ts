export interface IItemUnit {
    item: string
    unit: string
}

export interface IChartItem {
    time: Date
    value: number
    category: string
}

export interface IChartStyle {
    fillColor: (color: string) => string
    lineColor: (color: string) => string
    lineStyle: Record<string, any>
    colorIndex: number
}
export interface IWDDevice {
    id: string
    deviceId: string
    indicator: string
    label: string
    type: string
    unit: string
    minValue: number
    maxValue: number
    showName: string
}

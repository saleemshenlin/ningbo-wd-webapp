export interface IProfileTableData {
    pipeName: string
    upJunction: string
    downJunction: string
    pipeDiameter: number
    pipeLength: number
    Elev: number
    Oid: number
}

export interface IStepChangeData {
    index: number
    time: string
}

export interface ITimeSeries {
    time?: string[]
    iDs?: string[]
    data?: number[][]
}

export interface IPopup {
    name: string
    type: string
}

// 地图基础信息interface
export interface IMapBasicInfo {
    tMapTK?: string
    center: number[]
    zoom: number
    baseUrl?: string
    baseLayerType: 'ArcGIS' | 'WMTS' | 'PNG' | 'Vector'
    wkid?: number
    opacity?: number
}

export interface IStatisticDataItem {
    type: string
    data: IStatisticItem[]
}

interface IStatisticItem {
    time: string
    statisticTimeItem: {
        avgValue: number
        maxValue: number
        minValue: number
    }
}

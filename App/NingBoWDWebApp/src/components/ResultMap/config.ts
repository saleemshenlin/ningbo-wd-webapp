import { phase1Color, phase2Color, phase3Color, phase4Color } from '@/constant'
import {
    WDModelResultCN,
    WDModelResultEnum,
    WDModelResultType,
    WDModelResultUnit,
} from 'dhi-dss-api-store/result-service'
import TankSVG from '@/assets/icon/map-tank.svg'
import DeviceSVG from '@/assets/icon/map-device.svg'
import ValveSVG from '@/assets/icon/map-valve.svg'
import PumpSVG from '@/assets/icon/map-pump.svg'
import { WDMapConst } from 'dhi-dss-mf-map-arcgis'
import { Helper } from '@dhicn/helper'
export interface ActiveFeatureType {
    graphic: Record<string, any>
    attributes: Record<string, any>
    type: 'junction' | 'pipe' | 'device' | 'tank' | 'alarm'
}
export interface ChartDataType {
    time: string
    value: number
    category: string
}
export interface ChartDataTypeWithDate {
    time: Date
    value: number
    category: string
}

export interface ResultItemType {
    key: number | string
    label: string
    unit: string
}

export const BasicPipeRender = {
    type: 'unique-value', // autocasts as new UniqueValueRenderer()
    field: 'AssetName',
    defaultSymbol: { type: 'simple-line', width: 3, color: '#165DFF' }, // autocasts as new SimpleFillSymbol()
    uniqueValueInfos: [
        {
            // All features with value of "North" will be blue
            value: '二期',
            symbol: {
                type: 'simple-line', // autocasts as new SimpleFillSymbol()
                color: phase2Color,
                width: 3,
            },
        },
        {
            // All features with value of "East" will be green
            value: '一期',
            symbol: {
                type: 'simple-line', // autocasts as new SimpleFillSymbol()
                color: phase1Color,
                width: 3,
            },
        },
        {
            // All features with value of "South" will be red
            value: '三期',
            symbol: {
                type: 'simple-line', // autocasts as new SimpleFillSymbol()
                color: phase3Color,
                width: 3,
            },
        },
        {
            // All features with value of "South" will be red
            value: '四期',
            symbol: {
                type: 'simple-line', // autocasts as new SimpleFillSymbol()
                color: phase4Color,
                width: 3,
            },
        },
    ],
}

export const BasicJunctionRender = {
    type: 'unique-value', // autocasts as new UniqueValueRenderer()
    field: 'ZoneID',
    defaultSymbol: {
        type: 'simple-marker',
        color: '#fff', // #f8cf09
        size: 5,
        outline: {
            width: 1,
            color: '#165DFF',
        },
    }, // autocasts as new SimpleFillSymbol()
    uniqueValueInfos: [
        {
            // All features with value of "North" will be blue
            value: '二期',
            symbol: {
                type: 'simple-marker',
                color: '#fff', // #f8cf09
                size: 5,
                outline: {
                    width: 1,
                    color: phase2Color,
                },
            },
        },
        {
            // All features with value of "East" will be green
            value: '一期',
            symbol: {
                type: 'simple-marker',
                color: '#fff', // #f8cf09
                size: 5,
                outline: {
                    width: 1,
                    color: phase1Color,
                },
            },
        },
        {
            // All features with value of "South" will be red
            value: '三期',
            symbol: {
                type: 'simple-marker',
                color: '#fff', // #f8cf09
                size: 5,
                outline: {
                    width: 1,
                    color: phase3Color,
                },
            },
        },
        {
            // All features with value of "South" will be red
            value: '四期',
            symbol: {
                type: 'simple-marker',
                color: '#fff', // #f8cf09
                size: 5,
                outline: {
                    width: 1,
                    color: phase4Color,
                },
            },
        },
    ],
}

export const DefaultTankSymbol = {
    type: 'picture-marker',
    url: TankSVG,
    width: 15,
    height: 17,
    yoffset: -9,
    xoffset: -7,
}

export const DefaultDeviceSymbol = {
    type: 'picture-marker',
    url: DeviceSVG,
    width: 15,
    height: 17,
    yoffset: -17,
    xoffset: -7,
}
export const DefaultPumpSymbol = {
    type: 'picture-marker',
    url: PumpSVG,
    width: 15,
    height: 17,
    yoffset: -9,
    xoffset: -7,
}
export const DefaultValveSymbol = {
    type: 'picture-marker',
    url: ValveSVG,
    width: 15,
    height: 17,
    yoffset: -9,
    xoffset: -7,
}

export const pipeShowAttributes = [
    {
        key: 'Description',
        label: 'USID',
    },
    {
        key: 'Material',
        label: '管材',
    },
    {
        key: 'GeometricLength',
        label: '管长(m)',
    },
    {
        key: 'Diameter',
        label: '管径(mm)',
    },
    {
        key: 'StreetName',
        label: '埋设方式',
    },
    // {
    //     key: 'Note',
    //     label: '管线类型',
    // },
]

export const junctionShowAttributes = [
    {
        key: 'Description',
        label: 'USID',
    },
    {
        key: 'Elev',
        label: '节点高程(m)',
    },
    {
        key: 'Note',
        label: '类型',
    },
    {
        key: 'AssetName',
        label: '所在区域',
    },
]

export const tankShowAttributes = [
    {
        key: 'AssetName',
        label: '名称',
    },
    {
        key: 'Elev',
        label: '节点高程(m)',
    },
]
export const alarmShowAttributes = [
    {
        key: 'deviceName',
        label: '名称',
    },
    {
        key: 'alarmDataType',
        label: '类型',
    },
    {
        key: 'alarmTime',
        label: '报警预警时间',
    },
]

export const junctionResultItems = [
    {
        key: WDModelResultEnum.Pressure,
        label: WDModelResultCN[WDModelResultEnum.Pressure],
        unit: WDModelResultUnit[WDModelResultEnum.Pressure],
    },
    {
        key: WDModelResultEnum.NodeHydroChronology,
        label: WDModelResultCN[WDModelResultEnum.NodeHydroChronology],
        unit: WDModelResultUnit[WDModelResultEnum.NodeHydroChronology],
    },
]

export const pipeResultItems = [
    {
        key: WDModelResultEnum.FlowAbs,
        label: WDModelResultCN[WDModelResultEnum.FlowAbs],
        unit: WDModelResultUnit[WDModelResultEnum.FlowAbs],
    },
    {
        key: WDModelResultEnum.Velocity,
        label: WDModelResultCN[WDModelResultEnum.Velocity],
        unit: WDModelResultUnit[WDModelResultEnum.Velocity],
    },
    {
        key: WDModelResultEnum.HydroChronology,
        label: WDModelResultCN[WDModelResultEnum.HydroChronology],
        unit: WDModelResultUnit[WDModelResultEnum.HydroChronology],
    },
]

export const tankResultItems = [
    {
        key: WDModelResultEnum.Head,
        label: WDModelResultCN[WDModelResultEnum.Head],
        unit: WDModelResultUnit[WDModelResultEnum.Head],
    },
]

export const pressureResultItem = {
    key: WDModelResultEnum.Pressure,
    label: WDModelResultCN[WDModelResultEnum.Pressure],
    unit: WDModelResultUnit[WDModelResultEnum.Pressure],
}

export const flowResultItem = {
    key: WDModelResultEnum.Flow,
    label: WDModelResultCN[WDModelResultEnum.Flow],
    unit: WDModelResultUnit[WDModelResultEnum.Flow],
}

export const DateTitle = '日期'
export const ChartCategory = ['实测值', '模拟值']

export interface IChartStyle {
    fillColor: (color: string) => string
    lineColor: (color: string) => string
    lineStyle: Record<string, any>
    colorIndex: number
}

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

export const iconMap = new Map<string, string>([
    [WDMapConst.BASE_TANK, TankSVG],
    [WDMapConst.BASE_DEVICE, DeviceSVG],
    [WDMapConst.BASE_VALVE, ValveSVG],
    [WDMapConst.BASE_PUMP, PumpSVG],
])

export const needFormatDateKey = (key: string): boolean => ['alarmTime'].includes(key)
export const needFormatUnitKey = (key: string): boolean => ['valueDiff'].includes(key)
export const needFormatLabelKey = (key: string): boolean => ['alarmDataType'].includes(key)
export const formatUnit = (key: string, attrs: Record<string, string>): string => {
    if (key === 'valueDiff') {
        const unitString =
            WDModelResultUnit[WDModelResultEnum[attrs.alarmDataType as WDModelResultType]]
        const formatNumber = Helper.toFixed(attrs.valueDiff)
        return unitString.length > 0 ? `${formatNumber}(${unitString})` : `${formatNumber}`
    } else {
        return ''
    }
}

export const formatLabel = (key: string): string => {
    return WDModelResultCN[WDModelResultEnum[key as WDModelResultType]]
}

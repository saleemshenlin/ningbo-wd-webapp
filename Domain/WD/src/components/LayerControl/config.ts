import dayjs from 'dayjs'
import type * as WDApi from '@dhicn/domain-paas-sdk-ts/wd-domain'
import { DayFormat00 } from '@dhicn/helper/date-formatter'

export const DevicePressureTag = 'Pressure'
export const DeviceFlowTag = 'Flow'

export const autoRunStartTime = dayjs().add(-2, 'day').format(DayFormat00)
export const autoRunEndTime = dayjs().add(-2, 'day').format(DayFormat00)

export const alarmStartTime = dayjs().add(-7, 'day').format(DayFormat00)
export const alarmEndTime = dayjs().add(-0, 'day').format(DayFormat00)

export const alarmTimers = 300000 // 每5分钟取一次数据

export const Frequency = 1

export const requestAlarmLog: WDApi.GetAlarmLogByTypeInput = {
    startTime: alarmStartTime,
    endTime: alarmEndTime,
    alarmDataType: [0, 1, 2, 3, 4, 7],
}

export enum WDModelResultEnum {
    Pressure = 0,
    Flow = 1,
    Velocity = 2,
    HydroChronology = 6,
    PipeWaterAge = 5,
    WaterSupplyBoundary = 7,
    AbsFlow = 8,
}

export type WDModelResultType =
    | 'basicInfo'
    | 'Pressure'
    | 'Flow'
    | 'Velocity'
    | 'HydroChronology'
    | 'WaterSupplyBoundary'
    | 'PipeWaterAge' // 后端一致
    | 'AbsFlow'

export const WDModelResultEN = {
    Pressure: WDModelResultEnum.Pressure,
    Flow: WDModelResultEnum.Flow,
    Velocity: WDModelResultEnum.Velocity,
    HydroChronology: WDModelResultEnum.HydroChronology,
    WaterSupplyBoundary: WDModelResultEnum.WaterSupplyBoundary,
    PipeWaterAge: WDModelResultEnum.PipeWaterAge,
    AbsFlow: WDModelResultEnum.AbsFlow,
}

export const WDModelResultCN = {
    [WDModelResultEnum.Pressure]: '压力',
    [WDModelResultEnum.Flow]: '流量',
    [WDModelResultEnum.Velocity]: '流速',
    [WDModelResultEnum.HydroChronology]: '水龄',
    [WDModelResultEnum.PipeWaterAge]: '水龄',
    [WDModelResultEnum.WaterSupplyBoundary]: '供水边界',
    [WDModelResultEnum.AbsFlow]: '流量',
}

export const WDModelResultUnit = {
    [WDModelResultEnum.Pressure]: 'MPa',
    [WDModelResultEnum.Flow]: 'm³/h',
    [WDModelResultEnum.Velocity]: 'm/s',
    [WDModelResultEnum.HydroChronology]: 'h',
    [WDModelResultEnum.PipeWaterAge]: 'h',
    [WDModelResultEnum.WaterSupplyBoundary]: '',
    [WDModelResultEnum.AbsFlow]: 'm³/h',
}

export const pipeShowAttributes = [
    {
        key: 'Diameter',
        label: '管径(mm)',
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
        key: 'Description',
        label: 'USID',
    },
    {
        key: 'StreetName',
        label: '埋设方式',
    },
    {
        key: 'Note',
        label: '管线类型',
    },
]

export const pipeResultItems = [
    {
        key: WDModelResultEnum.Flow,
        label: WDModelResultCN[WDModelResultEnum.Flow],
        unit: WDModelResultUnit[WDModelResultEnum.Flow],
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
    // {
    //     key: WDModelResultEnum.WaterSupplyBoundary,
    //     label: WDModelResultCN[WDModelResultEnum.WaterSupplyBoundary],
    //     unit: WDModelResultUnit[WDModelResultEnum.WaterSupplyBoundary],
    // },
]

export const junctionShowAttributes = [
    {
        key: 'Elev',
        label: '节点高程(m)',
    },
    {
        key: 'Description',
        label: 'USID',
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

export const junctionResultItems = [
    {
        key: WDModelResultEnum.Pressure,
        label: WDModelResultCN[WDModelResultEnum.Pressure],
        unit: WDModelResultUnit[WDModelResultEnum.Pressure],
    },
]

export function formatResultValue(item: string): (val: number) => number {
    switch (item) {
        case 'Pressure':
            return (val: number) => val / 100
        case 'Flow':
            return (val: number) => val
        default:
            return (val: number) => val
    }
}

const { VITE_APP_NAME, VITE_APP_TENANTID } = import.meta.env
export const APP_FONT_RATE = 'APP_FONT_RATE'
export const APP_USER = 'taizhouwd'
export const APP_PWD = '955555=hot'
export const APP_TITLE = VITE_APP_NAME
export const APP_TENANT = VITE_APP_TENANTID

export const mapBasicConfig = {
    center: [121.253, 28.69],
    zoom: 11,
    // http://t0.tianditu.gov.cn/vec_w/geoscene/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=vec&STYLE=default&FORMAT=tiles&TILEMATRIXSET=w&TILEMATRIX=2&TILEROW=2&TILECOL=1&tk=c0f5739ff3935b26727252d1c538fbca&request=GetCapabilities&service=wmts
    // baseUrl: `https://{subDomain}.tianditu.gov.cn/vec_c/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=vec&STYLE=default&FORMAT=tiles&TILEMATRIXSET=c&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk={tk}`,
    // https://t2.tianditu.gov.cn/DataServer?T=cia_c&x=1719&y=332&l=11&tk=d3e16d643a95960789ec23b47eb07d49
    baseUrl: `https://{subDomain}.tianditu.gov.cn/DataServer?T=vec_c&l={level}&y={row}&x={col}&tk={tk}`,
    tk: 'c0f5739ff3935b26727252d1c538fbca',
    wkid: 4490,
    baseLayerType: 'WMTS',
}

export const ProfileChatTitle = '管网剖面图'
export const ModelResultBasicType = 'basicInfo'

import { DayFormat01, HourMinuteFormat01 } from '@dhicn/helper/date-formatter'
import dayjs from 'dayjs'

export const mapBasicConfig = {
    center: [121.253, 28.69],
    zoom: 11,
    // http://t0.tianditu.gov.cn/vec_w/esri/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=vec&STYLE=default&FORMAT=tiles&TILEMATRIXSET=w&TILEMATRIX=2&TILEROW=2&TILECOL=1&tk=c0f5739ff3935b26727252d1c538fbca&request=GetCapabilities&service=wmts
    // baseUrl: `https://{subDomain}.tianditu.gov.cn/vec_c/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=vec&STYLE=default&FORMAT=tiles&TILEMATRIXSET=c&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk={tk}`,
    // https://t2.tianditu.gov.cn/DataServer?T=cia_c&x=1719&y=332&l=11&tk=d3e16d643a95960789ec23b47eb07d49
    baseUrl: `https://{subDomain}.tianditu.gov.cn/DataServer?T=vec_c&l={level}&y={row}&x={col}&tk={tk}`,
    tk: import.meta.env.VITE_APP_MAPTK,
    wkid: 4490,
    baseLayerType: 'WMTS',
    opacity: 0.6,
}

export const autoRunStartTime = dayjs().format(DayFormat01)
export const autoRunEndTime = dayjs().add(1, 'day').format(DayFormat01)
export const alarmStartTime =
    dayjs().add(-30, 'minute').format(DayFormat01) +
    'T' +
    dayjs().add(-30, 'minute').format(HourMinuteFormat01)
export const alarmEndTime = dayjs().format(DayFormat01) + 'T' + dayjs().format(HourMinuteFormat01)

export const requestAlarmLog = {
    // startTime: '2023-06-27',
    startTime: alarmStartTime as any, // 无法确定正确的时间字符串格式
    // endTime: '2023-06-28',
    endTime: alarmEndTime as any, // 无法确定正确的时间字符串格式
    alarmDataType: [0, 1, 2, 3, 4, 7],
}

export const MapLayerControlTreeData = [
    {
        title: '全选',
        key: 'BASE',
        children: [
            {
                title: '节点',
                key: 'BASE_JUNCTION',
                image: '',
            },
            {
                title: '管线',
                key: 'BASE_PIPE',
                image: '',
            },
            {
                title: '水泵',
                key: 'BASE_PUMP',
                image: '',
            },
            {
                title: '水池',
                key: 'BASE_TANK',
                image: '',
            },
            {
                title: '阀门',
                key: 'BASE_VALVE',
                image: '',
            },
            {
                title: '监测设备',
                key: 'BASE_DEVICE',
                image: '',
            },
        ],
    },
]

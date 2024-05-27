import TankSVG from '@/assets/icon/map-tank.svg'
import PhaseSVG from '@/assets/icon/map-phase.svg'
import JunctionSVG from '@/assets/icon/map-junction.svg'
import type { AlarmLogDto } from '@dhicn/domain-paas-sdk-ts/wd-domain'
import { createGeoJSONLayer, AnimationPointLayer } from 'dhi-dss-mf-map-arcgis/helper'
export const hyTank = '黄岩调蓄池'
export const popupFeature = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            properties: {
                oid: 0,
                name: '一期',
                type: '分期调配水量',
                current: '-',
                schedule: '-',
                unit: '万m³/d',
            },
            geometry: {
                type: 'Point',
                coordinates: [121.0916527, 28.6183344],
            },
        },
        {
            type: 'Feature',
            properties: {
                oid: 1,
                name: '二期',
                type: '分期调配水量',
                current: '-',
                schedule: '-',
                unit: '万m³/d',
            },
            geometry: {
                type: 'Point',
                coordinates: [121.1115032, 28.6074004],
            },
        },
        {
            type: 'Feature',
            properties: {
                oid: 2,
                name: '三期',
                type: '分期调配水量',
                current: '-',
                schedule: '-',
                unit: '万m³/d',
            },
            geometry: {
                type: 'Point',
                coordinates: [121.1216059, 28.5845441],
            },
        },
        {
            type: 'Feature',
            properties: {
                oid: 3,
                name: '四期',
                type: '分期调配水量',
                current: '-',
                schedule: '-',
                unit: '万m³/d',
            },
            geometry: {
                type: 'Point',
                coordinates: [121.267784, 28.5302514],
            },
        },
        {
            type: 'Feature',
            properties: {
                oid: 4,
                name: '长潭调节站',
                type: '节点调配水量',
                current: '-',
                schedule: '-',
                unit: '万m³/d',
            },
            geometry: {
                type: 'Point',
                coordinates: [121.0686559, 28.6108514],
            },
        },
        {
            type: 'Feature',
            properties: {
                oid: 5,
                name: '黄岩泵站',
                type: '节点调配水量',
                current: '-',
                schedule: '-',
                unit: '万m³/d',
            },
            geometry: {
                type: 'Point',
                coordinates: [121.2525533, 28.63796268],
            },
        },
        {
            type: 'Feature',
            properties: {
                oid: 6,
                name: '路桥泵站',
                type: '节点调配水量',
                current: '-',
                schedule: '-',
                unit: '万m³/d',
            },
            geometry: {
                type: 'Point',
                coordinates: [121.3575745, 28.5818901],
            },
        },
        {
            type: 'Feature',
            properties: {
                oid: 7,
                name: '台州水厂',
                type: '节点调配水量',
                current: '-',
                schedule: '-',
                unit: '万m³/d',
            },
            geometry: {
                type: 'Point',
                coordinates: [121.3309461, 28.5621376],
            },
        },
        {
            type: 'Feature',
            properties: {
                oid: 8,
                name: '东部水厂',
                type: '节点调配水量',
                current: '-',
                schedule: '-',
                unit: '万m³/d',
            },
            geometry: {
                type: 'Point',
                coordinates: [121.5774253, 28.5649062],
            },
        },
        {
            type: 'Feature',
            properties: {
                oid: 9,
                name: '占堂泵站',
                type: '节点调配水量',
                current: '-',
                schedule: '-',
                unit: '万m³/d',
            },
            geometry: {
                type: 'Point',
                coordinates: [121.267128, 28.533289],
            },
        },
        {
            type: 'Feature',
            properties: {
                oid: 10,
                name: hyTank,
                type: '水厂蓄水量',
                current: '-',
                schedule: '-',
                unit: 'm³',
            },
            geometry: {
                type: 'Point',
                coordinates: [121.2525533, 28.63796268],
            },
        },
        {
            type: 'Feature',
            properties: {
                oid: 11,
                name: '台州水池',
                type: '水厂蓄水量',
                current: '-',
                schedule: '-',
                unit: 'm³',
            },
            geometry: {
                type: 'Point',
                coordinates: [121.3309461, 28.5621376],
            },
        },
        {
            type: 'Feature',
            properties: {
                oid: 12,
                name: '东部水池',
                type: '水厂蓄水量',
                current: '-',
                schedule: '-',
                unit: 'm³',
            },
            geometry: {
                type: 'Point',
                coordinates: [121.5774511, 28.56488354],
            },
        },
        {
            type: 'Feature',
            properties: {
                oid: 13,
                name: '南部湾水池',
                type: '水厂蓄水量',
                current: '-',
                schedule: '-',
                unit: 'm³',
            },
            geometry: {
                type: 'Point',
                coordinates: [121.2456492, 28.26130615],
            },
        },
    ],
}

export const POPUP_LAYER = 'POPUP_LAYER'
export const ALARM_LAYER = 'ALARM_LAYER'
const basicLabelClass = {
    symbol: {
        type: 'text',
        color: '#1e2128',
        borderLineSize: 2,
        yoffset: -5,
        horizontalAlignment: 'left',
        font: {
            size: 10,
        },
    },
    // deconflictionStrategy: 'none',
    labelPlacement: 'above-left',
    labelExpressionInfo: {
        expression: '$feature.name',
    },
}
const tankLabelClass = {
    ...basicLabelClass,
    symbol: {
        ...basicLabelClass.symbol,
        backgroundColor: '#fcfcff',
        borderLineColor: '#7B61FF',
    },
    labelPlacement: 'below-left',
    labelExpressionInfo: {
        expression:
            "$feature.name + '(' + $feature.unit + ')'" +
            " + TextFormatting.NewLine + '总调蓄值: ' + $feature.schedule" +
            " + TextFormatting.NewLine + '当前值: ' + $feature.current",
    },
    where: "type = '水厂蓄水量' AND name <> '黄岩调蓄池'",
}
const tankLabelClass1 = {
    ...tankLabelClass,
    labelPlacement: 'above-right',
    where: "type = '水厂蓄水量' AND name = '黄岩调蓄池'",
}
const junctionLabelClass = {
    ...basicLabelClass,
    symbol: {
        ...basicLabelClass.symbol,
        backgroundColor: '#fcfcff',
        borderLineColor: '#FC9256',
    },
    labelExpressionInfo: {
        expression:
            "$feature.name + '(' + $feature.unit + ')'" +
            " + TextFormatting.NewLine + '同期量: ' + $feature.schedule" +
            " + TextFormatting.NewLine + '调配量: ' + $feature.current",
    },
    where: "type = '节点调配水量' AND name <> '路桥泵站'",
}
const junctionLabelClass1 = {
    ...junctionLabelClass,
    labelPlacement: 'above-right',
    where: "type = '节点调配水量' AND name = '路桥泵站'",
}

// const junctionLabelClass2 = {
//     ...junctionLabelClass,
//     labelPlacement: 'above-center',
//     where: "type = '节点调配水量' AND name = '台州水厂'",
// }

const phase1LabelClass = {
    ...basicLabelClass,
    symbol: {
        ...basicLabelClass.symbol,
        backgroundColor: '#d6fdfc',
        borderLineColor: '#d6fdfc',
    },

    labelExpressionInfo: {
        expression:
            "$feature.name + '(' + $feature.unit + ')'" +
            " + TextFormatting.NewLine + '同期量: ' + $feature.schedule" +
            " + TextFormatting.NewLine + '调配量: ' + $feature.current",
    },
    where: "name = '一期'",
}
const phase2LabelClass = {
    ...basicLabelClass,
    symbol: {
        ...basicLabelClass.symbol,
        backgroundColor: '#d7dffd',
        borderLineColor: '#d7dffd',
        horizontalAlignment: 'right',
    },
    labelPlacement: 'above-right',
    labelExpressionInfo: {
        expression:
            "$feature.name + '(' + $feature.unit + ')'" +
            " + TextFormatting.NewLine + '同期量: ' + $feature.schedule" +
            " + TextFormatting.NewLine + '调配量: ' + $feature.current",
    },
    where: "name = '二期'",
}
const phase3LabelClass = {
    ...basicLabelClass,
    symbol: {
        ...basicLabelClass.symbol,
        backgroundColor: '#f8d7d5',
        borderLineColor: '#f8d7d5',
    },
    labelPlacement: 'below-left',
    labelExpressionInfo: {
        expression:
            "$feature.name + '(' + $feature.unit + ')'" +
            " + TextFormatting.NewLine + '同期量: ' + $feature.schedule" +
            " + TextFormatting.NewLine + '调配量: ' + $feature.current",
    },
    where: "name = '三期'",
}
const phase4LabelClass = {
    ...basicLabelClass,
    symbol: {
        ...basicLabelClass.symbol,
        backgroundColor: '#b9dafc',
        borderLineColor: '#b9dafc',
    },
    labelExpressionInfo: {
        expression:
            "$feature.name + '(' + $feature.unit + ')'" +
            " + TextFormatting.NewLine + '同期量: ' + $feature.schedule" +
            " + TextFormatting.NewLine + '调配量: ' + $feature.current",
    },
    labelPlacement: 'below-left',
    where: "name = '四期'",
}
export const createPopupLayer = (): any => {
    return createGeoJSONLayer({
        id: POPUP_LAYER,
        geojson: JSON.stringify(popupFeature),
        fields: [
            {
                name: 'name',
                type: 'string',
            },
            {
                name: 'type',
                type: 'string',
            },
            {
                name: 'current',
                type: 'string',
            },
            {
                name: 'schedule',
                type: 'string',
            },
            {
                name: 'unit',
                type: 'string',
            },
            {
                name: 'oid',
                type: 'oid',
            },
        ],
        renderer: {
            type: 'unique-value',
            field: 'type',
            defaultSymbol: {
                type: 'picture-marker',
                url: TankSVG,
                width: 15,
                height: 17,
                yoffset: -9,
                xoffset: -7,
            },
            uniqueValueInfos: [
                {
                    value: '节点调配水量',
                    symbol: {
                        type: 'picture-marker',
                        url: JunctionSVG,
                        width: 15,
                        height: 17,
                    },
                },
                {
                    value: '分期调配水量',
                    symbol: {
                        type: 'picture-marker',
                        url: PhaseSVG,
                        width: 1,
                        height: 1,
                    },
                },
                {
                    value: '水厂蓄水量',
                    symbol: {
                        type: 'picture-marker',
                        url: TankSVG,
                        width: 15,
                        height: 17,
                    },
                },
            ],
        } as any,
        popupTemplate: null as any,
        labelingInfo: [
            tankLabelClass,
            tankLabelClass1,
            // tankLabelClass2,
            // tankLabelClass3,
            junctionLabelClass,
            junctionLabelClass1,
            // junctionLabelClass2,
            phase1LabelClass,
            phase2LabelClass,
            phase3LabelClass,
            phase4LabelClass,
        ] as any,
    })
}

export const createAlarmLayer = (alarmMap: Map<string, AlarmLogDto>): any => {
    const LayerFactory = AnimationPointLayer(30, '2.25, 0.47, 0.16')
    return new LayerFactory({
        id: ALARM_LAYER,
        graphics: Array.from(alarmMap.values()).map((item) => ({
            geometry: {
                type: 'point',
                x: item.x,
                y: item.y,
                spatialReference: {
                    wkid: 4490,
                },
            },
            attributes: item,
        })),
    })
}

export const defaultLayerIds = [
    'BASE_PIPE',
    'BASE_JUNCTION',
    'BASE_PUMP',
    'BASE_TANK',
    'BASE_VALVE',
    'BASE_DEVICE',
]

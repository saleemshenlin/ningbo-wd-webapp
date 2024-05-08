import PictureMarkerSymbol from '@geoscene/core/symbols/PictureMarkerSymbol'
import PumpSVG from '../../assets/WD/ico_pump.svg'
import TankSVG from '../../assets/WD/ico_tank.svg'
import ValveSVG from '../../assets/WD/ico_valve.svg'
import DeviceSVG from '../../assets/WD/ico_device.svg'
import DevicePressureSVG from '../../assets/WD/ico_device_pressure.svg'
import DeviceEvaluationSVG from '../../assets/WD/ico_device_evaluation.svg'
import DeviceFlowSVG from '../../assets/WD/ico_device_flow.svg'
import DeviceFactorySVG from '../../assets/WD/ico_device_factory.svg'
import ValveClosingSVG from '../../assets/WD/ico_valve_closing.svg'
import CutOffWaterSVG from '../../assets/WD/ico_valve_cut_off_water.svg'
import LocationSVG from '../../assets/WD/icon_location.svg'
import RepairSVG from '../../assets/WD/ico_repair.svg'

// const { MODE } = import.meta.env
// const src0 = MODE === 'development'

export const DefaultPressureSymbol: PictureMarkerSymbol = {
    type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
    url: `/img/icon/pressure.png`,
    width: 20 * 0.5,
    height: 20 * 0.5,
} as any

export const DefaultTankSymbol: PictureMarkerSymbol = {
    type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
    url: TankSVG,
    width: 15,
    height: 17,
    yoffset: -9,
    xoffset: -7,
} as any

export const DefaultLocationSymbol: PictureMarkerSymbol = {
    type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
    url: LocationSVG,
    width: 26,
    height: 29,
    yoffset: -14,
} as any

// ! 阀门图标 Valve
export const DefaultValveSymbol: PictureMarkerSymbol = {
    type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
    url: ValveSVG,
    width: 15,
    height: 17,
    yoffset: -9,
    xoffset: -7,
} as any

// ! 抢修管理 Repair
export const DefaultRepairSymbol: PictureMarkerSymbol = {
    type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
    url: RepairSVG,
    width: 15,
    height: 17,
    yoffset: -9,
    xoffset: -7,
    verticalAlignment: 'baseline',
} as any

// 停水用户图标
export const DefaultCutOffWaterSVGSymbol: PictureMarkerSymbol = {
    type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
    url: CutOffWaterSVG,
    width: 15,
    height: 17,
    yoffset: -9,
    xoffset: -7,
} as any

// 关阀图标
export const DefaultValveClosingSymbol: PictureMarkerSymbol = {
    type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
    url: ValveClosingSVG,
    width: 15,
    height: 17,
    yoffset: -9,
    xoffset: -7,
} as any

// 水泵图标
export const DefaultPumpSymbol: PictureMarkerSymbol = {
    type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
    url: PumpSVG,
    width: 15,
    height: 17,
    yoffset: -9,
    xoffset: -7,
} as any

// 检测设备图标
export const DefaultDeviceSymbol: PictureMarkerSymbol = {
    type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
    url: DeviceSVG,
    width: 15,
    height: 17,
    yoffset: -9,
    xoffset: -7,
} as any

// 检测设备-压力计
export const DefaultDevicePressureSymbol: PictureMarkerSymbol = {
    type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
    url: DevicePressureSVG,
    width: 15,
    height: 17,
    yoffset: -9,
    xoffset: -7,
} as any

// 检测设备-流量计
export const DefaultDeviceFlowSymbol: PictureMarkerSymbol = {
    type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
    url: DeviceFlowSVG,
    width: 15,
    height: 17,
    yoffset: -9,
    xoffset: -7,
} as any

// 检测设备-考核表
export const DefaultDeviceEvaluationSymbol: PictureMarkerSymbol = {
    type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
    url: DeviceEvaluationSVG,
    width: 15,
    height: 17,
    yoffset: -9,
    xoffset: -7,
} as any

// 检测设备-厂区
export const DefaultDeviceFactorySymbol: PictureMarkerSymbol = {
    type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
    url: DeviceFactorySVG,
    width: 15,
    height: 17,
    yoffset: -9,
    xoffset: -7,
} as any

// * add Flow Symbol
export const DefaultFlowSymbol: PictureMarkerSymbol = {
    type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
    url: `/img/icon/flow.png`,
    width: 20 * 0.5,
    height: 20 * 0.5,
} as any

// * add Chlorine Symbol
export const DefaultChlorineSymbol: PictureMarkerSymbol = {
    type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
    url: `/img/icon/chlorine.png`,
    width: 20 * 0.5,
    height: 20 * 0.5,
} as any

// #region  flow symbol
const arrowIcon = [
    [-10, -4],
    [-10, 4],
    [2, 0],
    [-10, -4],
]

export const ArrowSymbol = {
    type: 'cim', // autocasts as CIMSymbol
    data: {
        type: 'CIMSymbolReference',
        symbol: {
            type: 'CIMLineSymbol',
            symbolLayers: [
                {
                    // black 1px line symbol
                    type: 'CIMSolidStroke',
                    enable: true,
                    width: 3,
                    color: [0, 0, 0, 255],
                },
                {
                    // arrow symbol
                    type: 'CIMVectorMarker',
                    enable: true,
                    size: 20,
                    rotation: 360,
                    markerPlacement: {
                        type: 'CIMMarkerPlacementOnLine', // places same size markers along the line
                        controlPointPlacement: 'WithFullGap',
                        endings: 'Custom',
                        placePerPart: true,
                        placementTemplate: [100], // determines space between each arrow
                        angleToLine: true, // symbol will maintain its angle to the line when map is rotated
                    },
                    frame: {
                        xmin: -5,
                        ymin: -5,
                        xmax: 5,
                        ymax: 5,
                    },
                    markerGraphics: [
                        {
                            type: 'CIMMarkerGraphic',
                            geometry: {
                                rings: [arrowIcon],
                            },
                            symbol: {
                                // black fill for the arrow symbol
                                type: 'CIMPolygonSymbol',
                                symbolLayers: [
                                    {
                                        type: 'CIMSolidFill',
                                        enable: true,
                                        color: [0, 0, 0, 255],
                                    },
                                ],
                            },
                        },
                    ],
                },
            ],
        },
    },
}

export const ArrowSymbolNegative = {
    type: 'cim', // autocasts as CIMSymbol
    data: {
        type: 'CIMSymbolReference',
        symbol: {
            type: 'CIMLineSymbol',
            symbolLayers: [
                {
                    // black 1px line symbol
                    type: 'CIMSolidStroke',
                    enable: true,
                    width: 3,
                    color: [0, 0, 0, 255],
                },
                {
                    // arrow symbol
                    type: 'CIMVectorMarker',
                    enable: true,
                    size: 20,
                    rotation: 180,
                    markerPlacement: {
                        type: 'CIMMarkerPlacementOnLine', // places same size markers along the line
                        controlPointPlacement: 'WithFullGap',
                        endings: 'Custom',
                        placePerPart: true,
                        placementTemplate: [100], // determines space between each arrow
                        angleToLine: true, // symbol will maintain its angle to the line when map is rotated
                    },
                    frame: {
                        xmin: -5,
                        ymin: -5,
                        xmax: 5,
                        ymax: 5,
                    },
                    markerGraphics: [
                        {
                            type: 'CIMMarkerGraphic',
                            geometry: {
                                rings: [arrowIcon],
                            },
                            symbol: {
                                // black fill for the arrow symbol
                                type: 'CIMPolygonSymbol',
                                symbolLayers: [
                                    {
                                        type: 'CIMSolidFill',
                                        enable: true,
                                        color: [0, 0, 0, 255],
                                    },
                                ],
                            },
                        },
                    ],
                },
            ],
        },
    },
}

export const ArrowSymbolLine = {
    type: 'cim', // autocasts as CIMSymbol
    data: {
        type: 'CIMSymbolReference',
        symbol: {
            type: 'CIMLineSymbol',
            symbolLayers: [
                {
                    // black 1px line symbol
                    type: 'CIMSolidStroke',
                    enable: true,
                    width: 3,
                    color: [0, 0, 0, 255],
                },
                {
                    // arrow symbol
                    type: 'CIMVectorMarker',
                    enable: false,
                    size: 8,
                    rotation: 360,
                    markerPlacement: {
                        type: 'CIMMarkerPlacementOnLine', // places same size markers along the line
                        controlPointPlacement: 'WithFullGap',
                        endings: 'Custom',
                        placePerPart: true,
                        placementTemplate: [100], // determines space between each arrow
                        angleToLine: true, // symbol will maintain its angle to the line when map is rotated
                    },
                    frame: {
                        xmin: -5,
                        ymin: -5,
                        xmax: 5,
                        ymax: 5,
                    },
                    markerGraphics: [
                        {
                            type: 'CIMMarkerGraphic',
                            geometry: {
                                rings: [arrowIcon],
                            },
                            symbol: {
                                // black fill for the arrow symbol
                                type: 'CIMPolygonSymbol',
                                symbolLayers: [
                                    {
                                        type: 'CIMSolidFill',
                                        enable: true,
                                        color: [0, 0, 0, 255],
                                    },
                                ],
                            },
                        },
                    ],
                },
            ],
        },
    },
}

// #endregion

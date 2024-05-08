export enum WDModelResultEnum {
    Pressure = 0,
    Flow = 1,
    FlowAbs = 7,
    Velocity = 2,
    HydroChronology = 6,
    NodeHydroChronology = 5,
    basicInfo = 100,
    Head = 'Head',
}

export const WDModelResultEN = {
    basicInfo: WDModelResultEnum.basicInfo,
    Pressure: WDModelResultEnum.Pressure,
    Flow: WDModelResultEnum.Flow,
    FlowAbs: WDModelResultEnum.FlowAbs,
    Velocity: WDModelResultEnum.Velocity,
    HydroChronology: WDModelResultEnum.HydroChronology,
    WaterLevel: WDModelResultEnum.Head,
}

export const WDModelResultCN = {
    [WDModelResultEnum.basicInfo]: '基本信息',
    [WDModelResultEnum.Pressure]: '压力',
    [WDModelResultEnum.Flow]: '流量',
    [WDModelResultEnum.FlowAbs]: '流量',
    [WDModelResultEnum.Velocity]: '流速',
    [WDModelResultEnum.HydroChronology]: '水龄',
    [WDModelResultEnum.NodeHydroChronology]: '水龄',
    [WDModelResultEnum.Head]: '水位',
}

export const WDModelResultUnit = {
    [WDModelResultEnum.basicInfo]: '',
    [WDModelResultEnum.Pressure]: 'MPa',
    [WDModelResultEnum.Flow]: 'm³/h',
    [WDModelResultEnum.FlowAbs]: 'm³/h',
    [WDModelResultEnum.Velocity]: 'm/s',
    [WDModelResultEnum.HydroChronology]: 'h',
    [WDModelResultEnum.NodeHydroChronology]: 'h',
    [WDModelResultEnum.Head]: 'm',
}
// 模型要素类型：管线Link、阀门Valve、节点Node、水池Tank
export type WDModelStructure = 'Link' | 'Valve' | 'Node' | 'Tank'
// 计算类型：水动力HD、水质WaterQuality、水龄WaterAge、水质追踪SourceTracing、水锤WaterHammer
export type WDModelCompute = 'HD' | 'WaterQuality' | 'WaterAge' | 'SourceTracing' | 'WaterHammer'

export type WDModelResultType = 'basicInfo' | 'Pressure' | 'Flow' | 'Velocity' | 'HydroChronology'

export const ModelResultBasicType = 'basicInfo'

export const Frequency = 1

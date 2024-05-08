import * as WwtpApi from '@dhicn/domain-paas-sdk-ts/wwtp-domain'
export interface MccrState {
    feDosingParameterData: WwtpApi.DosingParameterOutput[] // 铁催化剂加药参数
    h2o2DosingParameterData: WwtpApi.DosingParameterOutput[] // 双氧水加药参数
    feAdditionRateData: WwtpApi.CdAdditionRateOutput // 铁催化剂加药计算和实际投加速率
    h2o2AdditionRateData: WwtpApi.CdAdditionRateOutput // 双氧水催化剂加药计算和实际投加速率
    catalysisBfData: WwtpApi.CatalysisBfOutput[] // 催化反应前后的浊度、电导
    catalysisTankData: WwtpApi.CatalysisTankOutput[] // 获取催化池的进水量、pH、ORP

    dosingStatisticDailysData: WwtpApi.DosingStatisticDailysOutput[] // 加药统计
}

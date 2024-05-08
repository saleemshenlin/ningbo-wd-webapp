import * as WwtpApi from '@dhicn/domain-paas-sdk-ts/wwtp-domain'

export interface IntelligentDenitrificationState {
    /**  加药参数 */
    idDosingParameterData: WwtpApi.DosingParameterOutput[]
    /**  运行状态 */
    abftProcessStatusData: WwtpApi.AbftProcessStatusOutput[]
    /** 碳源投加速率 */
    cdAdditionRateData: WwtpApi.CdAdditionRateOutput
    /** 反硝化速率 */
    denitrificationRate: WwtpApi.SingleCodeDatasOutput
    /** 缺氧区出水硝酸盐氮 */
    anoxicNO3Data: WwtpApi.SingleCodeDatasOutput
    /** 进水负荷 */
    inletLoadData: WwtpApi.InletLoadOutput[]
    /** 出水总氮 */
    inletLoadDatas: WwtpApi.OutletTnOutput
    /** 加药报表 */
    DosingLogData: WwtpApi.DosingLogOutput
    /** 加药统计 */
    DosingStatisticDailysData: WwtpApi.DosingStatisticDailysOutput[]
}

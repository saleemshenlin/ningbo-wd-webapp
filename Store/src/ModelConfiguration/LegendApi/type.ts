import { LegendItemDto, ClassifyLegendInfo } from '@dhicn/domain-paas-sdk-ts/model-configuration'
export interface LegendApiState {
    resultItem: LegendItemDto[]
    classifyLegendList: ClassifyLegendInfo[]
    resultItemMap: Map<string, LegendItemDto>
    legendMap: Map<string, ClassifyLegendInfo[]>
}

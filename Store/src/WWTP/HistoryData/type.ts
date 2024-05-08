import * as WwtpApi from '@dhicn/domain-paas-sdk-ts/wwtp-domain'
export type SelectItemNode = WwtpApi.SelectItemNode
export interface HistoryDataState {
    onlineSelectItemNode: SelectItemNode[]
    simSelectItemNode: SelectItemNode[]
    selectNewItemNode: SelectItemNode[]
}
export interface QuerySelectInput {
    modelName: string
    isInputPoint: string
}

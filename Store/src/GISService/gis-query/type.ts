export type WDResultType =
    | 'pipe'
    | 'junction'
    | 'pump'
    | 'valve'
    | 'tank'
    | 'riverWaterLevel'
    | 'riverDischarge'
    | 'device'
    | 'dma'

export interface GisQueryApiState {
    gisMap: Map<WDResultType, any>
}

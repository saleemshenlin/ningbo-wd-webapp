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
    | 'wd-pipe'
    | 'wd-junction'

export interface GisQueryApiState {
    gisMap: Map<WDResultType, any>
}

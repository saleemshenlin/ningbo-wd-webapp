export interface WaterHammerResultAnalysisApiState {
    timeSeriesList: ITimeSeries
}

export interface ITimeSeries {
    time?: string[]
    iDs?: string[]
    data?: number[][]
}

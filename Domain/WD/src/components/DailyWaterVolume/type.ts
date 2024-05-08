export interface IDailyWaterVolume {
    groups: Array<{ id: string; groupName: string }>
    dateSet: Record<string, IWaterVolumeData[]>
}

export interface IWaterVolumeData {
    groupName: string
    forecastValue: number
    currentValue: number
}

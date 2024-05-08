import type {
    SearchCategoryOutput,
    HistorySearchRecordOutput,
} from '@dhicn/domain-paas-sdk-ts/iot-service'

export interface HistoricalDataSearchApiState {
    conditions: SearchCategoryOutput[]
    records: HistorySearchRecordOutput[]
}

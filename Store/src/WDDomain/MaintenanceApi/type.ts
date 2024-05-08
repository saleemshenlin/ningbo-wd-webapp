import { RepairEventStatisticDto, RepairEventDto } from '@dhicn/domain-paas-sdk-ts/wd-domain'

export interface MaintenanceApiState {
    repairPipeList: RepairEventStatisticDto[]
    pipeDetails: Record<string, any>
    repairEventList: RepairEventDto[]
}

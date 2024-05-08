import type { AlarmConfigDto, AlarmLogDto } from '@dhicn/domain-paas-sdk-ts/wd-domain'
export interface AlarmConfigApiState {
    alarmThresholdList: AlarmConfigDto[]
}

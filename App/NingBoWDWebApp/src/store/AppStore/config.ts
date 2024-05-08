import { useUserStore } from '@/store/User/index'

const userStore = useUserStore()

export type ScenarioType = 'WWTP' | 'MIKEPlusFloodModel'

export const MODEL_RUN_CFG = {
    MIKEPlusFloodModel: {
        BusinessType: 5,
        LibraryType: 6,
        ModelType: 'MIKECS',
        TenantID: userStore.user?.tenantId!,
        ProjectName: 'zyws',
    },
    WWTP: {
        BusinessType: 5,
        LibraryType: 19,
        ModelType: 'WWTP',
        TenantID: userStore.user?.tenantId!,
        ProjectName: 'bz',
    },
}

export const TestIndicator = 'WeirHeight_1'
export const TestMUID = '升级补量污水Pump_1'

export const TestResultIndicator = '3c_inflow'
export const TestResultType = 'Discharge'

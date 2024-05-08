import { defineStore } from 'pinia'
import { showError } from '../../helper/showError'
import { ValveConfigApi, GisValveInfo } from '@dhicn/domain-paas-sdk-ts/wd-domain'
import { ValveConfigApiState } from './type'
const StoreName = 'ValveConfigApi'
export const useValveConfigApiStore = defineStore(StoreName, {
    state: (): ValveConfigApiState => ({}),
    actions: {
        /**
         * 获取所有阀门配置
         * /api/v1/domain-wd/config/valve/all
         * 应用于:天津生态城系统配置
         */
        async getValveConfigAllData($api: ValveConfigApi) {
            try {
                const res = await $api.apiV1DomainWdConfigValveAllGet()
                return res.data
            } catch (error) {
                showError('API', 'getValveConfigAllData', error)
                return false
            }
        },
        /**
         * 批量更新阀门配置信息
         * /api/v1/domain-wd/config/valve/update
         * 应用于:天津生态城系统配置
         */
        async updateValveConfigData($api: ValveConfigApi, params: GisValveInfo[]) {
            try {
                const res = await $api.apiV1DomainWdConfigValveUpdatePost(params)
                return res.data as unknown as boolean
            } catch (error) {
                showError('API', 'saveValveConfigData', error)
                return false
            }
        },
    },
})

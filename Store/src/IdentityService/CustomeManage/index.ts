import { defineStore } from 'pinia'
import { CustomManagerApiState } from './type'
import { showError } from '../../helper/showError'
import { CustomManagerApi } from '@dhicn/domain-paas-sdk-ts/identity-service'
const StoreName = 'CustomManagerApi'
export const useCustomManagerApiStore = defineStore(StoreName, {
    state: (): CustomManagerApiState => ({}),
    actions: {
        /**
         * 获取客户列表
         * /api/v1/custom/list
         * 应用于:用户管理系统、系统配置(新版登录)
         */
        async getCustomList($api: CustomManagerApi) {
            try {
                const res = await $api.apiV1CustomListGet()
                return res.data
            } catch (error) {
                showError(StoreName, 'getCustomList', error)
                return []
            }
        },
    },
})

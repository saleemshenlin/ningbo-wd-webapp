import { defineStore } from 'pinia'
import { ComponentApiState } from './type'
import { showError } from '../../helper/showError'
import { ComponentApi } from '@dhicn/domain-paas-sdk-ts/accident-service'
const StoreName = 'ComponentApi'
export const useComponentApiStore = defineStore(StoreName, {
    state: (): ComponentApiState => ({}),
    actions: {
        /**
         * 获取污染物水质项
         * /api/v1/accident/component/list-component-key
         * 应用于:天津、横琴
         */
        async getComponentKeyList($api: ComponentApi, businessType: string) {
            try {
                const res = await $api.apiV1AccidentComponentListComponentKeyGet(businessType)
                return res.data
            } catch (error) {
                showError(StoreName, 'listComponentKey error', error)
                return []
            }
        },
    },
})

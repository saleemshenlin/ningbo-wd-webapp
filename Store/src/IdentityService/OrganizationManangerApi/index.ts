import { defineStore } from 'pinia'
import { OrganizationManangerApiState } from './type'
import { showError } from '../../helper/showError'
import {
    OrganizationManangerApi,
    QueryUserDetailsInput,
} from '@dhicn/domain-paas-sdk-ts/identity-service'
const StoreName = 'OrganizationManangerApi'
export const useScheduleApiStore = defineStore(StoreName, {
    state: (): OrganizationManangerApiState => ({}),
    actions: {
        /**
         * 查询用户详细信息
         * api/v1/user-details/query-by-user-id
         */
        async queryUserDetailsByUserId(
            $api: OrganizationManangerApi,
            params: QueryUserDetailsInput,
        ) {
            try {
                const res = await $api.apiV1UserDetailsQueryByUserIdPost(params)
                return res.data
            } catch (error) {
                showError(StoreName, 'queryUserDetailsByUserId', error)
                return []
            }
        },
    },
})

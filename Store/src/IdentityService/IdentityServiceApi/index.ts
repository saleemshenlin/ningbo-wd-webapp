import { defineStore } from 'pinia'
import { IdentityServiceApiState } from './type'
import { showError } from '../../helper/showError'
import { ConnectApi } from '@dhicn/domain-paas-sdk-ts/identity-service'
const StoreName = 'IdentityServiceApi'
export const useIdentityServiceApiStore = defineStore(StoreName, {
    state: (): IdentityServiceApiState => ({}),
    actions: {
        /**
         * 用户登录 token | 授权-网页
         * /connect/token
         * 应用于:天津、横琴、李家岩简单登录  WebApp/Modules/Login
         */
        async getToken(
            $api: ConnectApi,
            tenantId?: string,
            clientId?: string,
            grantType?: string,
            clientSecret?: string,
            username?: string,
            password?: string,
        ) {
            try {
                const res = await $api.connectTokenPost(
                    tenantId,
                    clientId,
                    grantType,
                    clientSecret,
                    username,
                    password,
                )
                return res.data
            } catch (error) {
                showError(StoreName, 'getToken', error)
                return {}
            }
        },

        /**
         * 用户登录 token | 授权-网页
         * /api/v1/login/token/plus
         * 应用于:台州 WebApp/Modules/Login
         */
        // async getTokenPlus(
        //     $api: ConnectApi,
        //     tenantId?: string,
        //     clientId?: string,
        //     grantType?: string,
        //     clientSecret?: string,
        //     username?: string,
        //     password?: string,
        // ) {
        //     try {
        //         const res = await $api.apiV1LoginTokenPlusPost(
        //             tenantId,
        //             clientId,
        //             grantType,
        //             clientSecret,
        //             username,
        //             password,
        //         )
        //         return res.data
        //     } catch (error) {
        //         showError(StoreName, 'getTokenPlus', error)
        //         return {}
        //     }
        // },

        /**
         * 用户信息展示
         * /connect/userinfo
         */
    },
})

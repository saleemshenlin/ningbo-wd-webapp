import { isString, isBoolean, isEmpty } from 'lodash'

import { connectBaseUrl, INVALID_CLIENT, INVALID_GRANT, UNSUPPORTED_GRANT } from './../store/config'

import { useErrorMessage, useWarningMessage } from '../helper/message'
import { IUser } from '../store/type'
import { ApiHelper } from '@dhicn/domain-paas-sdk-ts/sdk-helper'
import {
    UsersMnangerApi,
    RoleManagerApi,
    TenantManagerApi,
    OrganizationManangerApi,
    PersonalCenterApi,
    ConnectApi,
    LoginApi,
    CustomManagerApi,
} from '@dhicn/domain-paas-sdk-ts/identity-service'
import { AxiosErrorType } from '@dhicn/domain-paas-sdk-ts'

export const API = 'API'

export class ApiHelperExtend extends ApiHelper {
    public baseUrl: string
    user: UsersMnangerApi
    role: RoleManagerApi
    tenant: TenantManagerApi
    organization: OrganizationManangerApi
    person: PersonalCenterApi
    connectApi: ConnectApi
    loginApi: LoginApi
    customManagerApi: CustomManagerApi
    constructor(baseUrl = '') {
        super()
        this.baseUrl = baseUrl + '/user-manager'
        this.axiosInstance.defaults.headers.common['Accept-Language'] = 'zh-Hans' // 接口请求语言
        this.axiosInstance.interceptors.response.use(
            (response) => {
                // Any status code that lie within the range of 2xx cause this function to trigger
                // Do something with response data
                // token check
                // console.log('response', response)
                const url = response.config.url as string
                if (isString(url) && url.includes(connectBaseUrl)) {
                    const { error, error_description, status, message } = response.data
                    console.log(
                        'url,connectBaseUrl>>',
                        url,
                        connectBaseUrl,
                        error,
                        error_description,
                        status,
                        message,
                    )
                    if (isString(error) && isString(error_description)) {
                        switch (error) {
                            case INVALID_GRANT:
                                useErrorMessage('用户名或密码错误！')
                                break
                            case INVALID_CLIENT:
                                useErrorMessage('client_id参数传入有误！')
                                break
                            case UNSUPPORTED_GRANT:
                                useErrorMessage('grant_type参数传入有误！')
                                break
                            default:
                                useErrorMessage(error_description)
                                break
                        }
                        throw new Error(response.data)
                    }
                    if (isBoolean(status) && !status && !isEmpty(message)) {
                        useErrorMessage(message)
                        throw new Error(response.data)
                    }
                    return response
                } else {
                    const { status, data, message } = response.data
                    if (isBoolean(status) && status) {
                        if (data === undefined) {
                            response.data = status
                        } else {
                            response.data = data
                        }
                        return response
                    } else {
                        console.error('Request Error :>> ', response.data)
                        useWarningMessage(message)
                        throw new Error(response.data)
                    }
                }
            },
            (error: AxiosErrorType) => {
                console.error('RequestError :>> ', error)
                if (error.response !== undefined) {
                    const { message, error_description } = error.response.data as any
                    const errMsg = isString(message) ? message : error_description
                    if (isString(errMsg)) {
                        useErrorMessage(errMsg)
                    } else {
                        useErrorMessage(error.message)
                    }
                } else {
                    useErrorMessage(error.message)
                }
            },
        )
        this.user = new UsersMnangerApi(this.baseUrl, this.axiosInstance)
        this.role = new RoleManagerApi(this.baseUrl, this.axiosInstance)
        this.tenant = new TenantManagerApi(this.baseUrl, this.axiosInstance)
        this.organization = new OrganizationManangerApi(this.baseUrl, this.axiosInstance)
        this.person = new PersonalCenterApi(this.baseUrl, this.axiosInstance)
        this.connectApi = new ConnectApi(this.baseUrl, this.axiosInstance)
        this.loginApi = new LoginApi(this.baseUrl, this.axiosInstance)
        this.customManagerApi = new CustomManagerApi(this.baseUrl, this.axiosInstance)
    }

    userInfo = async () => {
        const endpoint = `${this.baseUrl}${connectBaseUrl}/userinfo`
        return await this.axiosInstance.post<IUser>(endpoint).then((r) => r.data)
    }

    fetchRoles = async (userId: string) => {
        try {
            return await this.organization
                .apiV1UserDetailsQueryByUserIdPost({
                    userIds: [userId],
                })
                .then((rep) => (rep.data.length > 0 ? rep.data[0] : null))
        } catch (error) {
            console.error('get roles :>> ', error)
            return await Promise.resolve(null)
        }
    }
}

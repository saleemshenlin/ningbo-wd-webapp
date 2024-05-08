import * as ScenarioApi from '@dhicn/domain-paas-sdk-ts/scenario-service'
import * as IotApi from '@dhicn/domain-paas-sdk-ts/iot-service'
import * as ModelDriverApi from '@dhicn/domain-paas-sdk-ts/model-driver-service'
import { OrganizationManangerApi } from '@dhicn/domain-paas-sdk-ts/identity-service'
import { IToken, IUser } from 'dhi-dss-mf-login'
import { isBoolean, isString } from 'lodash'
import { UseMessage } from 'dhi-dss-mf-layout'
import { useUserStore } from '../store/User'
import { ApiHelper } from '@dhicn/domain-paas-sdk-ts/sdk-helper'
import { NetworkApi } from '@dhicn/domain-paas-sdk-ts/result-service'

const { useErrorMessage } = UseMessage

export const API = 'API'

export const baseUrl = '/ningbo-wd'
export const organizationUrl = `${baseUrl}/user-manager`
export const connectBaseUrl = `${baseUrl}/user-manager/connect/userinfo` // 获得用户信息
export const iotBaseUrl = `${baseUrl}/iot-service`
export const wwtpPaaSBaseUrl = `${baseUrl}/wwtp-paas-main-bus-service`
export const wwtpBaseUrl = `${baseUrl}/wwtp-paas-service`

export const scenarioBaseUrl = `${baseUrl}/global-scenario-manager-service`
export const modelDriverBaseUrl = `${baseUrl}/global-model-driver-service`
export const globalResultServiceBaseUrl = `${baseUrl}/global-result-service`

export interface IApi {
    setAuth: (token: IToken) => void
    changeTenantId: (tenantId: string) => void
    iot_data: IotApi.DataApi
    iot_ts: IotApi.TelemetryApi
    iot_opc: IotApi.OpcuaApi
    scenario: {
        manager: ScenarioApi.ScenarioManagerApi
        library: ScenarioApi.LibraryApi
    }
    modelDriver: {
        modelRunApi: ModelDriverApi.ModelRunApi
    }
    organization: OrganizationManangerApi
    global_result_service: {
        network: NetworkApi
    }
}

export class ApiHelperExtend extends ApiHelper {
    api: IApi

    constructor() {
        super()
        this.axiosInstance.defaults.headers.common.showErrMsg = true // 默认每个请求出错的时候都有错误提示信息，如果不需要错误提示信息，可以在相关的请求中自行设置showErrMsg为false
        // this.axiosInstance.defaults.headers.common['Accept-Language'] = getHttpLang() // 接口请求语言
        this.axiosInstance.interceptors.response.use(
            async (response) => {
                // Any status code that lie within the range of 2xx cause this function to trigger
                // Do something with response data
                const { status, data, message } = response.data
                if (isBoolean(status)) {
                    if (status) {
                        if (data === undefined) {
                            response.data = status
                        } else {
                            response.data = data
                        }
                        return response
                    } else {
                        const { headers } = response.config
                        const { showErrMsg } = headers ?? {}
                        console.log('showErrMsg:', showErrMsg)
                        if (showErrMsg as boolean) {
                            useErrorMessage(message)
                        } else {
                            console.error(
                                '需要自行处理错误信息 Request Error :>> ',
                                response,
                                message,
                            )
                        }
                        return await Promise.reject(response.data)
                    }
                } else {
                    return response
                }
            },
            (error) => {
                console.error('RequestError :>> ', error)
                const { code } = error.response?.data
                if (error.response?.status === 403 || code === 'gateway_forbidden_authorization') {
                    console.log('403 error :>> ', error.response)
                    const userStore = useUserStore()
                    userStore.forbiddenAuthLogout().catch((e) => {
                        console.error('403 log out error :>> ', e)
                    })
                } else {
                    if (error.response !== undefined) {
                        const { message } = error.response.data as any
                        if (isString(message)) {
                            useErrorMessage(message)
                        } else {
                            useErrorMessage(error.message)
                        }
                    } else {
                        useErrorMessage(error.message)
                    }
                }
            },
        )
        this.api = {
            changeTenantId(tenantId: string) {
                console.log('changeTenantId', tenantId)
                this.changeTenantId(tenantId)
            },
            setAuth(token: IToken) {
                console.log('setAuth', token)
                this.setAuth(token)
            },

            iot_data: new IotApi.DataApi(iotBaseUrl, this.axiosInstance),
            iot_ts: new IotApi.TelemetryApi(iotBaseUrl, this.axiosInstance),
            iot_opc: new IotApi.OpcuaApi(iotBaseUrl, this.axiosInstance),
            scenario: {
                manager: new ScenarioApi.ScenarioManagerApi(scenarioBaseUrl, this.axiosInstance),
                library: new ScenarioApi.LibraryApi(scenarioBaseUrl, this.axiosInstance),
            },
            modelDriver: {
                modelRunApi: new ModelDriverApi.ModelRunApi(modelDriverBaseUrl, this.axiosInstance),
            },
            organization: new OrganizationManangerApi(organizationUrl, this.axiosInstance),
            global_result_service: {
                network: new NetworkApi(globalResultServiceBaseUrl, this.axiosInstance),
            },
        }
    }

    changeTenantId = (tenantId: string): void => {
        this.axiosInstance.defaults.headers.common.tenantId = tenantId
        // new ApiHelper().changeTenantId(tenantId)
    }

    setAuth(token: { token_type: string; access_token: string }): void {
        this.axiosInstance.defaults.headers.common.Authorization = `${token.token_type} ${token.access_token}`
        this.axiosInstance.defaults.headers.Authorization = `${token.token_type} ${token.access_token}`
        // new ApiHelper().setAuth(token)
    }

    userInfo = async () => {
        return await this.axiosInstance.post<IUser>(connectBaseUrl).then((r) => r.data)
    }

    clearHeader = (): void => {
        // 清除headers.common中的tenantId和Authorization
        delete this.axiosInstance.defaults.headers.common.tenantId
        delete this.axiosInstance.defaults.headers.common.Authorization
    }
}

export const apiHelper = new ApiHelperExtend()

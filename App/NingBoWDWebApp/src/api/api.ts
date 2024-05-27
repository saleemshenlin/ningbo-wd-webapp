import * as ScenarioApi from '@dhicn/domain-paas-sdk-ts/scenario-service'
import * as IotApi from '@dhicn/domain-paas-sdk-ts/iot-service'
import * as ModelDriverApi from '@dhicn/domain-paas-sdk-ts/model-driver-service'
import { OrganizationManangerApi } from '@dhicn/domain-paas-sdk-ts/identity-service'
import { IToken, IUser } from 'dhi-dss-mf-login'
import { isBoolean, isString } from 'lodash'
import { UseMessage } from 'dhi-dss-mf-layout'
import { ApiHelper } from '@dhicn/domain-paas-sdk-ts/sdk-helper'
import { M2DApi, UrbanWdResultAnalysisApi } from '@dhicn/domain-paas-sdk-ts/result-service'
import { LegendApi } from '@dhicn/domain-paas-sdk-ts/model-configuration'
import {
    GISApi,
    OnlineApi,
    AlarmLogApi,
    AlarmConfigApi,
    IndicatorConfigApi,
} from '@dhicn/domain-paas-sdk-ts/wd-domain'
import { GisQueryApi } from '@dhicn/domain-paas-sdk-ts/gis-service'

const { useErrorMessage } = UseMessage

export const API = 'API'

export const baseUrl = '/ningbo-wd'
export const organizationUrl = `${baseUrl}/user-manager`
export const connectBaseUrl = `${baseUrl}/user-manager/connect/userinfo` // 获得用户信息
export const iotBaseUrl = `${baseUrl}/iot-service`
export const domainWDBaseUrl = `${baseUrl}/wd-domain-service`
export const scenarioBaseUrl = `${baseUrl}/global-scenario-manager-service`
export const modelDriverBaseUrl = `${baseUrl}/global-model-driver-service`
export const globalResultServiceBaseUrl = `${baseUrl}/global-result-service`
export const globalModelConfigurationServiceBaseUrl = `${baseUrl}/global-model-configuration-service`
export const gisServiceUrl = `${baseUrl}/gis-service`

export interface IApi {
    setAuth: (token: IToken) => void
    changeTenantId: (tenantId: string) => void
    gis: GisQueryApi
    iot: {
        data: IotApi.DataApi
        ts: IotApi.TelemetryApi
        opc: IotApi.OpcuaApi
    }
    wd: {
        gis: GISApi
        online: OnlineApi
        alarmLog: AlarmLogApi
        alarmConfig: AlarmConfigApi
        indicatorConfig: IndicatorConfigApi
    }
    scenario: {
        manager: ScenarioApi.ScenarioManagerApi
        library: ScenarioApi.LibraryApi
    }
    modelDriver: {
        modelRunApi: ModelDriverApi.ModelRunApi
    }
    organization: OrganizationManangerApi
    global_result_service: {
        wd: UrbanWdResultAnalysisApi
        mesh2D: M2DApi
    }
    global_model_configuration_service: {
        legend: LegendApi
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
                        logger.debug('showErrMsg:', showErrMsg)
                        if (showErrMsg as boolean) {
                            if (isString(message)) {
                                useErrorMessage(message)
                            } else {
                                const msg = data.join(',')
                                useErrorMessage(msg)
                            }
                        } else {
                            logger.error(
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
                logger.error('RequestError :>> ', error)
                const { code } = error.response?.data
                if (error.response?.status === 403 || code === 'gateway_forbidden_authorization') {
                    logger.debug('403 error :>> ', error.response)
                    // TODO:这里需要加入判断
                    // const userStore = useUserStore()
                    // userStore.forbiddenAuthLogout().catch((e) => {
                    //     logger.error('403 log out error :>> ', e)
                    // })
                } else {
                    if (error.response !== undefined) {
                        const { message } = error.response.data
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
            gis: new GisQueryApi(gisServiceUrl, this.axiosInstance),
            iot: {
                data: new IotApi.DataApi(iotBaseUrl, this.axiosInstance),
                ts: new IotApi.TelemetryApi(iotBaseUrl, this.axiosInstance),
                opc: new IotApi.OpcuaApi(iotBaseUrl, this.axiosInstance),
            },
            wd: {
                gis: new GISApi(domainWDBaseUrl, this.axiosInstance),
                online: new OnlineApi(domainWDBaseUrl, this.axiosInstance),
                alarmLog: new AlarmLogApi(domainWDBaseUrl, this.axiosInstance),
                alarmConfig: new AlarmConfigApi(domainWDBaseUrl, this.axiosInstance),
                indicatorConfig: new IndicatorConfigApi(domainWDBaseUrl, this.axiosInstance),
            },
            scenario: {
                manager: new ScenarioApi.ScenarioManagerApi(scenarioBaseUrl, this.axiosInstance),
                library: new ScenarioApi.LibraryApi(scenarioBaseUrl, this.axiosInstance),
            },
            modelDriver: {
                modelRunApi: new ModelDriverApi.ModelRunApi(modelDriverBaseUrl, this.axiosInstance),
            },
            organization: new OrganizationManangerApi(organizationUrl, this.axiosInstance),
            global_result_service: {
                wd: new UrbanWdResultAnalysisApi(globalResultServiceBaseUrl, this.axiosInstance),
                mesh2D: new M2DApi(globalResultServiceBaseUrl, this.axiosInstance),
            },
            global_model_configuration_service: {
                legend: new LegendApi(globalModelConfigurationServiceBaseUrl, this.axiosInstance),
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

/* eslint-disable */
/**
 * 台州供水项目
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import {
    globalAxios,
    AxiosPromise,
    AxiosInstance,
    AxiosRequestConfig,
    URL,
    Configuration,
    DUMMY_BASE_URL,
    setSearchParams,
    serializeDataIfNeeded,
    toPathString,
    createRequestFunction,
    BASE_PATH,
    RequestArgs,
    BaseAPI,
} from '@dhicn/domain-paas-sdk-ts/sdk-helper'
// @ts-ignore
import { AllocationEditDto } from '../models'
// @ts-ignore
import { ComputeExpertInput } from '../models'
// @ts-ignore
import { ComputeInput } from '../models'
// @ts-ignore
import { ComputeOutput } from '../models'
// @ts-ignore
import { FenQiFlowInfo } from '../models'
// @ts-ignore
import { GetFenQiFlowByEditInput } from '../models'
// @ts-ignore
import { GroupFlowInfo } from '../models'
// @ts-ignore
import { RemoteServiceErrorResponse } from '../models'
// @ts-ignore
import { TankOpenOrCloseEditDto } from '../models'
/**
 * TzAllocationApi - axios parameter creator
 * @export
 */
export const TzAllocationApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         *
         * @summary 获取指定方案保存的调配编辑数据，方案可以是专家库中的方案，也可以是调度预案
         * @param {string} [scenarioId]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiV1TzWdFlowScheduleGetAllocationEditByScenarioIdGet: async (
            scenarioId?: string,
            options: AxiosRequestConfig = {},
        ): Promise<RequestArgs> => {
            const localVarPath = `/api/v1/tz_wd/flow-schedule/get-allocation-edit-by-scenarioId`
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL)
            let baseOptions
            if (configuration) {
                baseOptions = configuration.baseOptions
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options }
            const localVarHeaderParameter = {} as any
            const localVarQueryParameter = {} as any

            if (scenarioId !== undefined) {
                localVarQueryParameter['scenarioId'] = scenarioId
            }

            setSearchParams(localVarUrlObj, localVarQueryParameter)
            let headersFromBaseOptions =
                baseOptions && baseOptions.headers ? baseOptions.headers : {}
            localVarRequestOptions.headers = {
                ...localVarHeaderParameter,
                ...headersFromBaseOptions,
                ...options.headers,
            }

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            }
        },
        /**
         *
         * @summary 获取当前补充水量
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiV1TzWdFlowScheduleGetCurrentSupplyFlowGet: async (
            options: AxiosRequestConfig = {},
        ): Promise<RequestArgs> => {
            const localVarPath = `/api/v1/tz_wd/flow-schedule/get-current-supply-flow`
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL)
            let baseOptions
            if (configuration) {
                baseOptions = configuration.baseOptions
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options }
            const localVarHeaderParameter = {} as any
            const localVarQueryParameter = {} as any

            setSearchParams(localVarUrlObj, localVarQueryParameter)
            let headersFromBaseOptions =
                baseOptions && baseOptions.headers ? baseOptions.headers : {}
            localVarRequestOptions.headers = {
                ...localVarHeaderParameter,
                ...headersFromBaseOptions,
                ...options.headers,
            }

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            }
        },
        /**
         *
         * @summary 根据编辑的片区水量获取分期水量数据，以验证编辑的数据是否合理
         * @param {GetFenQiFlowByEditInput} [getFenQiFlowByEditInput]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiV1TzWdFlowScheduleGetFenqiFlowByEditPost: async (
            getFenQiFlowByEditInput?: GetFenQiFlowByEditInput,
            options: AxiosRequestConfig = {},
        ): Promise<RequestArgs> => {
            const localVarPath = `/api/v1/tz_wd/flow-schedule/get-fenqi-flow-by-edit`
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL)
            let baseOptions
            if (configuration) {
                baseOptions = configuration.baseOptions
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options }
            const localVarHeaderParameter = {} as any
            const localVarQueryParameter = {} as any

            localVarHeaderParameter['Content-Type'] = 'application/json'

            setSearchParams(localVarUrlObj, localVarQueryParameter)
            let headersFromBaseOptions =
                baseOptions && baseOptions.headers ? baseOptions.headers : {}
            localVarRequestOptions.headers = {
                ...localVarHeaderParameter,
                ...headersFromBaseOptions,
                ...options.headers,
            }
            localVarRequestOptions.data = serializeDataIfNeeded(
                getFenQiFlowByEditInput,
                localVarRequestOptions,
                configuration,
            )

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            }
        },
        /**
         *
         * @summary 获取指定方案保存的片区分组调配流量，用于从指定专家库获取调配流量
         * @param {string} [scenarioId]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiV1TzWdFlowScheduleGetGroupFlowByScenarioIdGet: async (
            scenarioId?: string,
            options: AxiosRequestConfig = {},
        ): Promise<RequestArgs> => {
            const localVarPath = `/api/v1/tz_wd/flow-schedule/get-group-flow-by-scenarioId`
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL)
            let baseOptions
            if (configuration) {
                baseOptions = configuration.baseOptions
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options }
            const localVarHeaderParameter = {} as any
            const localVarQueryParameter = {} as any

            if (scenarioId !== undefined) {
                localVarQueryParameter['scenarioId'] = scenarioId
            }

            setSearchParams(localVarUrlObj, localVarQueryParameter)
            let headersFromBaseOptions =
                baseOptions && baseOptions.headers ? baseOptions.headers : {}
            localVarRequestOptions.headers = {
                ...localVarHeaderParameter,
                ...headersFromBaseOptions,
                ...options.headers,
            }

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            }
        },
        /**
         *
         * @summary 获取指定时间段的片区分组默认调配流量，用于从指定scada时间段获取调配流量
         * @param {string} [groupName]
         * @param {string} [startTime]
         * @param {string} [endTime]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiV1TzWdFlowScheduleGetGroupFlowByTimeGet: async (
            groupName?: string,
            startTime?: string,
            endTime?: string,
            options: AxiosRequestConfig = {},
        ): Promise<RequestArgs> => {
            const localVarPath = `/api/v1/tz_wd/flow-schedule/get-group-flow-by-time`
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL)
            let baseOptions
            if (configuration) {
                baseOptions = configuration.baseOptions
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options }
            const localVarHeaderParameter = {} as any
            const localVarQueryParameter = {} as any

            if (groupName !== undefined) {
                localVarQueryParameter['groupName'] = groupName
            }

            if (startTime !== undefined) {
                localVarQueryParameter['startTime'] = startTime
            }

            if (endTime !== undefined) {
                localVarQueryParameter['endTime'] = endTime
            }

            setSearchParams(localVarUrlObj, localVarQueryParameter)
            let headersFromBaseOptions =
                baseOptions && baseOptions.headers ? baseOptions.headers : {}
            localVarRequestOptions.headers = {
                ...localVarHeaderParameter,
                ...headersFromBaseOptions,
                ...options.headers,
            }

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            }
        },
        /**
         *
         * @summary 获取实时片区分组默认调配流量
         * @param {string} [groupName]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiV1TzWdFlowScheduleGetGroupFlowGet: async (
            groupName?: string,
            options: AxiosRequestConfig = {},
        ): Promise<RequestArgs> => {
            const localVarPath = `/api/v1/tz_wd/flow-schedule/get-group-flow`
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL)
            let baseOptions
            if (configuration) {
                baseOptions = configuration.baseOptions
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options }
            const localVarHeaderParameter = {} as any
            const localVarQueryParameter = {} as any

            if (groupName !== undefined) {
                localVarQueryParameter['groupName'] = groupName
            }

            setSearchParams(localVarUrlObj, localVarQueryParameter)
            let headersFromBaseOptions =
                baseOptions && baseOptions.headers ? baseOptions.headers : {}
            localVarRequestOptions.headers = {
                ...localVarHeaderParameter,
                ...headersFromBaseOptions,
                ...options.headers,
            }

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            }
        },
        /**
         *
         * @summary 获取默认的水池编辑数据
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiV1TzWdFlowScheduleGetTankDefaultEditInfoGet: async (
            options: AxiosRequestConfig = {},
        ): Promise<RequestArgs> => {
            const localVarPath = `/api/v1/tz_wd/flow-schedule/get-tank-default-edit-info`
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL)
            let baseOptions
            if (configuration) {
                baseOptions = configuration.baseOptions
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options }
            const localVarHeaderParameter = {} as any
            const localVarQueryParameter = {} as any

            setSearchParams(localVarUrlObj, localVarQueryParameter)
            let headersFromBaseOptions =
                baseOptions && baseOptions.headers ? baseOptions.headers : {}
            localVarRequestOptions.headers = {
                ...localVarHeaderParameter,
                ...headersFromBaseOptions,
                ...options.headers,
            }

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            }
        },
        /**
         *
         * @summary 保存并计算调度预案(基于专家库获取调配水量)
         * @param {ComputeExpertInput} [computeExpertInput]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiV1TzWdFlowScheduleSaveAndComputeByExpertPost: async (
            computeExpertInput?: ComputeExpertInput,
            options: AxiosRequestConfig = {},
        ): Promise<RequestArgs> => {
            const localVarPath = `/api/v1/tz_wd/flow-schedule/save-and-compute-by-expert`
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL)
            let baseOptions
            if (configuration) {
                baseOptions = configuration.baseOptions
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options }
            const localVarHeaderParameter = {} as any
            const localVarQueryParameter = {} as any

            localVarHeaderParameter['Content-Type'] = 'application/json'

            setSearchParams(localVarUrlObj, localVarQueryParameter)
            let headersFromBaseOptions =
                baseOptions && baseOptions.headers ? baseOptions.headers : {}
            localVarRequestOptions.headers = {
                ...localVarHeaderParameter,
                ...headersFromBaseOptions,
                ...options.headers,
            }
            localVarRequestOptions.data = serializeDataIfNeeded(
                computeExpertInput,
                localVarRequestOptions,
                configuration,
            )

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            }
        },
        /**
         *
         * @summary 保存并计算在线水量调配方案
         * @param {AllocationEditDto} [allocationEditDto]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiV1TzWdFlowScheduleSaveAndComputeOnlinePost: async (
            allocationEditDto?: AllocationEditDto,
            options: AxiosRequestConfig = {},
        ): Promise<RequestArgs> => {
            const localVarPath = `/api/v1/tz_wd/flow-schedule/save-and-compute_online`
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL)
            let baseOptions
            if (configuration) {
                baseOptions = configuration.baseOptions
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options }
            const localVarHeaderParameter = {} as any
            const localVarQueryParameter = {} as any

            localVarHeaderParameter['Content-Type'] = 'application/json'

            setSearchParams(localVarUrlObj, localVarQueryParameter)
            let headersFromBaseOptions =
                baseOptions && baseOptions.headers ? baseOptions.headers : {}
            localVarRequestOptions.headers = {
                ...localVarHeaderParameter,
                ...headersFromBaseOptions,
                ...options.headers,
            }
            localVarRequestOptions.data = serializeDataIfNeeded(
                allocationEditDto,
                localVarRequestOptions,
                configuration,
            )

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            }
        },
        /**
         *
         * @summary 保存并计算调度预案
         * @param {ComputeInput} [computeInput]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiV1TzWdFlowScheduleSaveAndComputePost: async (
            computeInput?: ComputeInput,
            options: AxiosRequestConfig = {},
        ): Promise<RequestArgs> => {
            const localVarPath = `/api/v1/tz_wd/flow-schedule/save-and-compute`
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL)
            let baseOptions
            if (configuration) {
                baseOptions = configuration.baseOptions
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options }
            const localVarHeaderParameter = {} as any
            const localVarQueryParameter = {} as any

            localVarHeaderParameter['Content-Type'] = 'application/json'

            setSearchParams(localVarUrlObj, localVarQueryParameter)
            let headersFromBaseOptions =
                baseOptions && baseOptions.headers ? baseOptions.headers : {}
            localVarRequestOptions.headers = {
                ...localVarHeaderParameter,
                ...headersFromBaseOptions,
                ...options.headers,
            }
            localVarRequestOptions.data = serializeDataIfNeeded(
                computeInput,
                localVarRequestOptions,
                configuration,
            )

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            }
        },
    }
}

/**
 * TzAllocationApi - functional programming interface
 * @export
 */
export const TzAllocationApiFp = function (configuration?: Configuration) {
    const localVarAxiosParamCreator = TzAllocationApiAxiosParamCreator(configuration)
    return {
        /**
         *
         * @summary 获取指定方案保存的调配编辑数据，方案可以是专家库中的方案，也可以是调度预案
         * @param {string} [scenarioId]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiV1TzWdFlowScheduleGetAllocationEditByScenarioIdGet(
            scenarioId?: string,
            options?: AxiosRequestConfig,
        ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<AllocationEditDto>> {
            const localVarAxiosArgs =
                await localVarAxiosParamCreator.apiV1TzWdFlowScheduleGetAllocationEditByScenarioIdGet(
                    scenarioId,
                    options,
                )
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)
        },
        /**
         *
         * @summary 获取当前补充水量
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiV1TzWdFlowScheduleGetCurrentSupplyFlowGet(
            options?: AxiosRequestConfig,
        ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<number>> {
            const localVarAxiosArgs =
                await localVarAxiosParamCreator.apiV1TzWdFlowScheduleGetCurrentSupplyFlowGet(
                    options,
                )
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)
        },
        /**
         *
         * @summary 根据编辑的片区水量获取分期水量数据，以验证编辑的数据是否合理
         * @param {GetFenQiFlowByEditInput} [getFenQiFlowByEditInput]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiV1TzWdFlowScheduleGetFenqiFlowByEditPost(
            getFenQiFlowByEditInput?: GetFenQiFlowByEditInput,
            options?: AxiosRequestConfig,
        ): Promise<
            (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<FenQiFlowInfo>>
        > {
            const localVarAxiosArgs =
                await localVarAxiosParamCreator.apiV1TzWdFlowScheduleGetFenqiFlowByEditPost(
                    getFenQiFlowByEditInput,
                    options,
                )
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)
        },
        /**
         *
         * @summary 获取指定方案保存的片区分组调配流量，用于从指定专家库获取调配流量
         * @param {string} [scenarioId]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiV1TzWdFlowScheduleGetGroupFlowByScenarioIdGet(
            scenarioId?: string,
            options?: AxiosRequestConfig,
        ): Promise<
            (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<GroupFlowInfo>>
        > {
            const localVarAxiosArgs =
                await localVarAxiosParamCreator.apiV1TzWdFlowScheduleGetGroupFlowByScenarioIdGet(
                    scenarioId,
                    options,
                )
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)
        },
        /**
         *
         * @summary 获取指定时间段的片区分组默认调配流量，用于从指定scada时间段获取调配流量
         * @param {string} [groupName]
         * @param {string} [startTime]
         * @param {string} [endTime]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiV1TzWdFlowScheduleGetGroupFlowByTimeGet(
            groupName?: string,
            startTime?: string,
            endTime?: string,
            options?: AxiosRequestConfig,
        ): Promise<
            (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<GroupFlowInfo>>
        > {
            const localVarAxiosArgs =
                await localVarAxiosParamCreator.apiV1TzWdFlowScheduleGetGroupFlowByTimeGet(
                    groupName,
                    startTime,
                    endTime,
                    options,
                )
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)
        },
        /**
         *
         * @summary 获取实时片区分组默认调配流量
         * @param {string} [groupName]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiV1TzWdFlowScheduleGetGroupFlowGet(
            groupName?: string,
            options?: AxiosRequestConfig,
        ): Promise<
            (axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<GroupFlowInfo>>
        > {
            const localVarAxiosArgs =
                await localVarAxiosParamCreator.apiV1TzWdFlowScheduleGetGroupFlowGet(
                    groupName,
                    options,
                )
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)
        },
        /**
         *
         * @summary 获取默认的水池编辑数据
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiV1TzWdFlowScheduleGetTankDefaultEditInfoGet(
            options?: AxiosRequestConfig,
        ): Promise<
            (
                axios?: AxiosInstance,
                basePath?: string,
            ) => AxiosPromise<Array<TankOpenOrCloseEditDto>>
        > {
            const localVarAxiosArgs =
                await localVarAxiosParamCreator.apiV1TzWdFlowScheduleGetTankDefaultEditInfoGet(
                    options,
                )
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)
        },
        /**
         *
         * @summary 保存并计算调度预案(基于专家库获取调配水量)
         * @param {ComputeExpertInput} [computeExpertInput]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiV1TzWdFlowScheduleSaveAndComputeByExpertPost(
            computeExpertInput?: ComputeExpertInput,
            options?: AxiosRequestConfig,
        ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ComputeOutput>> {
            const localVarAxiosArgs =
                await localVarAxiosParamCreator.apiV1TzWdFlowScheduleSaveAndComputeByExpertPost(
                    computeExpertInput,
                    options,
                )
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)
        },
        /**
         *
         * @summary 保存并计算在线水量调配方案
         * @param {AllocationEditDto} [allocationEditDto]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiV1TzWdFlowScheduleSaveAndComputeOnlinePost(
            allocationEditDto?: AllocationEditDto,
            options?: AxiosRequestConfig,
        ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ComputeOutput>> {
            const localVarAxiosArgs =
                await localVarAxiosParamCreator.apiV1TzWdFlowScheduleSaveAndComputeOnlinePost(
                    allocationEditDto,
                    options,
                )
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)
        },
        /**
         *
         * @summary 保存并计算调度预案
         * @param {ComputeInput} [computeInput]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async apiV1TzWdFlowScheduleSaveAndComputePost(
            computeInput?: ComputeInput,
            options?: AxiosRequestConfig,
        ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ComputeOutput>> {
            const localVarAxiosArgs =
                await localVarAxiosParamCreator.apiV1TzWdFlowScheduleSaveAndComputePost(
                    computeInput,
                    options,
                )
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)
        },
    }
}

/**
 * TzAllocationApi - factory interface
 * @export
 */
export const TzAllocationApiFactory = function (
    configuration?: Configuration,
    basePath?: string,
    axios?: AxiosInstance,
) {
    const localVarFp = TzAllocationApiFp(configuration)
    return {
        /**
         *
         * @summary 获取指定方案保存的调配编辑数据，方案可以是专家库中的方案，也可以是调度预案
         * @param {string} [scenarioId]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiV1TzWdFlowScheduleGetAllocationEditByScenarioIdGet(
            scenarioId?: string,
            options?: any,
        ): AxiosPromise<AllocationEditDto> {
            return localVarFp
                .apiV1TzWdFlowScheduleGetAllocationEditByScenarioIdGet(scenarioId, options)
                .then((request) => request(axios, basePath))
        },
        /**
         *
         * @summary 获取当前补充水量
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiV1TzWdFlowScheduleGetCurrentSupplyFlowGet(options?: any): AxiosPromise<number> {
            return localVarFp
                .apiV1TzWdFlowScheduleGetCurrentSupplyFlowGet(options)
                .then((request) => request(axios, basePath))
        },
        /**
         *
         * @summary 根据编辑的片区水量获取分期水量数据，以验证编辑的数据是否合理
         * @param {GetFenQiFlowByEditInput} [getFenQiFlowByEditInput]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiV1TzWdFlowScheduleGetFenqiFlowByEditPost(
            getFenQiFlowByEditInput?: GetFenQiFlowByEditInput,
            options?: any,
        ): AxiosPromise<Array<FenQiFlowInfo>> {
            return localVarFp
                .apiV1TzWdFlowScheduleGetFenqiFlowByEditPost(getFenQiFlowByEditInput, options)
                .then((request) => request(axios, basePath))
        },
        /**
         *
         * @summary 获取指定方案保存的片区分组调配流量，用于从指定专家库获取调配流量
         * @param {string} [scenarioId]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiV1TzWdFlowScheduleGetGroupFlowByScenarioIdGet(
            scenarioId?: string,
            options?: any,
        ): AxiosPromise<Array<GroupFlowInfo>> {
            return localVarFp
                .apiV1TzWdFlowScheduleGetGroupFlowByScenarioIdGet(scenarioId, options)
                .then((request) => request(axios, basePath))
        },
        /**
         *
         * @summary 获取指定时间段的片区分组默认调配流量，用于从指定scada时间段获取调配流量
         * @param {string} [groupName]
         * @param {string} [startTime]
         * @param {string} [endTime]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiV1TzWdFlowScheduleGetGroupFlowByTimeGet(
            groupName?: string,
            startTime?: string,
            endTime?: string,
            options?: any,
        ): AxiosPromise<Array<GroupFlowInfo>> {
            return localVarFp
                .apiV1TzWdFlowScheduleGetGroupFlowByTimeGet(groupName, startTime, endTime, options)
                .then((request) => request(axios, basePath))
        },
        /**
         *
         * @summary 获取实时片区分组默认调配流量
         * @param {string} [groupName]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiV1TzWdFlowScheduleGetGroupFlowGet(
            groupName?: string,
            options?: any,
        ): AxiosPromise<Array<GroupFlowInfo>> {
            return localVarFp
                .apiV1TzWdFlowScheduleGetGroupFlowGet(groupName, options)
                .then((request) => request(axios, basePath))
        },
        /**
         *
         * @summary 获取默认的水池编辑数据
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiV1TzWdFlowScheduleGetTankDefaultEditInfoGet(
            options?: any,
        ): AxiosPromise<Array<TankOpenOrCloseEditDto>> {
            return localVarFp
                .apiV1TzWdFlowScheduleGetTankDefaultEditInfoGet(options)
                .then((request) => request(axios, basePath))
        },
        /**
         *
         * @summary 保存并计算调度预案(基于专家库获取调配水量)
         * @param {ComputeExpertInput} [computeExpertInput]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiV1TzWdFlowScheduleSaveAndComputeByExpertPost(
            computeExpertInput?: ComputeExpertInput,
            options?: any,
        ): AxiosPromise<ComputeOutput> {
            return localVarFp
                .apiV1TzWdFlowScheduleSaveAndComputeByExpertPost(computeExpertInput, options)
                .then((request) => request(axios, basePath))
        },
        /**
         *
         * @summary 保存并计算在线水量调配方案
         * @param {AllocationEditDto} [allocationEditDto]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiV1TzWdFlowScheduleSaveAndComputeOnlinePost(
            allocationEditDto?: AllocationEditDto,
            options?: any,
        ): AxiosPromise<ComputeOutput> {
            return localVarFp
                .apiV1TzWdFlowScheduleSaveAndComputeOnlinePost(allocationEditDto, options)
                .then((request) => request(axios, basePath))
        },
        /**
         *
         * @summary 保存并计算调度预案
         * @param {ComputeInput} [computeInput]
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        apiV1TzWdFlowScheduleSaveAndComputePost(
            computeInput?: ComputeInput,
            options?: any,
        ): AxiosPromise<ComputeOutput> {
            return localVarFp
                .apiV1TzWdFlowScheduleSaveAndComputePost(computeInput, options)
                .then((request) => request(axios, basePath))
        },
    }
}

/**
 * TzAllocationApi - object-oriented interface
 * @export
 * @class TzAllocationApi
 * @extends {BaseAPI}
 */
export class TzAllocationApi extends BaseAPI {
    /**
     *
     * @summary 获取指定方案保存的调配编辑数据，方案可以是专家库中的方案，也可以是调度预案
     * @param {string} [scenarioId]
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TzAllocationApi
     */
    public apiV1TzWdFlowScheduleGetAllocationEditByScenarioIdGet(
        scenarioId?: string,
        options?: AxiosRequestConfig,
    ) {
        return TzAllocationApiFp(this.configuration)
            .apiV1TzWdFlowScheduleGetAllocationEditByScenarioIdGet(scenarioId, options)
            .then((request) => request(this.axios, this.basePath))
    }

    /**
     *
     * @summary 获取当前补充水量
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TzAllocationApi
     */
    public apiV1TzWdFlowScheduleGetCurrentSupplyFlowGet(options?: AxiosRequestConfig) {
        return TzAllocationApiFp(this.configuration)
            .apiV1TzWdFlowScheduleGetCurrentSupplyFlowGet(options)
            .then((request) => request(this.axios, this.basePath))
    }

    /**
     *
     * @summary 根据编辑的片区水量获取分期水量数据，以验证编辑的数据是否合理
     * @param {GetFenQiFlowByEditInput} [getFenQiFlowByEditInput]
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TzAllocationApi
     */
    public apiV1TzWdFlowScheduleGetFenqiFlowByEditPost(
        getFenQiFlowByEditInput?: GetFenQiFlowByEditInput,
        options?: AxiosRequestConfig,
    ) {
        return TzAllocationApiFp(this.configuration)
            .apiV1TzWdFlowScheduleGetFenqiFlowByEditPost(getFenQiFlowByEditInput, options)
            .then((request) => request(this.axios, this.basePath))
    }

    /**
     *
     * @summary 获取指定方案保存的片区分组调配流量，用于从指定专家库获取调配流量
     * @param {string} [scenarioId]
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TzAllocationApi
     */
    public apiV1TzWdFlowScheduleGetGroupFlowByScenarioIdGet(
        scenarioId?: string,
        options?: AxiosRequestConfig,
    ) {
        return TzAllocationApiFp(this.configuration)
            .apiV1TzWdFlowScheduleGetGroupFlowByScenarioIdGet(scenarioId, options)
            .then((request) => request(this.axios, this.basePath))
    }

    /**
     *
     * @summary 获取指定时间段的片区分组默认调配流量，用于从指定scada时间段获取调配流量
     * @param {string} [groupName]
     * @param {string} [startTime]
     * @param {string} [endTime]
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TzAllocationApi
     */
    public apiV1TzWdFlowScheduleGetGroupFlowByTimeGet(
        groupName?: string,
        startTime?: string,
        endTime?: string,
        options?: AxiosRequestConfig,
    ) {
        return TzAllocationApiFp(this.configuration)
            .apiV1TzWdFlowScheduleGetGroupFlowByTimeGet(groupName, startTime, endTime, options)
            .then((request) => request(this.axios, this.basePath))
    }

    /**
     *
     * @summary 获取实时片区分组默认调配流量
     * @param {string} [groupName]
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TzAllocationApi
     */
    public apiV1TzWdFlowScheduleGetGroupFlowGet(groupName?: string, options?: AxiosRequestConfig) {
        return TzAllocationApiFp(this.configuration)
            .apiV1TzWdFlowScheduleGetGroupFlowGet(groupName, options)
            .then((request) => request(this.axios, this.basePath))
    }

    /**
     *
     * @summary 获取默认的水池编辑数据
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TzAllocationApi
     */
    public apiV1TzWdFlowScheduleGetTankDefaultEditInfoGet(options?: AxiosRequestConfig) {
        return TzAllocationApiFp(this.configuration)
            .apiV1TzWdFlowScheduleGetTankDefaultEditInfoGet(options)
            .then((request) => request(this.axios, this.basePath))
    }

    /**
     *
     * @summary 保存并计算调度预案(基于专家库获取调配水量)
     * @param {ComputeExpertInput} [computeExpertInput]
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TzAllocationApi
     */
    public apiV1TzWdFlowScheduleSaveAndComputeByExpertPost(
        computeExpertInput?: ComputeExpertInput,
        options?: AxiosRequestConfig,
    ) {
        return TzAllocationApiFp(this.configuration)
            .apiV1TzWdFlowScheduleSaveAndComputeByExpertPost(computeExpertInput, options)
            .then((request) => request(this.axios, this.basePath))
    }

    /**
     *
     * @summary 保存并计算在线水量调配方案
     * @param {AllocationEditDto} [allocationEditDto]
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TzAllocationApi
     */
    public apiV1TzWdFlowScheduleSaveAndComputeOnlinePost(
        allocationEditDto?: AllocationEditDto,
        options?: AxiosRequestConfig,
    ) {
        return TzAllocationApiFp(this.configuration)
            .apiV1TzWdFlowScheduleSaveAndComputeOnlinePost(allocationEditDto, options)
            .then((request) => request(this.axios, this.basePath))
    }

    /**
     *
     * @summary 保存并计算调度预案
     * @param {ComputeInput} [computeInput]
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TzAllocationApi
     */
    public apiV1TzWdFlowScheduleSaveAndComputePost(
        computeInput?: ComputeInput,
        options?: AxiosRequestConfig,
    ) {
        return TzAllocationApiFp(this.configuration)
            .apiV1TzWdFlowScheduleSaveAndComputePost(computeInput, options)
            .then((request) => request(this.axios, this.basePath))
    }
}

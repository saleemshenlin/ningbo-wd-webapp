import {
    ModelEditApi,
    GetBoundaryTsOutput,
    UpdateControlRuleInput,
} from '@dhicn/domain-paas-sdk-ts/model-information'
import { ModelEditApiState } from './type'
import { defineStore } from 'pinia'
import { showError } from '../../helper/showError'
import { GetMultipleBoundariesInput } from '@dhicn/domain-paas-sdk-ts/src/model-information/models/get-multiple-boundaries-input.js'
import { BatchAddOrUpdateBoundaryTsInput } from '@dhicn/domain-paas-sdk-ts/src/model-information/models/batch-add-or-update-boundary-ts-input.js'

const StoreName = 'ModelEditApi'

export const useModelEditApiStore = defineStore(StoreName, {
    state: (): ModelEditApiState => ({}),
    actions: {
        /**
         * 批量查询边界时序数据
         * /api/v1/model-information/boundary/get-multiple-timeseries
         * 应用项目:长治
         * @param $api
         */
        async fetchBoundaryGetMultipleTimeseries(
            $api: ModelEditApi,
            params: GetMultipleBoundariesInput,
        ) {
            try {
                const res = await $api.apiV1ModelInformationBoundaryGetMultipleTimeseriesPost(
                    params,
                )
                return res.data as GetBoundaryTsOutput[]
            } catch (error) {
                showError(StoreName, 'fetchBoundaryGetMultipleTimeseries error', error)
            }
        },
        /**
         * 批量新增或者批量更新方案的边界时间序列数据
         * /api/v1/model-information/boundary/timeseries/batch-add-or-update
         * 应用项目:长治
         * @param $api
         */
        async fetchBoundaryTimeseriesBatchAddOrUpdatePost(
            $api: ModelEditApi,
            params: BatchAddOrUpdateBoundaryTsInput,
        ) {
            try {
                const res = await $api.apiV1ModelInformationBoundaryTimeseriesBatchAddOrUpdatePost(
                    params,
                )
                return res.data
            } catch (error) {
                showError(StoreName, 'fetchBoundaryTimeseriesBatchAddOrUpdatePost error', error)
            }
        },

        /**
         * 获取方案的调度规则数据
         * /api/v1/model-information/control-rule
         * 应用项目:万峰
         * @param $api
         * @param scenarioId
         */
        async fetchControlRule($api: ModelEditApi, scenarioId: string) {
            try {
                const res = await $api.apiV1ModelInformationControlRuleGet(scenarioId)
                return res.data
            } catch (error) {
                showError(StoreName, 'fetchControlRule error', error)
                return {}
            }
        },

        /**
         * 保存调度规则 设置方案的调度规则数据
         * /api/v1/model-information/control-rule/update
         * 应用项目:万峰
         * @param $api
         * @param params ControlRuleInfo
         */
        async saveSetControlRuleUpdate($api: ModelEditApi, params: UpdateControlRuleInput) {
            try {
                const res = await $api.apiV1ModelInformationControlRuleUpdatePost(params)
                return res.data ?? false
            } catch (error) {
                showError(StoreName, 'saveSetControlRuleUpdate error', error)
                return false
            }
        },
    },
})

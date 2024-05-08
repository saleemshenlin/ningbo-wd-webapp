import { defineStore } from 'pinia'
import { AerationControlState } from './type'
import { showError } from '@/helper/showError'
import * as WwtpApi from '@dhicn/domain-paas-sdk-ts/wwtp-domain'

export const useAerationControlStore = defineStore('wwtp-aeration-control', {
    state: (): AerationControlState => ({}),
    actions: {
        /**
         * /api/v2/aeration-control/statistic
         * 曝气统计信息查询
         * @param $api
         * @param start
         * @param end
         */
        async getAerationStatistics($api: WwtpApi.AerationControlApi, start: string, end: string) {
            try {
                const res = await $api.apiV2AerationControlStatisticGet(start, end)
                return res.data ?? []
            } catch (error) {
                showError('API', 'getAerationStatistics', error)
                return []
            }
        },

        /**
         * /api/v2/aeration-control/history
         * 曝气记录信息查询
         * @param $api
         * @param start
         * @param end
         */
        async getAerationHistory($api: WwtpApi.AerationControlApi, start: string, end: string) {
            try {
                const res = await $api.apiV2AerationControlHistoryGet(start, end)
                return res.data ?? []
            } catch (error) {
                showError('API', 'getAerationHistory', error)
                return []
            }
        },

        /**
         * /api/v2/aeration-control/export-excel
         * 将指定时间段内的曝气统计与曝气记录数据统一导出到一个excel文件中
         * @param $api
         * @param start
         * @param end
         */
        async exportExcel($api: WwtpApi.AerationControlApi, start: string, end: string) {
            try {
                const res = await $api.apiV2AerationControlExportExcelGet(start, end)
                return res.data ?? ''
            } catch (error) {
                showError('API', 'exportExcel', error)
                return ''
            }
        },

        /**
         * /api/v2/aeration-control/set-control-frequency
         * 更新时间频率
         * @param $api
         * @param frequency
         */
        async setControlFrequency($api: WwtpApi.AerationControlApi, frequency: number) {
            try {
                const res = await $api.apiV2AerationControlSetControlFrequencyPost(frequency)
                return res.data ?? false
            } catch (error) {
                showError('API', 'setControlFrequency', error)
                return false
            }
        },

        /**
         * /api/v2/aeration-control/control-status
         * 获取曝气控制的当前状态信息
         * @param $api
         * @param productLine
         */
        async getControlStatus($api: WwtpApi.AerationControlApi, productLine: string) {
            try {
                const res = await $api.apiV2AerationControlControlStatusGet(productLine)
                return res.data ?? []
            } catch (error) {
                showError('API', 'getControlStatus', error)
                return []
            }
        },

        /**
         * /api/v2/aeration-control/time-series
         * 获取控制相关的时间序列
         * @param $api
         * @param startTime
         * @param endTime
         * @param productLine
         */
        async getTimeSeries(
            $api: WwtpApi.AerationControlApi,
            param: WwtpApi.GetTimeSeriesDataInput,
        ) {
            try {
                const res = await $api.apiV2AerationControlTimeSeriesPost(param)
                return res.data ?? []
            } catch (error) {
                showError('API', 'getTimeSeries', error)
                return []
            }
        },
    },
})

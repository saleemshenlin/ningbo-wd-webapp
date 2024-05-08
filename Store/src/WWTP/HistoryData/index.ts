import { showError, logger } from '../../helper/showError'
import * as WwtpApi from '@dhicn/domain-paas-sdk-ts/wwtp-domain'
import { defineStore } from 'pinia'
import { HistoryDataState, QuerySelectInput } from './type'

export const useHistoryDataState = defineStore('wwtp-history-data', {
    state: (): HistoryDataState => ({
        onlineSelectItemNode: [],
        simSelectItemNode: [],
        selectNewItemNode: [], // 可选择项-new
    }),
    actions: {
        /**
         * 获取历史数据可选择项-new
         * @param $api
         * @param modelName
         */
        async queryNewSelectItems($api: WwtpApi.HistoryDataApi, modelName: string) {
            try {
                const res = await $api.apiV2HistoryDataSelectItemsGet(modelName)
                this.selectNewItemNode = res.data ?? []
                logger.debug('queryNewSelectItems>>>', this.selectNewItemNode)
            } catch (error) {
                showError('API', 'querySelectItems', error)
                return []
            }
        },
        /**
         * 获取指标查询的可选择项的具体信息
         * @param $api
         * @param data
         * @returns
         */
        async querySelectItems($api: WwtpApi.HistoryDataApi, data: QuerySelectInput) {
            const { modelName, isInputPoint } = data
            try {
                const res = await $api.apiV2HistoryDataSelectItemsGet(modelName)
                return res.data ?? []
            } catch (error) {
                showError('API', 'querySelectItems', error)
                return []
            }
        },
        /**
         * 获取在线/模拟数据可选择项
         * @param $api
         * @param modelName
         */
        getSelectItemNode($api: WwtpApi.HistoryDataApi, modelName: string) {
            const requestList = [
                this.querySelectItems($api, { modelName, isInputPoint: 'true' }),
                this.querySelectItems($api, { modelName, isInputPoint: 'false' }),
            ]
            Promise.all(requestList)
                .then((res) => {
                    logger.debug('getSelectItemNode res>>>', res)
                    // this.onlineSelectItemNode = res?.[0] ?? []
                    // this.simSelectItemNode = res?.[1] ?? []
                })
                .catch((error) => {
                    showError('API', 'getSelectItemNode', error)
                })
        },
        /**
         * 历史数据查询
         * @param $api
         * @param data
         */
        async queryHistoryData($api: WwtpApi.HistoryDataApi, data: WwtpApi.QueryByConditionInput) {
            try {
                const res = await $api.apiV2HistoryDataGetByConditionPost(data)
                return res.data ?? []
            } catch (error) {
                showError('API', 'queryHistoryData', error)
                return []
            }
        },
        /**
         * 历史数导出
         * @param $api
         * @param data
         */
        async exportHistoryData($api: WwtpApi.HistoryDataApi, data: WwtpApi.QueryByConditionInput) {
            try {
                return await $api.apiV2HistoryDataExportPost(data, {
                    responseType: 'blob',
                })
            } catch (error) {
                showError('API', 'exportHistoryData', error)
            }
        },
    },
}) as any

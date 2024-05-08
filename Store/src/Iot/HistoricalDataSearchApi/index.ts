import { defineStore } from 'pinia'
import { HistoricalDataSearchApiState } from './type'
import { showError } from '../../helper/showError'
import type {
    HistoricalDataSearchApi,
    HisDataSearchInput,
    SaveHistorySearchRecordInput,
} from '@dhicn/domain-paas-sdk-ts/iot-service'
const StoreName = 'HistoricalDataSearchApi'
export const useHistoricalDataSearchApiStore = defineStore(StoreName, {
    state: (): HistoricalDataSearchApiState => ({
        conditions: [],
        records: [],
    }),
    actions: {
        /**
         * 查询历史数据 / historical data query
         * /api/v1/historical-data/search
         * 应用于:竹园 长治项目
         */
        async searchHistoryTSData(
            $api: HistoricalDataSearchApi,
            searchParams: Array<HisDataSearchInput>,
        ) {
            try {
                const res = await $api.apiV1HistoricalDataSearchPost(searchParams)
                return (
                    res.data ?? {
                        indicators: [],
                        modelTsData: [],
                        measureTsData: [],
                    }
                )
            } catch (error) {
                showError(StoreName, 'searchHistoryTSData error', error)
                return {
                    indicators: [],
                    modelTsData: [],
                    measureTsData: [],
                }
            }
        },
        /**
         * 获取历史数据搜索条件
         * /api/v1/historical-data/search/conditions
         * 应用于:竹园
         * version:2.3.8 增加可选参数. scene 为空 适用于 配水实时模拟预测 , scene 不为空 适用于 预案管理-查看详情
         */
        async fetchSearchCondition($api: HistoricalDataSearchApi, scene: string = '') {
            try {
                const res = await $api.apiV1HistoricalDataSearchConditionsGet(scene)
                this.conditions = res.data ?? []
                return this.conditions
            } catch (error) {
                showError(StoreName, 'fetchSearchCondition error', error)
                return []
            }
        },
        /**
         * 获取历史数据搜索记录
         * /api/v1/historical-data/search/records
         * 应用于:竹园
         * version:2.3.8 增加可选参数. scene 为空 适用于 配水实时模拟预测 , scene 不为空 适用于 预案管理-查看详情
         */
        async fetchSearchRecord($api: HistoricalDataSearchApi, scene: string = '') {
            try {
                const res = await $api.apiV1HistoricalDataSearchRecordsGet(scene)
                this.records = res.data ?? []
                return this.records
            } catch (error) {
                showError(StoreName, 'fetchSearchRecord error', error)
                return []
            }
        },
        /**
         * 保存数据搜索记录
         * /api/v1/historical-data/search/records/save
         * 应用于:竹园
         */
        async saveSearchRecord(
            $api: HistoricalDataSearchApi,
            saveParams: SaveHistorySearchRecordInput[],
            scene: string = '',
        ) {
            try {
                await $api.apiV1HistoricalDataSearchRecordsSavePost(saveParams)
                this.fetchSearchRecord($api, scene)
                return true
            } catch (error) {
                showError(StoreName, 'saveSearchRecord error', error)
                return false
            }
        },
        /**
         * 删除数据搜索记录
         * /api/v1/historical-data/search/records/save
         * 应用于:竹园
         */ async deleteSearchRecord(
            $api: HistoricalDataSearchApi,
            nameList: string[],
            scene: string = '',
        ) {
            try {
                await $api.apiV1HistoricalDataSearchRecordsDeletePost(nameList)
                this.fetchSearchRecord($api, scene)
                return true
            } catch (error) {
                showError(StoreName, 'saveSearchRecord error', error)
                return false
            }
        },
        /**
         * 另存历史数据搜索记录
         * /api/v1/historical-data/search/records/save-as
         * 应用于:竹园
         */
        async saveAsSearchRecord(
            $api: HistoricalDataSearchApi,
            saveParams: SaveHistorySearchRecordInput[],
            scene: string = '',
        ) {
            try {
                await $api.apiV1HistoricalDataSearchRecordsSaveAsPost(saveParams)
                this.fetchSearchRecord($api, scene)
                return true
            } catch (error) {
                showError(StoreName, 'saveAsSearchRecord error', error)
                return false
            }
        },
    },
})

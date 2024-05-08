import { LegendApi } from '@dhicn/domain-paas-sdk-ts/model-configuration'
import { LegendApiState } from './type'
import { defineStore } from 'pinia'
import { showError, logger } from '../../helper/showError'
import { ResultItemIndex } from '../config'

const StoreName = 'LegendApi'

export const useLegendApiStore = defineStore(StoreName, {
    state: (): LegendApiState => ({
        resultItem: [],
        classifyLegendList: [],
        resultItemMap: new Map(),
        legendMap: new Map(),
    }),
    actions: {
        /**
         * 获得結果列表 ResultItem
         * @param $api
         */
        async fetchResultItemList($api: LegendApi) {
            try {
                const res = await $api.apiV1ModelConfigurationLegendAllLegendGet()
                this.resultItem = res.data.sort((a, b) => {
                    return (
                        ResultItemIndex[a.typeName as string] -
                        ResultItemIndex[b.typeName as string]
                    )
                })
                res.data.forEach((item) => {
                    if (item.modelType && item.typeName) {
                        this.resultItemMap.set(`${item.modelType}_${item.typeName}`, item)
                    }
                })
                logger.debug('fetchResultItemList :>> ', this.resultItem)
            } catch (error) {
                showError(StoreName, 'fetchResultItemList error', error)
            }
        },
        /**
         * 查询某个图例项的等级数据
         * @param $api
         * @param modelType
         * @param dataType 'Pressure'
         */
        async fetchClassifyLegendData($api: LegendApi, modelType: string, dataType: string) {
            try {
                const key = `${modelType}_${dataType}`
                if (this.legendMap.has(key)) {
                    this.classifyLegendList = this.legendMap.get(key)!
                } else {
                    const res = await $api.apiV1ModelConfigurationLegendClassifyLegendGet(
                        modelType,
                        dataType,
                    )
                    this.classifyLegendList = res.data
                    this.legendMap.set(key, res.data)
                    // logger.debug('fetchTimeSeriesData :>> ', res.data)
                }
                return this.classifyLegendList
            } catch (error) {
                showError(StoreName, 'fetchClassifyLegendData error', error)
            }
        },
    },
})

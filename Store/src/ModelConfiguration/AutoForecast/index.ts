import { defineStore } from 'pinia'
import { showError } from '../../helper/showError'
import { ForecastApiState } from './type'
import { AutoForecastApi } from '@dhicn/domain-paas-sdk-ts/model-configuration'
const StoreName = 'AutoForecast'

export const useAutoForecastStore = defineStore(StoreName, {
    state: (): ForecastApiState => ({
        autoForecast: [],
    }),
    actions: {
        /**
         * 获取所有的滚动预报配置
         * /api/v1/model-configuration/autoforecast/list
         * @param $api
         */
        async fetchAutoForecast($api: AutoForecastApi) {
            try {
                const res = await $api.apiV1ModelConfigurationAutoforecastListGet()
                this.autoForecast = res.data ?? []
                return this.autoForecast
            } catch (error) {
                showError(StoreName, 'fetchAutoForecast', error)
                return []
            }
        },
        /**
         * 更新预报配置
         * /api/v1/model-configuration/autoforecast/update-config
         * @param $api
         */
        async updateAutoForecast($api: AutoForecastApi, data: any) {
            try {
                const res = await $api.apiV1ModelConfigurationAutoforecastUpdateConfigPost(data)
                return res.data ?? false
            } catch (error) {
                showError(StoreName, 'updateAutoForecast', error)
                return false
            }
        },
    },
})

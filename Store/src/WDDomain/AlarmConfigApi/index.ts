import {
    AlarmConfigApi,
    AlarmConfigDto,
    AddAlarmConfigInput,
    SaveAlarmConfigByTypeInput,
    AddListAlarmConfigInput,
} from '@dhicn/domain-paas-sdk-ts/wd-domain'
import { AlarmConfigApiState } from './type'
import { defineStore } from 'pinia'
import { showError } from '../../helper/showError'
const StoreName = 'AlarmConfigApi'

export const useAlarmConfigApiStore = defineStore(StoreName, {
    state: (): AlarmConfigApiState => ({
        alarmThresholdList: [],
    }),
    actions: {
        /**
         * 获取所有报警阈值
         * /api/v1/domain-wd/config/alarm/all
         * @param $api
         * @param GetOnlineModelDataPara
         */
        async fetchAllAlarmThresholdList($api: AlarmConfigApi) {
            try {
                const rep = await $api.apiV1DomainWdConfigAlarmAllGet()
                this.alarmThresholdList = rep.data
            } catch (error) {
                showError(StoreName, 'fetchAllAlarmThresholdList error', error)
            }
        },
        /**
         * 批量更新所有报警阈值
         * /api/v1/domain-wd/config/alarm/update
         * @param $api
         * @param GetOnlineModelDataPara
         */
        async updateAlarmThresholdList(
            $api: AlarmConfigApi,
            list: AlarmConfigDto[],
        ): Promise<boolean> {
            try {
                const rep = await $api.apiV1DomainWdConfigAlarmUpdatePost(list)
                return rep.data as any
            } catch (error) {
                showError(StoreName, 'updateAlarmThresholdList error', error)
                return false
            }
        },

        /**
         * 新增报警配置
         * /api/v1/domain-wd/config/alarm/add
         * 应用于:台州项目:系统设置-报警配置
         */
        async addAlarmConfig($api: AlarmConfigApi, params: AddAlarmConfigInput[]) {
            try {
                const res = await $api.apiV1DomainWdConfigAlarmAddPost(params)
                return res.data as unknown as boolean
            } catch (error) {
                showError('API', 'addAlarmConfig', error)
                return false
            }
        },

        /**
         * 保存设备名称报警配置,根据设备名和指标判断是新增还是更新
         * /api/v1/domain-wd/config/alarm/save
         * 应用于:台州项目:系统设置-报警配置
         */
        async saveAlarmConfig($api: AlarmConfigApi, params: AddAlarmConfigInput[]) {
            try {
                const res = await $api.apiV1DomainWdConfigAlarmSavePost(params)
                return res.data as unknown as boolean
            } catch (error) {
                showError('API', 'saveAlarmConfig', error)
                return false
            }
        },

        /**
         * 删除报警配置
         * /api/v1/domain-wd/config/alarm/delete
         * 应用于:台州项目:系统设置-报警配置
         */
        async deleteAlarmConfig($api: AlarmConfigApi, params: string[]) {
            try {
                const res = await $api.apiV1DomainWdConfigAlarmDeletePost({ ids: params })
                return res.data as unknown as boolean
            } catch (error) {
                showError('API', 'deleteAlarmConfig', error)
                return false
            }
        },

        /**
         * 根据类型获取报警配置
         * /api/v1/domain-wd/config/alarm/get-by-type
         * 应用于:台州项目:系统设置-报警配置
         */
        async getAlarmConfigByType($api: AlarmConfigApi, params: number) {
            try {
                const res = await $api.apiV1DomainWdConfigAlarmGetByTypeGet(params)
                return res.data
            } catch (error) {
                showError('API', 'getAlarmConfigByType', error)
                return []
            }
        },

        /**
         * 按照类型保存报警配置
         * /api/v1/domain-wd/config/alarm/save-by-type
         * 应用于:台州项目:系统设置-报警配置
         */
        async saveAlarmConfigByType($api: AlarmConfigApi, params: SaveAlarmConfigByTypeInput[]) {
            try {
                const res = await $api.apiV1DomainWdConfigAlarmSaveByTypePost(params)
                return res.data as unknown as boolean
            } catch (error) {
                showError('API', 'saveAlarmConfigByType', error)
                return false
            }
        },

        /**
         * 根据报警类型批量新增报警配置
         * /api/v1/domain-wd/config/alarm/list-add
         * 应用于:台州项目:系统设置-报警配置
         */
        async addListAlarmConfig($api: AlarmConfigApi, params: AddListAlarmConfigInput[]) {
            try {
                const res = await $api.apiV1DomainWdConfigAlarmListAddPost(params)
                return res.data as unknown as boolean
            } catch (error) {
                showError('API', 'addListAlarmConfig', error)
                return false
            }
        },
    },
})

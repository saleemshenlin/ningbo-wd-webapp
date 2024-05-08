import { defineStore } from 'pinia'
import { showError, logger } from '../../helper/showError'
import {
    MaintenanceApi,
    RepairEventFilterSearchInput,
    AddRepairEventDto,
    RepairEventDto,
} from '@dhicn/domain-paas-sdk-ts/wd-domain'
import { MaintenanceApiState } from './type'
import dayjs from 'dayjs'
import { isEmpty, isNull } from 'lodash'
const StoreName = 'MaintenanceApi'
export const useMaintenanceApiStore = defineStore(StoreName, {
    state: (): MaintenanceApiState => ({
        repairPipeList: [], //  管道列表
        // 详情组件
        pipeDetails: {}, // 管道详情-描述
        repairEventList: [], // 管道详情-抢修事件列表
    }),
    actions: {
        /**
         * 获取维修事件统计信息
         * /api/v1/domain-wd/maintenance/get-repair-event-statistic
         * 应用于:天津生态城_抢修管理
         */
        async getRepairEventStatistics($api: MaintenanceApi, params: RepairEventFilterSearchInput) {
            try {
                const res = await $api.apiV1DomainWdMaintenanceGetRepairEventStatisticPost(params)
                this.repairPipeList = res.data
                logger.debug('获取维修事件统计信息', this.repairPipeList)
            } catch (error) {
                showError('API', 'getModelLog', error)
                return false
            }
        },

        /**
         * 根据模型id获取关联的维修事件列表
         * /api/v1/domain-wd/maintenance/get-repair-event-list
         * 应用于:天津生态城_抢修管理
         */
        async getRepairEventListByModelId($api: MaintenanceApi, modelId: string) {
            try {
                const res = await $api.apiV1DomainWdMaintenanceGetRepairEventListGet(modelId)
                this.repairEventList = res.data.sort((a, b) => {
                    return dayjs(b.time as string).diff(a.time, 'millisecond')
                })
                logger.debug('根据模型id获取关联的维修事件列表', this.repairEventList)
            } catch (error) {
                showError('API', 'getModelLog', error)
                return false
            }
        },

        /**
         * 新增维修事件
         * /api/v1/domain-wd/maintenance/add-repair-event
         * 应用于:天津生态城_抢修管理
         */
        async addRepairEvent($api: MaintenanceApi, params: AddRepairEventDto) {
            try {
                const res = await $api.apiV1DomainWdMaintenanceAddRepairEventPost(params)
                logger.debug('新增维修事件', res.status)
                if (res.status === 200) {
                    return true
                }
                return false
            } catch (error) {
                showError('API', 'addRepairEvent', error)
                return false
            }
        },

        /**
         * 删除维修事件
         * /api/v1/domain-wd/maintenance/delete-repair-event
         * 应用于:天津生态城_抢修管理
         */
        async deleteRepairEvent($api: MaintenanceApi, id: string[]) {
            try {
                const res = await $api.apiV1DomainWdMaintenanceDeleteRepairEventPost(id)
                return res.data as unknown as boolean
            } catch (error) {
                showError('API', 'deleteRepairEvent', error)
                return false
            }
        },

        /**
         * 更新维修事件
         * /api/v1/domain-wd/maintenance/update-repair-event
         * 应用于:天津生态城_抢修管理
         */
        async updateRepairEvent($api: MaintenanceApi, params: RepairEventDto) {
            try {
                const res = await $api.apiV1DomainWdMaintenanceUpdateRepairEventPost(params)
                if (!isNull(res.data) && !isEmpty(res.data)) {
                    return true
                }
                return false
            } catch (error) {
                showError('API', 'updateRepairEvent', error)
                return false
            }
        },
    },
})

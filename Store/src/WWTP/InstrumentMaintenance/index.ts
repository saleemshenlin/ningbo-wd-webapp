import dayjs from 'dayjs'
import * as IotApi from '@dhicn/domain-paas-sdk-ts/iot-service'
import * as WwtpApi from '@dhicn/domain-paas-sdk-ts/wwtp-domain'
import * as WwtpInfrastructureApi from '@dhicn/domain-paas-sdk-ts/wwtp-infrastructure'
import { showError, logger } from '../../helper/showError'
import { minuteFormatZ01 } from '@dhicn/helper/date-formatter'
import { defineStore } from 'pinia'
import { InstrumentMaintenanceState } from './type'
import { MAX_SCENARIO_PAGE_SIZE } from './config'
export const useInstrumentMaintenanceStore = defineStore('wwtp-instrument-maintenance', {
    state: (): InstrumentMaintenanceState => ({
        DataCleanTagConfig: [],
        DeviceInfoList: [],
        DeviceMaintenanceData: [],
        DeviceMaintenanceInfos: [],
        DeviceMaintenanceWarmingList: [],
    }),
    getters: {},
    actions: {
        /**
         * 查询仪表状态的列表
         * @param $api
         */
        async getDataCleanTag($api: WwtpInfrastructureApi.ModelConfigApi) {
            try {
                const fetchRep = await $api.apiV2CodeConfigDataCleanTagGetAllGet()
                this.DataCleanTagConfig =
                    fetchRep.data.filter((item: any) => {
                        return item.default === true
                    }) ?? []
                logger.debug('getDataCleanTag', this.DataCleanTagConfig)
            } catch (error) {
                showError('API', 'getDataCleanTag error', error)
            }
        },
        /**
         * 分页获取设备列表
         * @param $api
         */
        async getIotDeviceList($api: IotApi.DeviceApi) {
            try {
                // await $api
                //     .apiV1IotDeviceListGet(0, 0, maintenanceType, 1, MAX_SCENARIO_PAGE_SIZE, '')
                //     .then((res) => {
                //         this.DeviceInfoList = res.data.list ?? []
                //     })
                await $api
                    .apiV1IotDeviceListAttrPost({
                        sortProperty: 0,
                        sortOrder: 0,
                        pageIndex: 1,
                        pageSize: MAX_SCENARIO_PAGE_SIZE,
                        attributes: [
                            {
                                key: '是否关键设备 | IsKeyDevice',
                                value: 1,
                                valueType: 1,
                            },
                        ],
                    })
                    .then((res) => {
                        this.DeviceInfoList = res.data.list ?? []
                    })
            } catch (error) {
                showError('API', 'getIotDeviceList error', error)
            }
        },
        /**
         * 增加设备维护记录
         * @param $api
         * @param data
         * @returns
         */
        async addSingleMaintenanceRecord(
            $api: IotApi.DeviceMaintenanceApi,
            data: IotApi.AddDeviceMaintenanceInput,
        ) {
            try {
                const fetchRep = await $api.apiV1IotMaintenanceAddPost([data])
                logger.debug('fetchRep.data', fetchRep.data)
                return fetchRep.data
            } catch (error) {
                showError('API', 'addMaintenanceRecord error', error)
            }
        },
        /**
         * 根据维护记录ID删除设备维护记录
         * @param $api
         * @param data 维护记录ID
         * @returns
         */
        async deleteMaintenanceRecord($api: IotApi.DeviceMaintenanceApi, data: string[]) {
            try {
                const fetchRep = await $api.apiV1IotMaintenanceDeletePost(data)
                return fetchRep.data
            } catch (error) {
                showError('API', 'deleteMaintenanceRecord error', error)
            }
        },
        /**
         * 根据设备ID或者资产ID，删除其对应的所有维护记录
         * @param $api
         * @param data 设备ID或者资产ID
         */
        async deleteMaintenanceRecordByEntities($api: IotApi.DeviceMaintenanceApi, data: string[]) {
            try {
                const fetchRep = await $api.apiV1IotMaintenanceDeleteByEntitiesPost(data)
                return fetchRep.data
            } catch (error) {
                showError('API', 'deleteMaintenanceRecordByEntities error', error)
            }
        },
        /**
         * 设备维护记录更新
         * @param $api
         * @param data
         * @returns
         */
        async updateMaintenanceRecord(
            $api: IotApi.DeviceMaintenanceApi,
            data: Array<{
                entityId: string
                entityType: IotApi.AddDeviceMaintenanceInputEntityTypeEnum
                maintenance: string
                time: string
                id: string
            }>,
        ) {
            try {
                const fetchRep = await $api.apiV1IotMaintenanceUpdatePost(data)
                return fetchRep.data
            } catch (error) {
                showError('API', 'updateMaintenanceRecord error', error)
            }
        },
        /**
         * 查询一批设备/资产的最新的维保信息
         * @param $api
         * @param data
         */
        async getMaintenanceLatest($api: IotApi.DeviceMaintenanceApi, data: string[]) {
            try {
                const fetchRep = await $api.apiV1IotMaintenanceGetLatestPost(data)
                this.DeviceMaintenanceData = fetchRep.data ?? []
            } catch (error) {
                showError('API', 'getMaintenanceLatest error', error)
            }
        },
        /**
         * 查询一批设备/资产的指定时间范围内的维保信息（如果传的时间为空则查询所有历史的）
         * @param $api
         * @param data
         */
        async getMaintenanceByTime(
            $api: IotApi.DeviceMaintenanceApi,
            data: {
                entityIds: string[]
                startTime?: string
                endTime?: string
            },
        ) {
            try {
                const fetchRep = await $api.apiV1IotMaintenanceGetByTimePost(data)
                this.DeviceMaintenanceInfos = fetchRep.data ?? []
            } catch (error) {
                showError('API', 'getMaintenanceByTime error', error)
            }
        },
        /**
         * 仪表状态预警记录查询
         * @param $api
         * @param startTime
         * @param endTime
         */
        async getMaintenanceList($api: WwtpApi.GeneralDataApi, days = 7) {
            try {
                const endTime = dayjs(new Date()).format(minuteFormatZ01)
                const startTime = dayjs(new Date()).add(-days, 'day').format(minuteFormatZ01)
                const fetchRep = await $api.apiV2OutputDeviceMaintenanceGet(startTime, endTime)
                this.DeviceMaintenanceWarmingList = fetchRep.data ?? []
            } catch (error) {
                showError('API', 'getMaintenanceList error', error)
            }
        },
        /**
         * 更新设备的基本信息(update attribute)
         * @param $api
         * @param data
         * @returns
         */
        async saveDeviceAttributeValues(
            $api: IotApi.DeviceApi,
            data: IotApi.SaveDeviceAttributeValuesInput,
        ) {
            try {
                const fetchRep = await $api.apiV1IotSaveDeviceAttributeValuesPost(data)
                logger.debug('fetchRep.data', fetchRep.data)
                return fetchRep.data
            } catch (error) {
                showError('API', 'saveDeviceAttributeValues error', error)
            }
        },
        /**
         *修改最新的Tag
         * @param $api
         * @param tagList
         */
        async updateTagData(
            $api: WwtpInfrastructureApi.DataApi,
            tagList: WwtpInfrastructureApi.UpdateLatestTagInput,
        ) {
            try {
                const fetchRep = await $api.apiDataUpdateLatestTagPost([tagList])
                logger.debug('fetchRep.data', fetchRep.data)
                return fetchRep.data
            } catch (error) {
                showError('API', 'updateTagData error', error)
            }
        },

        /**
         * 修改最新的Tag v2
         * /api/Data/v2/UpdateLatestTag
         * @param $api
         * @param tagList
         */
        async updateV2TagData(
            $api: IotApi.DataApi,
            tagList: WwtpInfrastructureApi.UpdateLatestTagInputV2,
        ) {
            try {
                const fetchRep = await $api.apiDataV2UpdateLatestTagPost([tagList])
                logger.debug('fetchRep.data', fetchRep.data)
                return fetchRep.data
            } catch (error) {
                showError('API', 'updateTagData error', error)
            }
        },
    },
})

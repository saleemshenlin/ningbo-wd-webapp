import { DevicePressureTag, DeviceFlowTag } from '../config'
import { useGISApiStore } from './../GISApi/index'
import {
    OnlineApi,
    DeviceIndicatorInfo,
    DeviceIndicatorPara,
    GetOnlineModelDataPara,
    GetCurrentDataPara,
} from '@dhicn/domain-paas-sdk-ts/wd-domain'
import { OnlineApiState } from './type'
import { defineStore, getActivePinia } from 'pinia'
import { showError, logger } from '../../helper/showError'
import { isString } from 'lodash'

const StoreName = 'OnlineApi'

export const useOnlineApiStore = defineStore(StoreName, {
    state: (): OnlineApiState => ({
        deviceList: [],
        indicatorList: [],
        tankStorage: [],
    }),
    getters: {
        pressureDevices(state: OnlineApiState) {
            return state.indicatorList.filter((indicator) => indicator.type === DevicePressureTag)
        },
        flowDevices(state: OnlineApiState) {
            return state.indicatorList.filter((indicator) => indicator.type === DeviceFlowTag)
        },
    },
    actions: {
        /**
         * 获得所有设备及设备详情(不包含生成GIS信息)
         * /api/v1/domain-wd/online/get-all-device
         * 应用于:天津项目
         */
        async fetchAllDeviceWithoutGIS($api: OnlineApi) {
            try {
                const fetchRep = await $api.apiV1DomainWdOnlineGetAllDeviceGet()
                this.deviceList = fetchRep.data
                this.indicatorList = fetchRep.data.reduce<DeviceIndicatorInfo[]>((list, device) => {
                    return [...list, ...(device.deviceIndicators as DeviceIndicatorInfo[])]
                }, [])
            } catch (error) {
                showError(StoreName, 'fetchAllDeviceWithoutGIS error', error)
            }
        },

        /**
         * 获取所有设备
         * 获取所有设备详细信息（包含设备下的指标信息和对应的模型点位信息）
         * /api/v1/domain-wd/online/get-all-device
         * 应用于:台州
         * @param params
         */
        async fetchAllDevice($api: OnlineApi) {
            try {
                const fetchRep = await $api.apiV1DomainWdOnlineGetAllDeviceGet()
                this.deviceList = fetchRep.data
                this.indicatorList = fetchRep.data.reduce<DeviceIndicatorInfo[]>((list, device) => {
                    return [...list, ...(device.deviceIndicators as DeviceIndicatorInfo[])]
                }, [])

                const features = fetchRep.data
                    .filter((item) => isString(item.location) && item.location !== '0,0')
                    .map((item) => {
                        return {
                            geometry: {
                                coordinates: item.location?.split(',').map((item) => Number(item)),
                                type: 'Point',
                            },
                            properties: {
                                MUID: item.id,
                                name: item.name,
                                label: item.label,
                                description: item.description,
                                group: item.group,
                                DataSource: '',
                                // deviceIndicators: item.deviceIndicators,
                            },
                            type: 'Feature',
                        }
                    })

                const gisStore = useGISApiStore(getActivePinia())
                gisStore.gis.device = JSON.stringify({ features, type: 'FeatureCollection' })
                // logger.debug('indicatorList.data :>> ', this.indicatorList)
                // logger.debug('fetchRep.data :>> ', fetchRep.data, JSON.parse(this.gis.device))
                // logger.debug('this.gis.device:>>>', this.gis.device)
            } catch (error) {
                showError(StoreName, 'fetchAllDevice error', error)
            }
        },

        /**
         * 获取当前时刻测点的实测及对应的模拟值
         * /api/v2/domain-wd/online/get-current-online-model-data
         * 应用于:横琴、李家岩、台州
         */
        async fetchOnlineDeviceCurrentDataV2(
            $api: OnlineApi,
            deviceIndicatorParas: DeviceIndicatorPara[],
            realSyncFrequency: number = 60, // 默认值 60分钟
        ) {
            try {
                const params = {
                    deviceIndicatorParas,
                    realSyncFrequency,
                }
                const fetchRep = await $api.apiV2DomainWdOnlineGetCurrentOnlineModelDataPost(params)
                logger.debug('fetchOnlineDeviceCurrentData :>> ', fetchRep.data)
                return fetchRep.data
            } catch (error) {
                showError(StoreName, 'fetchOnlineDeviceCurrentData error', error)
            }
        },

        /**
         * 获取水池可调蓄量
         * /api/v1/domain-wd/online/get-tank-storage
         * 应用于:台州
         * @param  $api
         */
        async fetchTankStorage($api: OnlineApi) {
            try {
                const fetchRep = await $api.apiV1DomainWdOnlineGetTankStoragePost()
                this.tankStorage = fetchRep.data
                logger.debug('fetchTankStorage :>> ', this.tankStorage)
            } catch (error) {
                showError(StoreName, 'fetchTankStorage error', error)
            }
        },
        /**
         * 获取实测和模拟点位的时序值
         * /api/v1/domain-wd/online/get-online-model-data
         * 应用于:台州、横琴、李家岩
         * @param $api
         * @param GetOnlineModelDataPara
         */
        async fetchOnlineDeviceTSDataByDeviceId($api: OnlineApi, params: GetOnlineModelDataPara) {
            try {
                const fetchRep = await $api.apiV1DomainWdOnlineGetOnlineModelDataPost(params)
                return fetchRep.data
            } catch (error) {
                showError(StoreName, 'fetchOnlineDeviceTSDataByDeviceId error', error)
                return []
            }
        },

        /**
         * 获取模型精度
         * /api/v1/domain-wd/online/get-accuracy-by-scenarioid
         * 应用于:天津项目_大屏
         */
        async fetchModelAccuracyByScenarioId(
            $api: OnlineApi,
            scenarioId: string,
            dataTypes: number[] = [0, 1],
        ) {
            try {
                const res = await $api.apiV1DomainWdOnlineGetAccuracyByScenarioidPost({
                    scenarioId,
                    dataTypes,
                })
                return res.data
            } catch (error) {
                showError('API', 'getPipeMeasuringPoint', error)
                return []
            }
        },

        /**
         * 获取实测点位的时序值
         * /api/v1/domain-wd/online/get-online-data
         * 应用于:横琴、李家岩
         */
        async fetchOnlineDeviceTSDataByDeviceIdAndDataType(
            $api: OnlineApi,
            params: GetOnlineModelDataPara,
        ) {
            try {
                const fetchRep = await $api.apiV1DomainWdOnlineGetOnlineDataPost(params)
                return fetchRep.data
            } catch (error) {
                showError(StoreName, 'fetchOnlineDeviceTSDataByDeviceIdAndDataType error', error)
                return []
            }
        },

        /**
         * 获取当前时刻测点的实测
         * /api/v2/domain-wd/online/get-current-online-data
         * 应用于:横琴、李家岩
         */
        async fetchOnlineDeviceCurrentDataByDeviceIdAndDataType(
            $api: OnlineApi,
            params: GetCurrentDataPara,
        ) {
            try {
                const fetchRep = await $api.apiV2DomainWdOnlineGetCurrentOnlineDataPost(params)
                return fetchRep.data
            } catch (error) {
                showError(
                    StoreName,
                    'fetchOnlineDeviceCurrentDataByDeviceIdAndDataType error',
                    error,
                )
                return []
            }
        },
    },
})

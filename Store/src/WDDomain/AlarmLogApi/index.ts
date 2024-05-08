import {
    AlarmLogApi,
    AlarmLogDto,
    GetAlarmLogByTypeInput,
} from '@dhicn/domain-paas-sdk-ts/wd-domain'
import { AlarmLogApiState } from './type'
import { defineStore } from 'pinia'
import { showError } from '../../helper/showError'
const StoreName = 'AlarmLogApi'

export const useAlarmLogApiStore = defineStore(StoreName, {
    state: (): AlarmLogApiState => ({
        alarmLog: [],
    }),
    getters: {
        latestAlarmMap(state: AlarmLogApiState) {
            const graphicsMap = new Map<string, AlarmLogDto>()
            state.alarmLog
                .sort(
                    (a, b) =>
                        new Date(a.alarmTime as string).getTime() -
                        new Date(b.alarmTime as string).getTime(),
                )
                .forEach((item) => {
                    graphicsMap.set(item.indicatorName as string, item)
                })
            return graphicsMap
        },
    },
    actions: {
        /**
         * 在线报警预警日志 根据类型获取报警日志
         * /api/v1/domain-wd/log/alarm/get-by-type
         * @param $api
         * @param GetAlarmLogByTypeInput
         */
        async fetchAlarmLog($api: AlarmLogApi, params: GetAlarmLogByTypeInput) {
            try {
                const fetchRep = await $api.apiV1DomainWdLogAlarmGetByTypePost(params)
                this.alarmLog = fetchRep.data.sort((a, b) => {
                    if (a.alarmTime === undefined) {
                        return -1
                    } else if (b.alarmTime === undefined) {
                        return 1
                    } else {
                        return new Date(b.alarmTime).getTime() - new Date(a.alarmTime).getTime()
                    }
                })
                // logger.debug('fetchAlarmLog :>> ', this.alarmLog)
            } catch (error) {
                showError('API', 'fetchAlarmLog error', error)
            }
        },

        /**
         * 新增报警日志
         * /api/v1/domain-wd/log/alarm/add
         * 应用于:台州项目:供水大屏-报警
         */
        async addAlarmLog($api: AlarmLogApi) {
            try {
                const res = await $api.apiV1DomainWdLogAlarmAddPost()
                return res.data as unknown as boolean
            } catch (error) {
                showError('API', 'addAlarmLog', error)
                return false
            }
        },

        /**
         * 注册调度日志
         * /api/v1/domain-wd/log/alarm/register
         * 应用于:台州项目:供水大屏-报警
         */
        async registerAlarmLog($api: AlarmLogApi) {
            try {
                const res = await $api.apiV1DomainWdLogAlarmRegisterGet()
                return res.data as unknown as boolean
            } catch (error) {
                showError('API', 'registerAlarmLog', error)
                return false
            }
        },
    },
})

import { showError } from '../../helper/showError'
import { minuteFormat01, roundDownToFiveMinutes } from '@dhicn/helper/date-formatter'
import * as WwtpApi from '@dhicn/domain-paas-sdk-ts/wwtp-domain'
import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import { ToxicityMonitorState, ToxicQuery } from './type'

export const useToxicityMonitorState = defineStore('wwtp-toxicity-monitor', {
    state: (): ToxicityMonitorState => ({
        realTimeLoading: false,
        realTimeToxicityList: [],
    }),
    actions: {
        /**
         * 获取实时水质毒性和实时生物抑制率
         * @param $api
         */
        async updateRealTimeToxicity($api: WwtpApi.ToxicityMonitorApi) {
            try {
                this.realTimeLoading = true
                const res = await $api.apiV2ToxicityMonitorRealTimeGet()
                this.realTimeToxicityList = res.data ?? []
                this.realTimeLoading = false
            } catch (error) {
                showError('API', 'getRealTimeToxicity', error)
                this.realTimeLoading = false
            }
        },
        /**
         * 毒性监测记录
         * @param $api
         * @param data
         * @param days
         */
        async queryMonitorHistory($api: WwtpApi.ToxicityMonitorApi, data: ToxicQuery, days = 3) {
            try {
                const isoEndTime = dayjs(roundDownToFiveMinutes(new Date())).toISOString()
                const isoStartTime = dayjs(
                    roundDownToFiveMinutes(dayjs().add(-days, 'days').toDate()),
                ).toISOString()
                const params = {
                    startTime: isoStartTime,
                    endTime: isoEndTime,
                    ...data,
                }
                const res = await $api.apiV2ToxicityMonitorMonitorHistoryPost(params)
                return res.data ?? {}
            } catch (error) {
                showError('API', 'queryMonitorHistory', error)
                return {}
            }
        },
        /**
         * 预警记录
         * @param $api
         * @param data
         * @param days
         */
        async queryAlarmHistory($api: WwtpApi.ToxicityMonitorApi, data: ToxicQuery, days = 3) {
            try {
                const isoEndTime = dayjs(roundDownToFiveMinutes(new Date())).toISOString()
                const isoStartTime = dayjs(
                    roundDownToFiveMinutes(dayjs().add(-days, 'days').toDate()),
                ).toISOString()
                const params = {
                    startTime: isoStartTime,
                    endTime: isoEndTime,
                    ...data,
                }
                const res = await $api.apiV2ToxicityMonitorAlarmHistoryPost(params)
                return res.data ?? {}
            } catch (error) {
                showError('API', 'queryAlarmHistory', error)
                return {}
            }
        },
        /**
         * 质控记录
         * @param $api
         * @param data
         * @param days
         */
        async queryControlHistory($api: WwtpApi.ToxicityMonitorApi, data: ToxicQuery, days = 3) {
            try {
                const isoEndTime = dayjs(roundDownToFiveMinutes(new Date())).toISOString()
                const isoStartTime = dayjs(
                    roundDownToFiveMinutes(dayjs().add(-days, 'days').toDate()),
                ).toISOString()
                const params = {
                    startTime: isoStartTime,
                    endTime: isoEndTime,
                    ...data,
                }
                const res = await $api.apiV2ToxicityMonitorControlHistoryPost(params)
                return res.data ?? {}
            } catch (error) {
                showError('API', 'queryControlHistory', error)
                return {}
            }
        },
    },
})

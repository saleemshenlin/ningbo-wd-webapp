import { defineStore } from 'pinia'
import { AccidentApiState } from './type'
import { showError } from '../../helper/showError'
import { AccidentApi, AccidentDetailInput } from '@dhicn/domain-paas-sdk-ts/accident-service'
const StoreName = 'AccidentApi'
export const useAccidentApiStore = defineStore(StoreName, {
    state: (): AccidentApiState => ({}),
    actions: {
        /**
         * 新增事故
         * /api/v1/accident/accident/add-accident
         * 应用于:天津、横琴
         */
        async addAccident($api: AccidentApi, params: AccidentDetailInput) {
            try {
                const res = await $api.apiV1AccidentAccidentAddAccidentPost(params)
                return res.data
            } catch (error) {
                showError(StoreName, 'addAccident error', error)
                return ''
            }
        },

        /**
         * 删除事故
         * /api/v1/accident/accident/delete
         * 应用于:天津、横琴
         */
        async deleteAccident($api: AccidentApi, params: string[]) {
            try {
                const res = await $api.apiV1AccidentAccidentDeletePost(params)
                return res.data
            } catch (error) {
                showError(StoreName, 'deleteAccident error', error)
                return false
            }
        },

        /**
         * 获取事故详细信息
         * /api/v1/accident/accident/detail
         * 应用于:天津、横琴
         */
        async getAccidentDetail($api: AccidentApi, accidentId: string) {
            try {
                const res = await $api.apiV1AccidentAccidentDetailGet(accidentId)
                return res.data
            } catch (error) {
                showError(StoreName, 'get Accident Detail error', error)
                return {}
            }
        },
    },
})

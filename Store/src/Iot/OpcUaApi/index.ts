import { defineStore } from 'pinia'
import { OpcUaApiState } from './type'
import { showError } from '../../helper/showError'
import {
    AddOpcUaComInput,
    AddOpcUaPubSubInput,
    InitOpcUaConfigInput,
    OpcUaComPara,
    OpcUaPubSubPara,
    OpcuaApi,
    QueryOpcUaComInput,
    QueryOpcUaPubSubInput,
    ReadNodeInput,
    WriteNodeInput,
} from '@dhicn/domain-paas-sdk-ts/iot-service'
const StoreName = 'OpcUaApi'
export const useOpcUaApiStore = defineStore(StoreName, {
    state: (): OpcUaApiState => ({}),
    actions: {
        /**
         * OPC-UA Server信息初始化
         * /api/v1/opc-ua/init
         * 应用于:资产模型配置-opc
         */
        async initOpcUaServerInfo($api: OpcuaApi, params: InitOpcUaConfigInput[]) {
            try {
                const res = await $api.apiV1OpcUaInitPost(params)
                return res.data
            } catch (error) {
                showError(StoreName, 'initOpcUaServerInfo error', error)
                return false
            }
        },

        /**
         * OPC-UA Server信息删除
         * /api/v1/opc-ua/delete
         * 应用于:资产模型配置-opc
         */
        async deleteOpcUaServerInfo($api: OpcuaApi, params: string[]) {
            try {
                const res = await $api.apiV1OpcUaDeletePost(params)
                return res.data as unknown as boolean
            } catch (error) {
                showError(StoreName, 'deleteOpcUaServerInfo error', error)
                return false
            }
        },

        /**
         * OPC-UA Server信息查询
         * /api/v1/opc-ua/query-opc-ua-servers
         * 应用于:资产模型配置-opc
         */
        async queryOpcUaServerInfo($api: OpcuaApi, opcFlag: string) {
            try {
                const res = await $api.apiV1OpcUaQueryOpcUaServersPost(opcFlag)
                return res.data
            } catch (error) {
                showError(StoreName, 'queryOpcUaServerInfo error', error)
                return []
            }
        },

        /**
         * OPC-UA 发布订阅新增
         * /api/v1/opc-ua/add-pub-sub
         * 应用于:资产模型配置-opc
         */
        async addOpcUaPubSub($api: OpcuaApi, params: AddOpcUaPubSubInput[]) {
            try {
                const res = await $api.apiV1OpcUaAddPubSubPost(params)
                return res.data
            } catch (error) {
                showError(StoreName, 'addOpcUaPubSub error', error)
                return false
            }
        },

        /**
         * OPC-UA 发布订阅删除
         * /api/v1/opc-ua/delete-pub-sub
         * 应用于:资产模型配置-opc
         */
        async deleteOpcUaPubSub($api: OpcuaApi, params: string[]) {
            try {
                const res = await $api.apiV1OpcUaDeletePubSubPost(params)
                return res.data
            } catch (error) {
                showError(StoreName, 'deleteOpcUaPubSub error', error)
                return false
            }
        },

        /**
         * OPC-UA 发布订阅更新
         * /api/v1/opc-ua/update-pub-sub
         * 应用于:资产模型配置-opc
         */
        async updateOpcUaPubSub($api: OpcuaApi, params: OpcUaPubSubPara[]) {
            try {
                const res = await $api.apiV1OpcUaUpdatePubSubPost(params)
                return res.data as unknown as boolean
            } catch (error) {
                showError(StoreName, 'updateOpcUaPubSub error', error)
                return false
            }
        },

        /**
         * OPC-UA 发布订阅查询
         * /api/v1/opc-ua/query-pub-sub
         * 应用于:资产模型配置-opc
         */
        async queryOpcUaPubSub($api: OpcuaApi, params: QueryOpcUaPubSubInput) {
            try {
                const res = await $api.apiV1OpcUaQueryPubSubPost(params)
                return res.data
            } catch (error) {
                showError(StoreName, 'queryOpcUaPubSub error', error)
                return []
            }
        },

        /**
         * OPC-UA 指标和监测点映射添加
         * /api/v1/opc-ua/add-communication
         * 应用于:资产模型配置-opc
         */
        async addOpcUaCommunication($api: OpcuaApi, params: AddOpcUaComInput[]) {
            try {
                const res = await $api.apiV1OpcUaAddCommunicationPost(params)
                return res.data
            } catch (error) {
                showError(StoreName, 'addOpcUaCommunication error', error)
                return false
            }
        },

        /**
         * OPC-UA 指标和监测点映射更新
         * /api/v1/opc-ua/update-communication
         * 应用于:资产模型配置-opc
         */
        async updateOpcUaCommunication($api: OpcuaApi, params: OpcUaComPara[]) {
            try {
                const res = await $api.apiV1OpcUaUpdateCommunicationPost(params)
                return res.data
            } catch (error) {
                showError(StoreName, 'updateOpcUaCommunication error', error)
                return false
            }
        },

        /**
         * OPC-UA 指标和监测点映射删除
         * /api/v1/opc-ua/delete-communication
         * 应用于:资产模型配置-opc
         */
        async deleteOpcUaCommunication($api: OpcuaApi, params: string[]) {
            try {
                const res = await $api.apiV1OpcUaDeleteCommunicationPost(params)
                return res.data
            } catch (error) {
                showError(StoreName, 'deleteOpcUaCommunication error', error)
                return false
            }
        },

        /**
         * OPC-UA 指标和监测点映射查询
         * /api/v1/opc-ua/query-communication
         * 应用于:资产模型配置-opc
         */
        async queryOpcUaCommunication($api: OpcuaApi, params: QueryOpcUaComInput) {
            try {
                const res = await $api.apiV1OpcUaQueryCommunicationPost(params)
                return res.data
            } catch (error) {
                showError(StoreName, 'queryOpcUaCommunication error', error)
                return []
            }
        },

        /**
         * OPC-UA 读节点数据
         * /api/v1/opc-ua/read-node
         * 应用于:资产模型配置-opc
         */
        async readOpcUaNode($api: OpcuaApi, params: ReadNodeInput) {
            try {
                const res = await $api.apiV1OpcUaReadNodePost(params)
                return res.data
            } catch (error) {
                showError(StoreName, 'readOpcUaNode error', error)
                return {}
            }
        },

        /**
         * OPC-UA 写节点数据
         * /api/v1/opc-ua/write-node
         * 应用于:资产模型配置-opc
         */
        async writeOpcUaNode($api: OpcuaApi, params: WriteNodeInput) {
            try {
                const res = await $api.apiV1OpcUaWriteNodePost(params)
                return res.data
            } catch (error) {
                showError(StoreName, 'writeOpcUaNode error', error)
                return false
            }
        },

        /**
         * OPC-UA 批量写节点数据
         * /api/v1/opc-ua/write-node-for-batch
         * 应用于:资产模型配置-opc
         */
        async writeOpcUaNodeForBatch($api: OpcuaApi, params: WriteNodeInput[]) {
            try {
                const res = await $api.apiV1OpcUaWriteNodeForBatchPost(params)
                return res.data
            } catch (error) {
                showError(StoreName, 'writeOpcUaNodeForBatch error', error)
                return false
            }
        },

        /**
         * OPC-UA 数据同步
         * /api/v1/opc-ua/sync-telemetry-data
         * 应用于:资产模型配置-opc
         */
        async syncOpcUaTelemetryData($api: OpcuaApi) {
            try {
                const res = await $api.apiV1OpcUaSyncTelemetryDataPost()
                return res.data
            } catch (error) {
                showError(StoreName, 'syncOpcUaTelemetryData error', error)
                return false
            }
        },
    },
})

import {
    IotGroupApi,
    GroupTreeOutput,
    UpdateGroupInput,
    AddGroupInput,
    AddIotGroupEquipRel,
} from '@dhicn/domain-paas-sdk-ts/iot-service'
import { IotGroupApiState } from './type'
import { defineStore } from 'pinia'
import { showError } from '../../helper/showError'

const StoreName = 'IotGroupApi'

export const useIotGroupApiStore = defineStore(StoreName, {
    state: (): IotGroupApiState => ({
        groupList: [],
        groupWithDeviceList: {},
    }),
    actions: {
        /**
         * 获得所有分组,数据未处理
         * /api/v1/iot/group/get-root-group
         * 应用于:资产模型配置
         */
        async fetchRootGroupsData($api: IotGroupApi) {
            try {
                const fetchRep = await $api.apiV1IotGroupGetRootGroupGet()
                return fetchRep.data ?? []
            } catch (error) {
                showError(StoreName, 'fetchRootGroupsData error', error)
                return []
            }
        },

        /**
         * 获取所有分组,数据处理
         * /api/v1/iot/group/get-root-group
         * @param $api
         */
        async fetchRootGroups($api: IotGroupApi) {
            try {
                const fetchRep = await $api.apiV1IotGroupGetRootGroupGet()
                const rootGroups = fetchRep.data
                // 获得子子分组信息
                this.groupList = []
                if (rootGroups.length > 0) {
                    const apis = rootGroups.map(async (root) => {
                        await $api
                            .apiV1IotGroupGetDetailByGroupIdGet(root.id)
                            .then((groupDetailRep) => {
                                const groupDetail = groupDetailRep.data
                                groupDetail.children?.forEach((group) => {
                                    this.groupWithDeviceList[group.groupName as string] = (
                                        group.equipmentIds as string[]
                                    ).map((id) => {
                                        return {
                                            id: `${id}|${group.id as string}`,
                                            groupId: group.id as string,
                                            equipmentId: id,
                                        }
                                    })
                                })
                                const res = groupDetail.children?.map((group) => {
                                    return {
                                        ...group,
                                        parentName: root.groupName,
                                    } as Record<string, any>
                                })
                                this.groupList.push(...(res as Record<string, any>[]))
                            })
                        this.groupList.push(root)
                    })
                    return await Promise.all(apis).then(async (result) => {
                        return await Promise.resolve(result)
                    })
                }
            } catch (error) {
                showError(StoreName, 'fetchRootGroups error', error)
            }
        },

        /**
         * 增加分组配置
         * /api/v1/iot/group/add
         * 应用于:资产模型配置
         */
        async addGroup($api: IotGroupApi, params: AddGroupInput) {
            try {
                const fetchRep = await $api.apiV1IotGroupAddPost(params)
                return fetchRep.data
            } catch (error) {
                showError(StoreName, 'addGroup error', error)
            }
        },

        /**
         * 修改分组配置
         * /api/v1/iot/group/update
         * 应用于:资产模型配置
         */
        async updateGroup($api: IotGroupApi, params: UpdateGroupInput) {
            try {
                const fetchRep = await $api.apiV1IotGroupUpdatePut(params)
                return fetchRep.data
            } catch (error) {
                showError(StoreName, 'updateGroup error', error)
                return false
            }
        },

        /**
         * 删除分组配置
         * /api/v1/iot/group/delete
         * 应用于:资产模型配置
         */
        async deleteGroup($api: IotGroupApi, ids: string[]) {
            try {
                const fetchRep = await $api.apiV1IotGroupDeletePost({ ids })
                return fetchRep.data
            } catch (error) {
                showError(StoreName, 'deleteGroup error', error)
                return false
            }
        },

        /**
         * 根据分组id获取分组配置，包括所有子孙分组
         * /api/v1/iot/group/get-list-by-groupId
         * 应用于:资产模型配置-分组
         */
        async getGroupListByGroupId($api: IotGroupApi, groupId: string) {
            try {
                // TODO:根据分组id获取分组配置，包括所有子孙分组,暂时只获取当前分组
                const fetchRep = await $api.apiV1IotGroupGetListByGroupIdGet(groupId)
                return fetchRep.data
            } catch (error) {
                showError(StoreName, 'getGroupListByGroupId error', error)
                return []
            }
        },

        /**
         * 批量增加分组和资产设备关联信息
         * /api/v1/iot/group/add-batch-relation-info
         * 应用于:资产模型配置-分组
         */
        async addBatchRelationInfo($api: IotGroupApi, params: AddIotGroupEquipRel[]) {
            try {
                const fetchRep = await $api.apiV1IotGroupAddBatchRelationInfoPost(params)
                return fetchRep.data as unknown as boolean
            } catch (error) {
                showError(StoreName, 'addBatchRelationInfo error', error)
                return false
            }
        },

        /**
         * 删除分组和资产设备关联 | 删除租户下所有分组和资产设备关联信息
         * /api/v1/iot/group/delete-all-relation-info
         * 应用于:资产模型配置-分组
         */
        async deleteAllRelationInfo($api: IotGroupApi) {
            try {
                const fetchRep = await $api.apiV1IotGroupDeleteAllRelationInfoDelete()
                return fetchRep.data
            } catch (error) {
                showError(StoreName, 'deleteAllRelationInfo error', error)
                return false
            }
        },

        /**
         * 根据分组id获取所有子孙分组配置及其关联的iot实体信息
         * /api/v1/iot/group/get-detail-by-groupId
         * 应用于:资产模型配置-分组
         */
        async getDetailByGroupId($api: IotGroupApi, groupId: string) {
            try {
                const fetchRep = await $api.apiV1IotGroupGetDetailByGroupIdGet(groupId)
                return fetchRep.data
            } catch (error) {
                showError(StoreName, 'getDetailByGroupId error', error)
                return []
            }
        },
    },
})

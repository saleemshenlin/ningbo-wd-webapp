<script setup lang="ts">
import { ref, watch } from 'vue'
import ProfileData from '../ProfileData/ProfileData.vue'
import ProfileMap from '../ProfileMap/ProfileMap.vue'
import { isEmpty } from 'lodash'
import { UseMessage } from 'dhi-dss-mf-layout'
import { IProfileTableData } from './type'
import { Helper } from '@dhicn/helper'
import type { Scenario } from '@dhicn/domain-paas-sdk-ts/scenario-service'
import type { NodeProfileDataProfileDataItem } from '@dhicn/domain-paas-sdk-ts/result-service'

interface IProps {
    isProfileDataShow: boolean
    profileTable: IProfileTableData[]
    scenario: Scenario
    fetchProfileMap: (NodeIDs: string[]) => {}
}
const props = withDefaults(defineProps<IProps>(), {
    isProfileDataShow: () => false,
    profileTable: () => [],
    scenario: () => ({} as Scenario),
    fetchProfileMap: () => ({}),
})

const profileData = ref<any[]>([])
const profileTimeRange = ref<string[]>([])
const totalDataset = ref<NodeProfileDataProfileDataItem[]>([])
console.log('totalDataset>', totalDataset)
const isProfileMapShow = ref(false)

const createProfileMap = async () => {
    if (isEmpty(props.profileTable) || props.profileTable.length === 1) {
        UseMessage.useWarningMessage('请先选择至少两根管道节点!')
        return
    }
    const NodeIDs = props.profileTable.map((item: IProfileTableData) => item.upJunction)
    if (isEmpty(props.scenario)) {
        UseMessage.useWarningMessage('获得当前方案失败')
        return
    }
    const fetchRep: any = await Promise.all([props.fetchProfileMap(NodeIDs)])
    console.log('createProfileMap', fetchRep)
    if (isEmpty(fetchRep[0])) {
        UseMessage.useWarningMessage('获得剖面图数据失败!')
    } else {
        totalDataset.value = fetchRep[0]!.profileData!
        profileTimeRange.value = fetchRep[0]!.profileData!.map((item: any) => item.time as string)
        changeProfileTime(0)
    }
}

const changeProfileTime = (index: number) => {
    let sum = 0
    const profileDataItem = totalDataset.value[index]
    if (profileDataItem === undefined) {
        profileData.value = []
        return
    }
    const profileDataSet = props.profileTable.reduce((list: any, node: any) => {
        const pipe = {
            x: sum,
            y: [Helper.toFixed(node.Elev - node.pipeDiameter / 1000), Helper.toFixed(node.Elev)],
            category: 'pipe',
        }
        const profileItem = profileDataItem.data!.find(
            (profileItemData) => profileItemData.nodeID === node.upJunction,
        )
        if (profileItem !== undefined) {
            const profile = {
                x: sum,
                y: Helper.toFixed(profileItem.profileData as number),
                category: 'profile',
            }
            sum = Helper.toFixed(sum + node.pipeLength)
            return [...list, pipe, profile]
        }
        sum = Helper.toFixed(sum + node.pipeLength)
        return [...list, pipe]
    }, []) as Array<{ x: number; y: number | number[]; category: string }>
    profileData.value = profileDataSet
    isProfileMapShow.value = true
    console.log('profileDataSet', profileDataSet, profileTimeRange.value)
}

const deleteProfileTableData = (record: IProfileTableData) => {
    const index = props.profileTable.findIndex(
        (item: IProfileTableData) => item.pipeName === record.pipeName,
    )
    console.log('index>>', index)
    if (index !== -1) {
        // eslint-disable-next-line vue/no-mutating-props
        props.profileTable.splice(index, 1)
    }
}

const clearProfileTableData = () => {
    // eslint-disable-next-line vue/no-mutating-props
    props.profileTable.splice(0, props.profileTable.length)
    isProfileMapShow.value = false
}

const onClose = () => {
    isProfileMapShow.value = false
}

watch(
    () => props.isProfileDataShow,
    () => {
        if (!props.isProfileDataShow) {
            clearProfileTableData()
        }
    },
)
</script>
<template>
    <ProfileData
        class="profile-data"
        @create-profile-map="createProfileMap"
        @delete-profile-table-data="deleteProfileTableData"
        @clear-profile-table-data="clearProfileTableData"
        :data-set="props.profileTable"
        v-if="props.isProfileDataShow"
    >
        <template #cornet>
            <div class="left-top corner"></div>
            <div class="right-top corner"></div>
            <div class="right-bottom corner"></div>
            <div class="left-bottom corner"></div>
        </template>
    </ProfileData>

    <ProfileMap
        class="profile-map"
        :on-close="onClose"
        :profile-data="profileData"
        :timeRange="profileTimeRange"
        :changeTime="changeProfileTime"
        v-if="
            props.isProfileDataShow &&
            profileTimeRange.length > 0 &&
            profileData.length > 0 &&
            isProfileMapShow
        "
    >
        <template #cornet>
            <div class="left-top corner"></div>
            <div class="right-top corner"></div>
            <div class="right-bottom corner"></div>
            <div class="left-bottom corner"></div>
        </template>
    </ProfileMap>
</template>

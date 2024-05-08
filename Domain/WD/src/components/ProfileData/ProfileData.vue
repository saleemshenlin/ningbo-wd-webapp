<script setup lang="ts">
import { profileDataColumns, SecondaryBtn, PrimaryBtn } from './config'
import { IconDelete } from '@arco-design/web-vue/es/icon'

const emit = defineEmits(['createProfileMap', 'deleteProfileTableData', 'clearProfileTableData'])
interface IProfileTableData {
    pipeName: string
    upJunction: string
    downJunction: string
    pipeDiameter: number
    pipeLength: number
    Elev: number
}
interface IProps {
    dataSet: IProfileTableData[]
}
const props = withDefaults(defineProps<IProps>(), {
    dataSet: () => [],
})

const clearSelect = () => {
    emit('clearProfileTableData')
}
const createProfileMap = () => {
    emit('createProfileMap')
}
const deleteRecord = (record: IProfileTableData) => {
    emit('deleteProfileTableData', record)
}
</script>

<template>
    <div class="profile-main">
        <slot name="cornet" />
        <div class="profile-title">
            <a-space>
                <a-button @click="clearSelect">{{ SecondaryBtn }}</a-button>
                <a-button type="primary" @click="createProfileMap">{{ PrimaryBtn }}</a-button>
            </a-space>
        </div>
        <a-table
            size="mini"
            :pagination="false"
            :columns="profileDataColumns"
            :data="props.dataSet"
            :scroll="{
                y: 300,
            }"
        >
            <template #operation="{ record, rowIndex }">
                <a-button
                    v-if="rowIndex === 0 || rowIndex === props.dataSet.length - 1"
                    type="text"
                    @click="deleteRecord(record)"
                >
                    <template #icon>
                        <icon-delete :style="{ color: 'red' }" />
                    </template>
                </a-button>
            </template>
        </a-table>
    </div>
</template>

<style lang="scss">
.profile-main {
    display: flex;
    flex-direction: column;
    border: 2px dotted #4aa8ff;
    background: rgba(255, 255, 255, 0.8);
    .profile-title {
        display: flex;
        justify-content: end;
        margin: 10px 0;
    }
    .arco-table-tr:not(.arco-table-tr-empty) .arco-table-cell {
        height: 32px;
        line-height: 32px;
    }
}
</style>

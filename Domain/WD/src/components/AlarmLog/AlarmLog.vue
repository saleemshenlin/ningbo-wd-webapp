<script setup lang="ts">
import { IAlarmLog } from './type'
import { wDAlarmColumns, wDAlarmTitle } from './config'
import { IconLocation } from '@arco-design/web-vue/es/icon'
import { Helper } from '@dhicn/helper'
import { minuteFormat01 } from '@dhicn/helper/date-formatter'
import dayjs from 'dayjs'

import { WDModelResultType } from '../ResultMap/config'
const emit = defineEmits(['FlyTo'])
interface IProps {
    dataSet: IAlarmLog[]
    format: (item: 'label' | 'unit', key: WDModelResultType) => string
}
const props = withDefaults(defineProps<IProps>(), {
    dataSet: () => [],
    format: (item: any, key: any) => key,
})

const flyTo = (record: IAlarmLog) => {
    emit('FlyTo', record)
}

const getAlarmType = (alarmType: string) => {
    return props.format('label', alarmType as WDModelResultType)
}

const getValueDiff = (record: IAlarmLog) => {
    return `${Helper.toFixed(record.valueDiff)}${props.format(
        'unit',
        record.alarmDataType! as WDModelResultType,
    )}`
}
</script>
<template>
    <div class="wd-alarm-log">
        <div class="title_row">
            <span class="info-title">{{ wDAlarmTitle }}</span>
        </div>
        <a-divider />
        <a-table
            size="mini"
            :scroll="{
                y: 120,
            }"
            :pagination="false"
            :data="props.dataSet"
            :columns="wDAlarmColumns"
            :virtual-list-props="{
                height: 100,
                threshold: 50,
            }"
        >
            <template #alarmDataType="{ record }">
                {{ getAlarmType(record.alarmDataType) }}
            </template>
            <template #alarmTime="{ record }">
                {{ dayjs(record.alarmTime).format(minuteFormat01) }}
            </template>
            <template #valueDiff="{ record }">
                {{ getValueDiff(record) }}
            </template>
            <!-- TODO:预留点位信息 -->
            <template #location="{ record }">
                <a-button type="text" @click="flyTo(record)">
                    <template #icon>
                        <icon-location :style="{ color: 'blue' }" />
                    </template>
                </a-button>
            </template>
        </a-table>
    </div>
</template>
<style lang="scss">
.info-title {
    font-size: 20px;
    line-height: 36px;
    height: 36px;
    padding: 0px 12px;
    background-color: rgb(var(--primary-6));
    color: var(--color-white);
}
.arco-divider-horizontal {
    margin: 4px 0;
}
.arco-virtual-list {
    overflow-x: hidden !important;
}
</style>

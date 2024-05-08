<script setup lang="ts">
import { ProfileMapTitle, ProfileMapSubTitle, ProfileMapUnit } from './config'
import { IconClose } from '@arco-design/web-vue/es/icon'
import ProfileMapChart from '../ProfileChart/ProfileMapChart.vue'
import { computed, ref } from 'vue'
import { minuteFormat02 } from '@dhicn/helper/date-formatter'
import { Helper } from '@dhicn/helper'
import dayjs from 'dayjs'
import { debounce } from 'lodash'

export interface IProps {
    profileData: {
        x: number
        y: number | number[]
        category: 'pipe' | 'profile'
    }[]
    timeRange: string[]
    changeTime: (num: number) => void
    onClose: () => void
}
const props = withDefaults(defineProps<IProps>(), {
    profileData: () => [],
    timeRange: () => [],
    onClose: () => '',
    changeTime: () => ({}),
})

const currentIndex = ref(0)
// 汇总管道长度
const pipeLine = computed(() => {
    return props.profileData[props.profileData.length - 1].x
})

const timeMarks = computed(() => {
    return {
        0: dayjs(props.timeRange[0]).format(minuteFormat02),
        [props.timeRange.length - 1]: dayjs(props.timeRange[props.timeRange.length - 1]).format(
            minuteFormat02,
        ),
    }
})

const formatSliderTip = (value: number) => {
    return dayjs(props.timeRange[value]).format(minuteFormat02)
}
const changeTimeDebounce = debounce((num: number) => {
    props.changeTime(num)
}, 300)
</script>
<template>
    <div class="profile-map-main">
        <slot name="cornet" />
        <div class="profile-map-title">
            <span></span>
            <a-typography-title :heading="5">{{
                `${ProfileMapTitle}(${ProfileMapSubTitle}${Helper.toFixed(pipeLine)}m)`
            }}</a-typography-title>
            <a-button type="text" @click="onClose">
                <template #icon>
                    <icon-close :size="40" :style="{ color: '4AA8FF' }" />
                </template>
            </a-button>
        </div>
        <div class="profile-map-time-range">
            <a-slider
                class="time_slider"
                v-model="currentIndex"
                :max="props.timeRange.length - 1"
                :marks="timeMarks"
                :format-tooltip="formatSliderTip"
                @change="(num:number | [number, number])=>changeTimeDebounce(num as number)"
            />
        </div>
        <div class="profile-map-chart">
            <ProfileMapChart :unit="ProfileMapUnit" :data="props.profileData"></ProfileMapChart>
        </div>
    </div>
</template>

<style lang="scss">
.profile-map-main {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    border: 2px dotted #4aa8ff;
    background-color: rgba(var(--primary-7));
    .profile-map-title {
        height: 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .profile-map-chart {
        height: calc(100% - 50px);
        margin: 10px;
        width: calc(100% - 20px);
        .chart_component {
            height: 100% !important;
        }
    }
    .profile-map-time-range {
        margin: 0 90px;
        .arco-slider-mark {
            width: max-content;
        }
    }
}
</style>

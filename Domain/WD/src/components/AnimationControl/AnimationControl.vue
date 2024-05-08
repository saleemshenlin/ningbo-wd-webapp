<script setup lang="ts">
import {
    IconBackward,
    IconPlayCircle,
    IconPauseCircle,
    IconForward,
} from '@arco-design/web-vue/es/icon'
import { debounce, isEmpty } from 'lodash'
import { reactive, ref, watch } from 'vue'
import { SpeedList } from './config'
import { minuteFormat03 } from '@dhicn/helper/date-formatter'
import dayjs from 'dayjs'
export interface ITimeseries {
    time?: string[]
    iDs?: string[]
    data?: number[][]
}
// 数据
const props = withDefaults(defineProps<ITimeseries>(), {
    time: () => [], // 时刻列表
    iDs: () => [], // gis
    data: () => [], // 数据
})

console.log('animation control :>> ', props)

// 时间
const animationFrequency = 400 // 刷新频率
const range = reactive<string[]>([]) // 时间范围
// 速率下拉框
const speedType = ref('1')
// 定时器
let timer: NodeJS.Timeout | null = null

// 滑动条
const sliderMax = ref(0) // 总步长
const current = ref(0) // 当前步长

// 操作
const emit = defineEmits<{
    (e: 'change', props: { index: number; time: string }): void
}>()

const playing = ref(false)
const isDisabled = ref(true)
const formatter = () => {
    if (props.time.length > 0) {
        return dayjs(props.time[current.value]).format(minuteFormat03)
        // const date = parseResultTime(props.time[current.value])
        // return formatResultTime(date)
        // return props.time[current.value]
    }
    return ''
}
const sliderChange = (index: number) => {
    stop()
    doChange(index)
}
const doChange = (newValue: number) => {
    if (newValue > props.time.length - 1) {
        current.value = props.time.length - 1
    } else {
        current.value = newValue
    }
    console.log('doChange :>> ', { index: newValue, time: props.time[newValue] })
    setEmit(current.value)
}

const setEmit = debounce((index: number) => {
    emit('change', { index, time: props.time[index] })
}, 100)

// 后退
const backward = () => {
    pause()
    if (current.value > 0) {
        doChange(current.value - 1)
    }
}

// 播放
const play = () => {
    playing.value = !playing.value
    step()
}

// 暂停
const pause = () => {
    playing.value = false
    if (timer !== null) {
        clearTimeout(timer)
    }
    timer = null
}

// 前进
const forward = () => {
    pause()
    if (current.value < props.time.length - 1) {
        doChange(current.value + 1)
    }
}

// 停止
const stop = () => {
    pause()
    playing.value = false
    current.value = 0
    setEmit(current.value)
    timer = null
}

// 渲染
const step = () => {
    const frame = () => {
        if (current.value >= props.time.length - 1) {
            stop()
        } else {
            doChange(current.value + Number(speedType.value))
            step()
        }
    }
    timer = setTimeout(() => {
        requestAnimationFrame(frame)
    }, animationFrequency)
}

const formatCommon = (params: string): string => {
    if (params !== undefined && params !== '') {
        return dayjs(params).format(minuteFormat03)
        // const date = parseResultTime(params)
        // return formatResultTime(date)
        // return params
    }
    return ''
}

watch(
    props,
    (newVal) => {
        if (!isEmpty(newVal.time)) {
            stop()
            current.value = 0
            sliderMax.value = newVal.time.length === 0 ? 1 : newVal.time.length - 1
            console.log('sliderMax>>>', sliderMax.value)
            range.length = 0
            range.push(...[formatCommon(newVal.time[0]), formatCommon(newVal.time.at(-1)!)])
            isDisabled.value = false
        }
    },
    { immediate: true },
)
</script>

<template>
    <div class="animation-control-main">
        <div class="title_main">
            <span class="title">模拟时段：</span>
            <span class="title_content">{{ range[0] }} - {{ range[1] }}</span>
        </div>
        <a-slider
            v-model="current"
            class="slider"
            :min="0"
            :max="sliderMax"
            :disabled="isDisabled"
            :format-tooltip="formatter"
            @change="sliderChange(current)"
        ></a-slider>
        <div class="action-group">
            <!-- 后退 -->
            <a-button type="text" size="large" :disabled="isDisabled" @click="backward">
                <icon-backward />
            </a-button>
            <!-- 播放 -->
            <a-button v-if="!playing" type="text" size="large" :disabled="isDisabled" @click="play">
                <icon-play-circle />
            </a-button>
            <!-- 暂停 -->
            <a-button v-else type="text" size="large" :disabled="isDisabled" @click="pause">
                <icon-pause-circle />
            </a-button>
            <!-- 前进 -->
            <a-button type="text" size="large" :disabled="isDisabled" @click="forward">
                <icon-forward />
            </a-button>
        </div>
        <div class="speed">
            <div class="speed_title">当前速度:</div>
            <a-select class="select-speed" v-model="speedType" :disabled="isDisabled" size="mini">
                <a-option
                    v-for="item in SpeedList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                ></a-option>
            </a-select>
        </div>
        <div class="time_main">
            <span class="time">当前播放:</span>
            <span class="time_content">{{ formatter() }}</span>
        </div>
    </div>
</template>

<style lang="scss">
.animation-control-main {
    position: relative;
    height: 100%;
    width: 100%;
    border-radius: 4px;
    opacity: 1;
    background: var(--color-white);
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    padding: 0 16px;
    .title_main {
        color: rgb(var(--primary-6));
    }
    .slider {
        margin: 0 10px;
        width: 240px;
    }
    .action-group {
        display: flex;
        .arco-btn {
            margin: 0;
            padding: 0 4px;
            color: rgb(var(--primary-6));
            &:hover {
                background-color: transparent;
            }
        }
    }
    .speed {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        flex-wrap: nowrap;
        height: 36px;
        line-height: 36px;
        .speed_title {
            width: 120px;
            text-align: center;
            color: rgb(var(--primary-6));
        }
        .select-speed {
            width: 70px;
            height: 28px;
            margin: 4px 0;
            background-color: transparent;
            color: rgb(var(--primary-6));
            .arco-select-view-suffix {
                color: rgb(var(--primary-6));
            }
            &:hover {
                background-color: transparent;
            }
        }
    }
    .time_main {
        text-align: right;
        margin-top: 0.04rem;
        margin-right: 0.04rem;
        text-align: center;
    }
}
</style>

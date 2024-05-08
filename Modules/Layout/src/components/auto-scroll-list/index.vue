<template>
    <a-list
        ref="$dataList"
        class="auto-scroll-list"
        :max-height="props.maxHeight"
        :bordered="false"
    >
        <!-- 加入一个props.汇总属性,表示需要在前面加入合并单元格 -->
        <a-list-item v-for="(item, index) in props.dataList" :key="item[props.dataKey]">
            <slot name="list-row" :item="item" :index="index">
                {{ item }}
            </slot>
        </a-list-item>
    </a-list>
</template>

<script lang="ts" setup>
import { watch, onUnmounted, onMounted, ref } from 'vue'
import type { List } from '@arco-design/web-vue'
import { Helper } from '@dhicn/helper'
const props = withDefaults(
    defineProps<{
        maxHeight?: number | string
        dataList: Record<string, any>[]
        dataKey: string
    }>(),
    {
        dataList: () => [],
        dataKey: 'id',
    },
)

const maxHeight = ref(800)
const scrollTimer = ref<null | number>(null)
const $wrapper = ref<HTMLDivElement>()
const $dataList = ref<InstanceType<typeof List>>()

const doScroll = () => {
    if (
        props.maxHeight !== undefined &&
        props.dataList.length > 0 &&
        $wrapper.value !== undefined
    ) {
        // logger.debug('warning-card doScroll', warnings.value)
        const $wrapperEl = $wrapper.value as HTMLDivElement
        if (scrollTimer.value) {
            clearTimeout(scrollTimer.value)
            $wrapperEl.scrollTop = 0
        }
        const scroll = () => {
            const scrollHeight = $wrapperEl.scrollHeight
            const clientHeight = $wrapperEl.clientHeight
            const scrollTop = Helper.toFixed($wrapperEl.scrollTop, 0)
            // console.warn('device Height', clientHeight, scrollHeight, scrollTop)
            // 自动滚动
            if (scrollTop + clientHeight >= scrollHeight) {
                $wrapperEl.scrollTop = 0
            } else {
                $wrapperEl.scrollTop += 1
            }
        }
        $wrapper.value.onmouseenter = () => {
            scrollTimer.value && clearTimeout(scrollTimer.value)
        }
        $wrapper.value.onmouseleave = () => {
            scrollTimer.value && clearTimeout(scrollTimer.value)
            scrollTimer.value = window.setInterval(scroll, 50)
        }
        scrollTimer.value = window.setInterval(scroll, 50)
    }
}

watch(
    () => props.dataList,
    () => {
        // logger.debug('warning-card watch', warnings.value)
        doScroll()
    },
)

onUnmounted(() => {
    scrollTimer.value && clearInterval(scrollTimer.value)
})

onMounted(() => {
    if ($dataList.value !== undefined) {
        $wrapper.value = $dataList.value!.$el.querySelector('.arco-list')
        maxHeight.value = $wrapper.value!.getBoundingClientRect().height
        doScroll()
    }
})
</script>
<script lang="ts">
export default {
    name: 'auto-scroll-list',
}
</script>

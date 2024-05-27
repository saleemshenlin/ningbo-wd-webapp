<script setup lang="ts">
import { computed } from 'vue'
import { FilterModelResultRangeTimeDto } from '@/api/tzwd/models'
interface IProps {
    data: FilterModelResultRangeTimeDto[] // 传入的数据
}

const props = withDefaults(defineProps<IProps>(), {
    data: () => [],
})

const status = computed(() => {
    return props.data.length === 0 ? 'success' : 'danger'
})

const content = computed(() => {
    if (status.value === 'success') {
        return '方案模拟结果符合预期要求，管网运行稳定！'
    } else {
        return props.data.map((item, index) => {
            const { modelId, name } = item
            return {
                index,
                modelId,
                name,
            }
        })
    }
})

const style = computed(() => {
    return {
        color: status.value === 'success' ? '#006600' : '#E32636',
        'font-weight': 'bold',
    }
})

// a-popover 修改弹窗的背景颜色
const contentStyle = computed(() => {
    return {
        'background-color': status.value === 'success' ? '#006600' : '#E32636',
    }
})
</script>
<template>
    <a-popover position="right" trigger="click">
        <a-button :status="status"> 模拟报告 </a-button>
        <template #content>
            <a-list size="small" :max-height="300" :scrollbar="true" :bordered="false">
                <a-list-item :style="style" v-if="typeof content === 'string'">
                    {{ content }}
                </a-list-item>
                <a-list-item :style="style" v-else v-for="item in content" :key="item.index!">
                    {{
                        `方案模拟结果中 ${item.name} 段管线压力不稳定或压力不足，请检查监测数据或调整调度模式`
                    }}
                </a-list-item>
            </a-list>
        </template>
    </a-popover>
</template>

<style lang="scss" scoped></style>

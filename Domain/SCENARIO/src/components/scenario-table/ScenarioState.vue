<script setup lang="ts">
import { calcStateMap } from '../../config'
import type { Scenario } from '@dhicn/domain-paas-sdk-ts/scenario-service'
import type { CalculateStatusOutput } from '@dhicn/domain-paas-sdk-ts/model-driver-service'

const props = withDefaults(
    defineProps<{
        record: Scenario | null
        state: CalculateStatusOutput | undefined
    }>(),
    {
        record: null,
        state: undefined,
    },
)

const getStatusById = (id: string) => {
    if (props.state && props.state.scenarioId === id) {
        return props.state.status as number
    } else {
        return 0
    }
}

const getWaitNoById = () => {
    if (props.state && props.state.status === 1) {
        return props.state.waitingNo || 0
    }
    return ''
}
const getProgressById = () => {
    if (props.state && props.state.status === 2) {
        const percent = props.state.progress || 0
        return `${percent}%`
    }
    return ''
}
</script>

<template>
    <a-tag
        v-if="props.record !== null"
        :color="calcStateMap[getStatusById(props.record.id)]?.color"
    >
        {{ calcStateMap[getStatusById(props.record.id)]?.text }}
        {{ getWaitNoById() }}
        {{ getProgressById() }}
    </a-tag>
</template>

<style lang="scss" scoped>
.base-info {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    :deep(.arco-form) {
        margin-right: 35px;
    }
    :deep(.arco-form-item) {
        margin-bottom: 0;
    }
    :deep(.arco-form-item-label) {
        font-size: 17px;
    }
}
</style>

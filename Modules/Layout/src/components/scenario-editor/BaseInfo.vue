<template>
    <div class="scenario-base-info">
        <a-form :model="formData">
            <a-row>
                <a-col :span="8">
                    <a-form-item field="name" :label="labelConfig.scenarioName" required>
                        <a-input
                            v-model="formData.name"
                            :placeholder="labelConfig.scenarioNameTip"
                            :max-length="20"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item field="name" :label="labelConfig.scenarioDate">
                        <a-range-picker
                            showTime
                            :allow-clear="false"
                            :disabled="disableDate"
                            v-model="rangeValue"
                            :value-format="DATE_FORMAT"
                            :disabledDate="(current:any) => dayjs(current).isAfter(dayjs())"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item field="description" :label="labelConfig.scenarioDesc">
                        <a-input
                            v-model="formData.description"
                            :placeholder="labelConfig.scenarioDescTip"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
    </div>
</template>

<script lang="ts" setup>
// eslint-disable-next-line no-unused-vars
import { ref, Ref, watch, reactive, computed } from 'vue'
import dayjs from 'dayjs'
import { IScenarioBaseInfo } from './type'
import { labelConfig, DATE_FORMAT } from './config'

const DEFAULT_START = dayjs().subtract(1, 'day').format(DATE_FORMAT)
const DEFAULT_END = dayjs().format(DATE_FORMAT)

const props = withDefaults(
    defineProps<{
        modelValue: IScenarioBaseInfo
        disableDate?: boolean
    }>(),
    {},
)
const emit = defineEmits(['update:modelValue'])
const formData: IScenarioBaseInfo = reactive({
    name: '', // 方案名称
    description: '', // 方案描述
    startTime: '', // 方案开始时间
    endTime: '', // 方案开始时间
})

const defaultRange = ['', '']
const rangeValue = ref(defaultRange)

watch(
    () => props.modelValue,
    (val) => {
        formData.name = val?.name || ''
        formData.description = val?.description || ''
        formData.startTime = val?.startTime || ''
        formData.endTime = val?.endTime || ''
        rangeValue.value = [val?.startTime || DEFAULT_START, val?.endTime || DEFAULT_END]
    },
    {
        immediate: true,
        deep: true,
    },
)
watch(
    rangeValue,
    () => {
        formData.startTime = rangeValue.value[0]
        formData.endTime = rangeValue.value[1]
    },
    {
        immediate: true,
        deep: true,
    },
)
watch(
    () => formData,
    (val) => {
        emit('update:modelValue', val)
    },
    { immediate: true, deep: true },
)
</script>
<script lang="ts">
export default {
    name: 'scenario-base-info',
}
</script>

<style lang="scss" scoped>
.scenario-base-info {
    margin: 12px 0;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-right: 12px;
    :deep(.arco-form-item) {
        margin-bottom: 0;
    }
    :deep(.arco-form-item-label) {
        white-space: nowrap;
    }
    background-color: var(--color-white);
}
</style>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import {
    IScenarioBaseInfo,
    editScenarioText,
    ScenarioTableState,
    editScenarioNew,
    submitText,
    cancelCommitText,
    cancelText,
} from '../../config'
import type { Scenario } from '@dhicn/domain-paas-sdk-ts/scenario-service'
import ScenarioBaseInfo from './ScenarioBaseInfo.vue'

const props = withDefaults(
    defineProps<{
        state: ScenarioTableState
        scenario: Scenario | null
        saveDisabled: boolean
        cancelDisabled: boolean
        doSave: (basicInfo: IScenarioBaseInfo) => Promise<boolean>
    }>(),
    {
        state: 'new',
        scenario: null,
        saveDisabled: false,
        cancelDisabled: false,
        doSave: () => Promise.resolve(true),
    },
)

const emit = defineEmits(['back', 'changeDate'])
const submitLoading = ref(false)

const scenarioBase = reactive(
    props.state === 'edit'
        ? {
              name: props.scenario!.scenarioName as string,
              description: props.scenario!.description as string,
              date: new Date(props.scenario!.startTime as string).toISOString(),
          }
        : {
              name: '',
              description: '',
              date: new Date().toISOString(),
          },
)

const goBack = () => {
    emit('back', false)
}

const doScenarioDateChange = (newDate: string) => {
    emit('changeDate', newDate)
}

const onSave = async () => {
    submitLoading.value = true
    try {
        const rep = await props.doSave(scenarioBase)
        if (rep) {
            emit('back', true)
        }
    } catch (error) {
        console.error('onSave Scenario :>> ', error)
    } finally {
        submitLoading.value = false
    }
}

const getBreadName = computed(() => {
    return props.state === 'edit' ? props.scenario!.scenarioName : editScenarioNew
})

watch(
    () => scenarioBase.date,
    (newVal, oldVal) => {
        if (newVal !== oldVal) {
            doScenarioDateChange(newVal)
        }
    },
)
</script>

<template>
    <div class="scenario-editor">
        <slot name="header">
            <div class="header">
                <!-- 面包屑 -->
                <a-breadcrumb>
                    <a-breadcrumb-item class="back-item" @click="goBack">
                        {{ editScenarioText }}
                    </a-breadcrumb-item>
                    <a-breadcrumb-item>
                        <span class="navigation_title"> {{ getBreadName }}</span>
                    </a-breadcrumb-item>
                </a-breadcrumb>
                <!-- 基础信息 -->
                <scenario-base-info
                    v-model:name="scenarioBase.name"
                    v-model:date="scenarioBase.date"
                    v-model:description="scenarioBase.description"
                    class="base-info"
                >
                </scenario-base-info>
            </div>
        </slot>
        <slot name="content"> </slot>
        <slot name="footer">
            <div class="footer">
                <a-button
                    type="primary"
                    size="large"
                    @click="onSave"
                    :loading="submitLoading"
                    :disabled="saveDisabled"
                >
                    {{ submitText }}
                </a-button>

                <a-popconfirm
                    :content="cancelCommitText"
                    @ok="goBack"
                    type="warning"
                    position="top"
                >
                    <a-button type="outline" size="large" :disabled="props.cancelDisabled">
                        {{ cancelText }}
                    </a-button>
                </a-popconfirm>
            </div>
        </slot>
    </div>
</template>

<style lang="scss">
@import '../../style.scss';
</style>

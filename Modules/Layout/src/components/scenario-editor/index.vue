<template>
    <div class="scenario-editor">
        <slot name="breadcrumb">
            <a-breadcrumb>
                <a-breadcrumb-item class="back-item" @click="goBack">{{
                    labelConfig.scenarioList
                }}</a-breadcrumb-item>
                <a-breadcrumb-item>{{ breadName }}</a-breadcrumb-item>
            </a-breadcrumb>
        </slot>
        <slot name="base">
            <base-info v-model="formData" :disableDate="disableDate"></base-info>
        </slot>
        <slot name="content"> </slot>
        <slot name="footer">
            <div class="action-btns">
                <a-space size="large">
                    <a-button key="1" @click="goBack">{{ labelConfig.cancelText }}</a-button>
                    <slot name="extraBtn"> </slot>
                    <a-button key="2" type="primary" @click="onConfirm" :loading="submiting">{{
                        props.confirmText ? props.confirmText : labelConfig.saveBtnText
                    }}</a-button>
                </a-space>
            </div>
        </slot>
    </div>
</template>

<script lang="ts" setup>
// eslint-disable-next-line no-unused-vars
import { ref, Ref, watch, reactive, computed } from 'vue'
import { labelConfig } from './config'
import { IScenarioBaseInfo } from './type'
import BaseInfo from './BaseInfo.vue'

const props = withDefaults(
    defineProps<{
        modelValue: IScenarioBaseInfo
        doSave: () => Promise<boolean>
        disableDate?: boolean
        editBread?: string
        confirmText?: string
    }>(),
    {
        scenario: null,
        doSave: () => Promise.resolve(true),
    },
)
const emit = defineEmits(['back', 'update:modelValue'])

const formData: Ref<IScenarioBaseInfo> = ref({ ...props.modelValue })

watch(
    formData,
    (val) => {
        emit('update:modelValue', val)
    },
    {
        deep: true,
    },
)

watch(
    () => props.modelValue,
    (val) => {
        formData.value = val
    },
    {
        immediate: true,
        deep: true,
    },
)

const breadName = computed(() => {
    return props.editBread || labelConfig.newScenario
})

const goBack = () => {
    emit('back', false)
}

const submiting = ref(false)
const onConfirm = () => {
    submiting.value = true
    props.doSave().finally(() => {
        submiting.value = false
    })
}
</script>
<script lang="ts">
export default {
    name: 'scenario-editor',
}
</script>

<style lang="scss" scoped>
.scenario-editor {
    :deep(.back-item) {
        cursor: pointer !important;
    }
    .action-btns {
        margin-top: 12px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>

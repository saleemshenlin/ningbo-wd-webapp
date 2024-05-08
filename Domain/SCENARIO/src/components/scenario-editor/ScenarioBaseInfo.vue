<script setup lang="ts">
import { reactive } from 'vue'
import {
    BaseInfoLimit,
    editNewScenarioText,
    editNewScenarioDescription,
    nameTip,
    descriptionTip,
    scenarioDateText,
} from '../../config'

interface IScenarioBaseInfo {
    name: string // 方案名称
    description: string // 方案描述
    date: string // 方案开始时间
}

const props = withDefaults(defineProps<IScenarioBaseInfo>(), {
    name: '',
    description: '',
    date: new Date().toDateString(),
})
const emit = defineEmits(['update:name', 'update:description', 'update:date'])
const formData: IScenarioBaseInfo = reactive({
    name: props.name || '', // 方案名称
    description: props.description || '', // 方案描述
    date: props.date || new Date().toISOString(),
})

const changeDate = (date: string) => {
    emit('update:date', date)
}
const changeName = (val: string) => {
    emit('update:name', val)
}
const changeDescription = (val: string) => {
    emit('update:description', val)
}
</script>

<template>
    <div class="base-info">
        <a-form :model="formData" size="large">
            <a-row>
                <a-col :span="8">
                    <a-form-item
                        field="name"
                        :label="editNewScenarioText"
                        :rules="[{ required: true, message: '请输入方案名称' }]"
                        label-col-flex="90px"
                        validate-trigger="change"
                    >
                        <a-input
                            v-model="formData.name"
                            :placeholder="nameTip"
                            @change="changeName"
                            :max-length="BaseInfoLimit.max_scenario_name_length"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="4">
                    <a-form-item required :label="scenarioDateText" label-col-flex="90px">
                        <a-date-picker
                            v-model="formData.date"
                            @change="changeDate(formData.date)"
                            :allow-clear="false"
                        ></a-date-picker>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item
                        field="description"
                        :label="editNewScenarioDescription"
                        label-col-flex="120px"
                    >
                        <a-input
                            v-model="formData.description"
                            @change="changeDescription"
                            :placeholder="descriptionTip"
                            :max-length="BaseInfoLimit.max_scenario_description_length"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
    </div>
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

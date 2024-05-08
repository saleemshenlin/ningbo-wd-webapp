<script setup lang="ts">
import { reactive, watch } from 'vue'
import {
    BaseInfoLimit,
    editNewScenarioText,
    editNewScenarioDescription,
    nameTip,
    descriptionTip,
    modelTemplateText,
} from '../../config'
import dayjs from 'dayjs'

interface IScenarioBaseInfo {
    name: string // 方案名称
    description: string // 方案描述
    date: string // 方案开始时间
    modelTemplate?: string // 模型模板
    modelTemplateSources?: Record<string, any>[] // 模型模板数据源
}

const props = withDefaults(defineProps<IScenarioBaseInfo>(), {
    name: '',
    description: '',
    date: new Date().toDateString(),
    modelTemplate: '',
    modelTemplateSources: () => [],
})
const emit = defineEmits([
    'update:name',
    'update:description',
    'update:date',
    'update:modelTemplate',
])
const formData: IScenarioBaseInfo = reactive({
    name: props.name || '', // 方案名称
    description: props.description || '', // 方案描述
    date: props.date || new Date().toISOString(), // 方案日期
    modelTemplate: props.modelTemplate || '', // 模型模板
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
const changeModelTemplate = (val: string) => {
    emit('update:modelTemplate', val)
}

watch(
    () => props.modelTemplate,
    (val) => {
        formData.modelTemplate = val
    },
)
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
                    <a-form-item required label="方案回溯" label-col-flex="90px">
                        <a-date-picker
                            v-model="formData.date"
                            @change="changeDate(formData.date)"
                            :allow-clear="false"
                            :disabledDate="
                                (current:Date | undefined) => dayjs(current).isAfter(dayjs().add(-1, 'day'))
                            "
                        ></a-date-picker>
                    </a-form-item>
                </a-col>
                <a-col :span="4">
                    <a-form-item
                        :label="modelTemplateText"
                        label-col-flex="90px"
                        :rules="[{ required: true, message: '请选择模型模板' }]"
                    >
                        <a-select
                            v-model="formData.modelTemplate"
                            @change="changeModelTemplate(formData.modelTemplate!)"
                            size="small"
                        >
                            <a-option
                                v-for="modelTemplate in modelTemplateSources"
                                :key="modelTemplate.id"
                                :value="modelTemplate.id"
                            >
                                {{ modelTemplate.scenarioName }}
                            </a-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
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

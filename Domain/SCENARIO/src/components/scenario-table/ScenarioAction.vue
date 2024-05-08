<script setup lang="ts">
import { ref } from 'vue'
import type { Scenario } from '@dhicn/domain-paas-sdk-ts/scenario-service'
import type { CalculateStatusOutput } from '@dhicn/domain-paas-sdk-ts/model-driver-service'
import { SecondFormat01 } from '@dhicn/helper/date-formatter'
import dayjs from 'dayjs'
import {
    cancelText,
    calcText,
    editText,
    seeText,
    logText,
    deleteText,
    logTitle,
    noLogTip,
    confirmDelete,
} from '../../config'

const props = withDefaults(
    defineProps<{
        record: Scenario | null
        state: CalculateStatusOutput | undefined
        onAction: (record: Scenario, action: 'run' | 'edit' | 'see' | 'del' | 'cancel') => void
        fetchLog: (record: Scenario) => Promise<string>
        formatType: string
    }>(),
    {
        record: null,
        state: undefined,
        doAction: (record: Scenario) => ({}),
        fetchLog: (record: Scenario) => Promise.resolve(''),
        formatType: SecondFormat01,
    },
)

const logMessage = ref('')
const logLoading = ref(false)

const fetchLog = async () => {
    if (props.record! !== null) {
        try {
            logLoading.value = true
            const message = await props.fetchLog(props.record!)
            try {
                if (!message) return
                logMessage.value =
                    JSON.parse(message)
                        .map((item: any) => {
                            const { Time, Message, ErrorMsg } = item
                            return `${dayjs(Time).format(props.formatType)} : ${
                                ErrorMsg !== '' ? ErrorMsg : Message
                            }`
                        })
                        .join('\n') || ''
            } catch (error) {
                logMessage.value = ''
                console.warn('parse message error', error)
            }
        } catch (error) {
            logMessage.value = ''
        } finally {
            logLoading.value = false
        }
    }
}

const getStatusById = (id: string) => {
    if (props.state && props.state.scenarioId === id) {
        return props.state.status as number
    } else {
        return 0
    }
}

const onLogVisibleChange = (visible: boolean) => {
    if (!visible) {
        logMessage.value = noLogTip
    }
}
</script>
<template>
    <a-space size="small" v-if="props.record !== null">
        <a-link
            type="text"
            size="small"
            @click="
                onAction(
                    props.record!,
                    [1, 2, -3].includes(getStatusById(props.record!.id)) ? 'cancel' : 'run',
                )
            "
            >{{
                [1, 2, -3].includes(getStatusById(props.record!.id)) ? cancelText : calcText
            }}</a-link
        >
        <a-link
            type="text"
            size="small"
            status="success"
            :disabled="[1, 2, -3].includes(getStatusById(props.record!.id))"
            @click="onAction(props.record!, 'edit')"
        >
            {{ editText }}
        </a-link>
        <a-link
            type="text"
            size="small"
            status="success"
            :disabled="getStatusById(props.record!.id) !== 0"
            @click="onAction(props.record!, 'see')"
        >
            {{ seeText }}
        </a-link>
        <a-popover
            position="left"
            :title="logTitle"
            trigger="click"
            :content-style="{ 'max-height': '500px', 'max-width': '300px', 'overflow-y': 'scroll' }"
            @popup-visible-change="onLogVisibleChange"
        >
            <a-link
                type="text"
                size="small"
                :disabled="[1, 3].includes(getStatusById(props.record!.id))"
                @click="fetchLog()"
            >
                {{ logText }}
            </a-link>
            <template #content>
                <a-spin :loading="logLoading">
                    <p style="white-space: pre-line">
                        {{ logMessage || noLogTip }}
                    </p>
                </a-spin>
            </template>
        </a-popover>
        <a-popconfirm :content="confirmDelete" @ok="onAction(props.record!, 'del')">
            <a-link
                type="text"
                size="small"
                status="danger"
                :disabled="[1, 2, -3].includes(getStatusById(props.record!.id))"
                >{{ deleteText }}
            </a-link>
        </a-popconfirm>
    </a-space>
</template>

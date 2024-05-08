<template>
    <div class="edit-table">
        <div class="header">
            <span>{{ props.title }}</span>
            <div>
                <a-space>
                    <slot name="extra-button"></slot>
                    <a-button class="btn-restore" @click="restore" :disabled="props.disabled"
                        >还原</a-button
                    >
                </a-space>
            </div>
        </div>
        <div class="content">
            <a-table
                class="table"
                size="small"
                :columns="props.columns"
                :data="data"
                :row-key="props.rowKey"
                :scroll="{ y: '100%' }"
                :scrollbar="true"
                :span-method="(props.spanMethod as any)"
                :loading="props.loading"
                :pagination="false"
                :virtual-list-props="{ height: '100%' }"
            >
                <template v-for="key in props.keys" :key="key" #[key]="{ record }">
                    <slot name="input" :record="record" :disabled="disabled" :key="key">
                        <a-input-number
                            :disabled="disabled"
                            v-model:modelValue="record[key]"
                        ></a-input-number>
                    </slot>
                </template>
            </a-table>
        </div>
    </div>
</template>
<script lang="ts">
export default {
    name: 'edit-table',
}
</script>
<script setup lang="ts" generic="T  extends TableData">
import type { TableColumnData, TableData } from '@arco-design/web-vue'
import { useEdit } from './useEdit'
const data = defineModel<T[]>({
    required: true,
    default: [],
})
const props = withDefaults(
    defineProps<{
        columns: TableColumnData[]
        spanMethod?: (data: {
            record: TableData
            column: TableColumnData
            rowIndex: number
            columnIndex: number
        }) => void | {
            rowspan?: number | undefined
            colspan?: number | undefined
        }
        keys: string[]
        rowKey: string
        title: string
        disabled: boolean
        loading?: boolean
    }>(),
    {
        columns: () => [],
        keys: () => [],
        data: () => [],
        title: () => '可编辑表格',
        loading: () => false,
        rowKey: 'id',
    },
)

const editor = useEdit<T>(data)

const restore = () => {
    data.value = editor.restore()
}
</script>

<style lang="scss">
.edit-table {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
    > .header {
        height: 30px;
        background-color: var(--color-white);
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
    }
    > .content {
        height: calc(100% - 50px);
        background-color: var(--color-white);
        > .table {
            height: 100%;
        }
    }
}
</style>

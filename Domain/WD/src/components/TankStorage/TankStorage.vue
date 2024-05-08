<script setup lang="ts">
import { ITankStorage } from './type'
import { wDTankStorageTitle } from './config'
import { Helper } from '@dhicn/helper'

interface IProps {
    dataSet: ITankStorage[]
}
const props = withDefaults(defineProps<IProps>(), {
    dataSet: () => [],
})
</script>
<template>
    <div class="wd-tank-storage">
        <div class="title_row">
            <span class="info-title">{{ wDTankStorageTitle }}</span>
        </div>
        <a-divider />
        <a-table size="mini" :pagination="false" :data="props.dataSet">
            <!--  -->
            <template #columns>
                <a-table-column title="名称" data-index="tankName"></a-table-column>
                <a-table-column
                    headerCellClass="headerCellClass"
                    title="总调蓄值"
                    data-index="totalStorageValue"
                    align="right"
                >
                    <template #cell="{ record }">
                        <span class="totalStorageValue">
                            {{ Helper.toFixed(record.totalStorageValue, 0) }}
                        </span>
                    </template>
                </a-table-column>
                <a-table-column title="当前值" data-index="storageValue" align="left">
                    <template #cell="{ record }">
                        {{ Helper.toFixed(record.storageValue, 0) }}
                    </template>
                </a-table-column>
            </template>
        </a-table>
    </div>
</template>
<style lang="scss">
.info-title {
    font-size: 20px;
    line-height: 36px;
    height: 36px;
    padding: 0px 12px;
    background-color: rgb(var(--primary-6));
    color: var(--color-white);
}
.arco-divider-horizontal {
    margin: 4px 0;
}
.totalStorageValue {
    color: rgb(var(--primary-6));
}
.headerCellClass {
    color: rgb(var(--primary-6));
}
</style>

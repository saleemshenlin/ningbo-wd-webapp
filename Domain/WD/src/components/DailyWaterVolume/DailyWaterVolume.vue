<script setup lang="ts">
import { onMounted, reactive, watch } from 'vue'
import { IWaterVolumeData } from './type'
import { Helper } from '@dhicn/helper'
import { DailyWaterVolumeTitle } from './config'

interface IDailyWaterVolume {
    groups: Array<{ id: string; groupName: string }>
    dateSet: Record<string, IWaterVolumeData[]>
}

const props = withDefaults(defineProps<IDailyWaterVolume>(), {
    groups: () => [],
    dateSet: () => ({}),
})

const dataSource = reactive<{
    activeGroup: string
    dataList: IWaterVolumeData[]
}>({
    activeGroup: '',
    dataList: [],
})

const initialize = () => {
    if (props.groups.length > 0) {
        dataSource.activeGroup = props.groups[0].id
        doChange(dataSource.activeGroup)
    }
}

const doChange = (id: string | number | boolean) => {
    const dataList = props.dateSet[id as string]
    if (dataList !== undefined) {
        dataSource.dataList = dataList
    }
}

watch(props.groups, () => {
    initialize()
})

onMounted(() => {
    initialize()
})
</script>

<template>
    <div class="wd-daily-water-volume">
        <div class="title_row">
            <span class="info-title">{{ DailyWaterVolumeTitle }}</span>
            <a-radio-group
                class="group_select"
                v-model="dataSource.activeGroup"
                type="button"
                size="large"
                @change="doChange"
            >
                <a-radio v-for="group in props.groups" :key="group.id" :value="group.id">{{
                    group.groupName
                }}</a-radio>
            </a-radio-group>
        </div>
        <a-divider />
        <div class="data_row">
            <div
                class="data_cell_wrapper"
                v-for="(dataItem, index) in dataSource.dataList"
                :key="dataItem.groupName"
            >
                <a-divider v-if="index > 0" direction="vertical" />
                <div class="data_cell">
                    <div class="title">{{ dataItem.groupName }}</div>
                    <div class="data-value">
                        <span class="forecast">{{ Helper.toFixed(dataItem.forecastValue) }}</span>
                        <a-divider direction="vertical" />
                        <span class="current">{{ Helper.toFixed(dataItem.currentValue) }}</span>
                    </div>
                </div>
            </div>
        </div>
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
.wd-daily-water-volume {
    .arco-divider-horizontal {
        margin: 4px 0;
    }
    .title_row {
        display: inline-block;
        width: 100%;

        .arco-radio-group-button {
            background-color: transparent;
            float: right;
        }
    }

    .data_row {
        display: flex;

        .data_cell_wrapper {
            display: flex;
            flex: 1;
            text-align: center;
            &:first-child {
                text-align: left;
            }
            &:last-child {
                text-align: right;
            }
            .arco-divider-vertical {
                height: calc(100% - 4px);
                margin: 2px;
            }
        }

        .data_cell {
            flex: 1;
            .arco-divider-vertical {
                margin: 0 2px;
                height: 1em;
            }
        }

        .title {
            color: rgb(var(--primary-6));
            margin-bottom: 6px;
        }

        .data-value {
            .forecast {
                color: rgb(var(--primary-6));
            }
        }
    }
}
</style>

<script setup lang="ts">
interface IMapLegendInfo {
    grade?: number
    maxValue?: number
    minValue?: number
    red?: number
    green?: number
    blue?: number
    description?: string | null
}

interface IMapLegend {
    title: string
    unit: string
    data: IMapLegendInfo[]
}
const props = withDefaults(defineProps<IMapLegend>(), {
    title: () => '',
    data: () => [],
})
</script>

<template>
    <div class="map-legend">
        <div class="legend">
            <div class="left-top corner"></div>
            <div class="right-top corner"></div>
            <div class="right-bottom corner"></div>
            <div class="left-bottom corner"></div>
            <div class="legend-title">
                <span> {{ title }}</span>
                <span> {{ unit }}</span>
            </div>
        </div>

        <div class="legend-container">
            <ul v-for="item of props.data" :key="item.grade" class="grade-info-list">
                <li class="grade-info-list_item">
                    <span
                        class="icon"
                        :style="{
                            backgroundColor: `rgb(${item.red}, ${item.green}, ${item.blue})`,
                        }"
                    ></span>
                    <span>{{ item.description }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<style lang="scss">
.legend {
    .legend-title {
        width: 136px;
        height: 40px;
        line-height: 40px;
        background-color: transparent;
        border: 1px dashed rgb(var(--primary-6));
        font-size: 16px;
        display: flex;
        justify-content: space-around;
        margin: 0 1px;
        color: var(--color-text-1);
    }
}
.legend-container {
    width: 136px;
    line-height: 30px;
    background-color: transparent;
    color: var(--color-text-1);
    border: 1px dashed rgb(var(--primary-6));
    .grade-info-list {
        list-style-type: none;
        padding: 0;
        margin: 0;
        .grade-info-list_item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-sizing: border-box;
            margin: 0 8px;
            .icon {
                width: 10px;
                height: 10px;
            }
        }
    }
}
</style>

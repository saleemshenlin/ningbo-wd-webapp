<script setup lang="ts">
import type { LegendItemDto } from '@dhicn/domain-paas-sdk-ts/model-configuration'
import BaseInfoSVG from './assets/ico_base_info.svg'
import FlowSVG from './assets/ico_flow.svg'
import PressureSVG from './assets/ico_pressure.svg'
import VelocitySVG from './assets/ico_velocity.svg'
import HydroChronologySVG from './assets/icon_hydro_chronology.svg'
import { ModelResultBasicType } from '../ResultMap/config'

interface IProps {
    dataSet: LegendItemDto[]
    formatterType?: (typeName: string) => string
}
const props = withDefaults(defineProps<IProps>(), {
    dataSet: () => [],
    formatterType: (typeName: string) => typeName,
})

const emit = defineEmits<{
    (e: 'clickResultItem', typeName: string, dataType: string): void
}>()
const clickResultItem = (typeName: string, dataType: string) => {
    emit('clickResultItem', typeName, dataType)
}

const imgShow = (content: string) => {
    let src = ''
    switch (content) {
        case 'Pressure':
            src = PressureSVG
            break
        case 'Velocity':
            src = VelocitySVG
            break
        case 'Flow':
            src = FlowSVG
            break
        case 'HydroChronology':
            src = HydroChronologySVG
            break
        default:
            src = BaseInfoSVG
            break
    }
    return src
}

const tooltipCSS = {
    color: 'rgba(var(--primary-6), 1)',
    'font-size': '15px',
    'line-height': '10px',
}
</script>
<template>
    <div class="result-item-main">
        <a-menu class="menu-main" mode="vertical" :default-selected-keys="[ModelResultBasicType]">
            <!-- 基本信息 -->
            <a-tooltip
                content="基本信息"
                position="right"
                :content-style="tooltipCSS"
                background-color="transparent"
                content-class="result-item-content"
                arrow-class="result-item-arrow"
            >
                <a-menu-item key="basicInfo" @click="clickResultItem(ModelResultBasicType, '')">
                    <img class="img" :src="imgShow(ModelResultBasicType)" />
                    <div class="menu-item_label">基本信息</div>
                </a-menu-item>
            </a-tooltip>
            <!-- 其他的ResultItem -->
            <a-tooltip
                v-for="menu in props.dataSet"
                :key="menu.typeName!"
                :content="`${menu.description}`"
                position="right"
                :content-style="tooltipCSS"
                background-color="transparent"
                content-class="result-item-content"
                arrow-class="result-item-arrow"
            >
                <a-menu-item @click="clickResultItem(menu.typeName!, menu.modelType!)">
                    <img class="img" :src="imgShow(`${menu.typeName}`)" />
                    <div class="menu-item_label">{{ props.formatterType(menu.typeName!) }}</div>
                </a-menu-item>
            </a-tooltip>
        </a-menu>
    </div>
</template>

<style lang="scss">
.result-item-main {
    position: relative;
    width: 72px;
    height: 100%;
    border-radius: 8px;
    opacity: 1;

    box-sizing: border-box;
    border: 1px solid rgba(var(--primary-6));
    backdrop-filter: blur(10px);
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.3);

    .arco-menu,
    .arco-menu-item,
    .arco-menu-item:hover {
        background-color: transparent;
    }

    .menu-item_label {
        display: none;
    }

    .arco-menu-selected {
        &:hover {
            border-radius: 10px;
        }
        border-radius: 10px;
        opacity: 0.8;
        background-color: transparent;
        box-sizing: border-box;
        border: 1px solid rgba(var(--primary-6));
        // border-image 不支持圆角
        // border-image: linear-gradient(
        //         49deg,
        //         rgba(20, 144, 255, 0.6) 5%,
        //         rgba(255, 255, 255, 0) 117%
        //     )
        //     1;

        backdrop-filter: blur(388px);
    }

    .arco-menu-inner {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 4px;
    }

    .arco-menu-item {
        line-height: 60px;
        width: 62px;
        .img {
            width: 32px;
            height: 32px;
            margin: -10px 2px;
        }
    }
}
</style>

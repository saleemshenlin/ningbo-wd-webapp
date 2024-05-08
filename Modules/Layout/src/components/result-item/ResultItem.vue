<script setup lang="ts">
import BaseInfoSVG from './assets/ico_base_info.svg'
import { computed, ref } from 'vue'

interface LegendItemDto {
    modelType?: string | null
    resultType?: string | null
    typeName?: string | null
    description?: string | null
}
const ModelResultBasicType = 'basicInfo'

const active = ref('COD') // 判断选中项

export interface IProps {
    dataSet: LegendItemDto[]
    iconMap: Map<string, any>
    typeName: (typeName: string) => void
    formatterType?: (typeName: string) => string
    showBaseType: boolean
    showTooltip: boolean
    defaultSelectedKey: string
}
const props = withDefaults(defineProps<IProps>(), {
    dataSet: () => [],
    typeName: () => '',
    iconMap: () => new Map(),
    formatterType: (typeName: string) => typeName,
    showBaseType: true,
    showTooltip: true,
    defaultSelectedKey: ModelResultBasicType,
})

const emit = defineEmits(['clickResultItem'])

const clickResultItem = (typeName: string, dataType: string) => {
    active.value = typeName
    props.typeName(typeName)
    emit('clickResultItem', typeName, dataType)
}

const imgShow = (content: string) => {
    const key = active.value === content ? `${content}-selected` : content
    const src = props.iconMap.get(key)
    return src === undefined ? BaseInfoSVG : src
}

const tooltipCSS = {
    color: 'rgba(var(--primary-6), 1)',
    'font-size': '15px',
    'line-height': '10px',
}

const baseTypeTooltipContent = computed(() => {
    return props.showTooltip ? '基本信息' : ''
})

const otherTypeTooltipContent = computed(() => (description: string) => {
    return props.showTooltip ? description : ''
})
</script>
<template>
    <div class="result-item-main">
        <a-menu
            class="menu-main"
            mode="vertical"
            :default-selected-keys="[props.defaultSelectedKey]"
            v-model="active"
        >
            <!-- 基本信息 -->
            <a-tooltip
                :content="baseTypeTooltipContent"
                position="right"
                :content-style="tooltipCSS"
                background-color="transparent"
                content-class="result-item-content"
                arrow-class="result-item-arrow"
                v-if="props.showBaseType"
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
                :content="otherTypeTooltipContent(menu.description!)"
                position="right"
                :content-style="tooltipCSS"
                background-color="transparent"
                content-class="result-item-content"
                arrow-class="result-item-arrow"
            >
                <a-menu-item
                    :key="menu.typeName"
                    @click="clickResultItem(menu.typeName!, menu.modelType!)"
                >
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
        // border: 1px solid rgba(var(--primary-6));
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

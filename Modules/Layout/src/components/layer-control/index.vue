<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { Ref, ref, watch } from 'vue'
import { isEmpty } from 'lodash'
import { IconClose } from '@arco-design/web-vue/es/icon'
import LayerSVG from './layer.svg'

const emit = defineEmits(['update:checkResult'])
const checkedResult: Ref<string[]> = ref([])
const layerControlVisible = ref(false)

export interface IProps {
    showLayerControl?: boolean
    data: Record<string, any>[]
    color?: string
    checkResult: string[]
    defaultCheckedKeys: string[]
}

const props = withDefaults(defineProps<IProps>(), {
    showLayerControl: false,
    data: () => [],
    color: '#86909C',
    checkResult: () => [],
    defaultCheckedKeys: () => [],
})

/** 图层控制 图片设置 */
const getImageSrc = (node: any) => {
    const list = props.data[0].children === undefined ? props.data : props.data[0].children
    return list.find((item: Record<string, any>) => item.key === node.key)?.image
}

const onClose = () => {
    layerControlVisible.value = false
}

watch(
    () => props.checkResult,
    (val) => {
        checkedResult.value = val
    },
    {
        deep: true,
    },
)

watch(
    () => props.showLayerControl,
    (val) => {
        layerControlVisible.value = props.showLayerControl
    },
    {
        immediate: true,
    },
)

watch(
    () => checkedResult.value,
    (val) => {
        emit('update:checkResult', val)
    },
    {
        deep: true,
    },
)
</script>
<template>
    <div>
        <div class="map-layer-control-btn">
            <slot name="control-button">
                <a-button
                    @click="layerControlVisible = !layerControlVisible"
                    type="text"
                    :style="{
                        opacity: 1,
                        backgroundColor: '#fff',
                    }"
                >
                    <template #icon>
                        <!-- <icon-layers
                        :style="{
                            color: !showLayerControl ? '#4E5969' : '#0BA7A7',
                        }"
                    /> -->
                        <a-image :src="LayerSVG" :preview="false" />
                    </template>
                </a-button>
            </slot>
        </div>

        <div class="map-layer-control-main" v-show="props.showLayerControl">
            <div class="close-button">
                <a-button type="text" @click="onClose">
                    <template #icon>
                        <icon-close :size="20" :style="{ color: props.color }" />
                    </template>
                </a-button>
            </div>

            <a-tree
                :checkable="true"
                v-model:checked-keys="checkedResult"
                :data="props.data"
                :default-checked-keys="props.defaultCheckedKeys"
            >
                <template #extra="nodeData">
                    <img
                        v-if="!isEmpty(getImageSrc(nodeData))"
                        :src="getImageSrc(nodeData)"
                        :style="{
                            width: '20px',
                            height: '20px',
                            position: 'absolute',
                            right: '8px',
                            fontSize: '12px',
                        }"
                    />
                </template>
            </a-tree>
        </div>
    </div>
</template>

<style scoped></style>

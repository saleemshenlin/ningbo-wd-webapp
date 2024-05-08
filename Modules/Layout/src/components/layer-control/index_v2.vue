<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { IconClose, IconEyeInvisible, IconEye } from '@arco-design/web-vue/es/icon'
import LayerSVG from './layer.svg'

//['update:checkedLayers', 'update:controlVisible']
const emit = defineEmits<{
    'update:checkedLayers': [layers: string[]]
    'update:controlVisible': [state: boolean]
}>()

export interface IProps {
    controlVisible?: boolean
    data: Record<string, any>[]
    checkedLayers: string[]
    color?: string
}

const props = withDefaults(defineProps<IProps>(), {
    controlVisible: false,
    data: () => [],
    checkedLayers: () => [],
    color: '#86909C',
})

const toggleChecked = (key: string) => {
    const newArray = [...props.checkedLayers]
    if (props.checkedLayers.includes(key)) {
        const index = props.checkedLayers.indexOf(key)
        newArray.splice(index, 1)
    } else {
        newArray.push(key)
    }
    emit('update:checkedLayers', newArray)
}

const onClose = () => {
    emit('update:controlVisible', false)
}
</script>
<template>
    <div>
        <div class="map-layer-control-main" v-show="props.controlVisible">
            <a-list size="small" :bordered="false">
                <template #header> 图层 </template>
                <a-list-item v-for="item in props.data" :key="item.key">
                    <a-list-item-meta :title="item.title">
                        <template #avatar>
                            <a-avatar shape="square">
                                <img alt="avatar" :src="item.image" />
                            </a-avatar>
                        </template>
                    </a-list-item-meta>
                    <template #actions>
                        <icon-eye
                            v-if="props.checkedLayers.includes(item.key)"
                            @click="toggleChecked(item.key)"
                        />
                        <icon-eye-invisible v-else @click="toggleChecked(item.key)" />
                    </template>
                </a-list-item>
            </a-list>
            <div class="close-button">
                <a-button type="text" @click="onClose">
                    <template #icon>
                        <icon-close :size="20" />
                    </template>
                </a-button>
            </div>
        </div>
        <div class="map-layer-control-btn">
            <slot name="control-button">
                <a-button
                    @click="emit('update:controlVisible', !props.controlVisible)"
                    type="text"
                    :style="{
                        opacity: 1,
                        backgroundColor: '#fff',
                    }"
                >
                    <template #icon>
                        <a-image :src="LayerSVG" :preview="false" />
                    </template>
                </a-button>
            </slot>
        </div>
    </div>
</template>

<style scoped></style>

<script setup lang="ts">
import { IconClose } from '@arco-design/web-vue/es/icon'
import { ref, watch } from 'vue'
import JunctionSvg from './assets/ico_junction.svg'
import PipeSvg from './assets/ico_pipe.svg'
import TankSvg from './assets/ico_tank.svg'
import ValveSvg from './assets/ico_valve.svg'
import DevicePressureSvg from './assets/ico_device_pressure.svg'
import DeviceFlowSvg from './assets/ico_device_flow.svg'
import DeviceEvaluationSvg from './assets/ico_device_evaluation.svg'
import DeviceFactorySvg from './assets/ico_device_factory.svg'
import DmaSvg from './assets/ico_dma.svg'
import { isEmpty } from 'lodash'
// import { MapLayerControlTreeData } from './config'

interface IProps {
    dataSet: any
    onClose: () => void
    iconMap: Map<string, string>
    defaultCheckedKeys: string[]
}
const props = withDefaults(defineProps<IProps>(), {
    dataSet: () => [],
    onClose: () => '',
    iconMap: () => new Map(),
    defaultCheckedKeys: () => [],
})

console.log('props>>', props)
const checkResult = ref<string[]>([])

if (props.defaultCheckedKeys.length > 0) {
    checkResult.value = props.defaultCheckedKeys!
} else {
    checkResult.value = props.dataSet.map((item: any) => item.key)
}

const emit = defineEmits(['change'])

const onCheck = (val: (string | number | boolean)[]) => {
    // console.log('val>>>', val)
    checkResult.value = val as string[]
    // console.log('checkResult>>', checkResult.value)
    emit('change', val)
}

// watch(
//     () => checkResult.value,
//     (val) => {
//         console.log('监听这个变化>>', val)
//         onCheck(checkResult.value)
//     },
// )

watch(
    () => props.defaultCheckedKeys,
    (val) => {
        console.log('监听这个变化 defaultCheckedKeys>>', val)
        onCheck(val)
    },
)

const getImageSrc = (node: any) => {
    // TODO:isLeaf为true时，加载示意图
    // console.log('getImageSrc node >>', node)
    if (props.iconMap.get(node.key) !== undefined) {
        return props.iconMap.get(node.key)
    } else {
        switch (node.key) {
            case 'BASE_JUNCTION':
                return props.iconMap.get('BASE_JUNCTION') === undefined
                    ? JunctionSvg
                    : props.iconMap.get('BASE_JUNCTION')
            case 'BASE_PIPE':
                return node.image === '' ? PipeSvg : node.image
            case 'BASE_TANK':
                return node.image === '' ? TankSvg : node.image
            case 'BASE_VALVE':
                return node.image === '' ? ValveSvg : node.image
            case 'BASE_DEVICE_PRESSURE':
                return node.image === '' ? DevicePressureSvg : node.image
            case 'BASE_DEVICE_FLOW':
                return node.image === '' ? DeviceFlowSvg : node.image
            case 'BASE_DEVICE_EVALUATION':
                return node.image === '' ? DeviceEvaluationSvg : node.image
            case 'BASE_DEVICE_FACTORY':
                return node.image === '' ? DeviceFactorySvg : node.image
            case 'BASE_DMA':
                return DmaSvg
            case 'Diameter800':
            case 'Diameter300':
            case 'Diameter110':
            case 'Diameter25':
            case 'low_risk':
            case 'lower_risk':
            case 'medium_risk':
            case 'higher_risk':
            case 'high_risk':
                return node.image
            default:
                return ''
        }
    }
}
</script>
<template>
    <div class="map-layer-control-main">
        <slot name="cornet" />
        <div class="close-button">
            <a-button type="text" @click="onClose">
                <template #icon>
                    <icon-close :size="20" :style="{ color: '#4AA8FF' }" />
                </template>
            </a-button>
        </div>

        <a-tree
            :checkable="true"
            v-model:checked-keys="checkResult"
            @check="onCheck"
            :data="props.dataSet"
            :defaultCheckedKeys="props.defaultCheckedKeys"
        >
            <template #extra="nodeData">
                <!-- 如果属性中含有color属性,则读取<span></span>,否则读取img -->

                <span
                    v-if="nodeData.color"
                    :style="{
                        backgroundColor: nodeData.color,
                        width: '20px',
                        height: '6px',
                        position: 'absolute',
                        right: '8px',
                        top: '10px',
                    }"
                ></span>

                <img
                    v-if="!isEmpty(getImageSrc(nodeData)) && !nodeData.color"
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
</template>

<style lang="scss">
.map-layer-control-main {
    position: relative;
    width: 218px;
    max-height: 484px;
    opacity: 1;
    border: 2px dotted #4aa8ff;
    background-color: rgba(var(--primary-7));
    z-index: 100;
    .close-button {
        position: absolute;
        right: 5px;
        top: 5px;
    }
    :deep(.arco-tree-node.arco-tree-node-is-tail.arco-tree-node-expanded) {
        width: 150px;
    }
}
</style>

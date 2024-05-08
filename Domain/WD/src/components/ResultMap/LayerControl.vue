<script setup lang="ts">
import { ref } from 'vue'
import MapLayerControl from '../MapLayerControl/MapLayerControl.vue'
import { IconLayers } from '@arco-design/web-vue/es/icon'

interface IProps {
    dataSet: []
    iconMap: Map<string, string>
    defaultCheckedKeys: string[]
}

const props = defineProps<IProps>()

const isMapLayerControlShow = ref(false)

const emit = defineEmits(['update'])

const onCloseMapLayerControl = () => {
    isMapLayerControlShow.value = false
}

const getCheckData = (val: (string | number | boolean)[]) => {
    emit('update', val)
}
</script>
<template>
    <div class="map-layer-control-btn">
        <a-button
            @click="isMapLayerControlShow = !isMapLayerControlShow"
            type="text"
            :style="{
                borderRadius: '8px',
                opacity: 1,
                backgroundColor:
                    'linear-gradient(180deg, rgba(255,255,255,0.60) 0%, rgba(255,255,255,0.40) 41%, rgba(255,255,255,0.00) 122%)',
                border: '1px solid #1490FF',
            }"
        >
            <template #icon>
                <icon-layers
                    :style="{
                        color: '#1490FF',
                    }"
                />
            </template>
        </a-button>
    </div>
    <div class="map-layer-control">
        <map-layer-control
            :on-close="onCloseMapLayerControl"
            @change="getCheckData"
            v-show="isMapLayerControlShow"
            :data-set="props.dataSet"
            :icon-map="props.iconMap"
            :defaultCheckedKeys="props.defaultCheckedKeys"
        >
            <template #cornet>
                <div class="left-top corner"></div>
                <div class="right-top corner"></div>
                <div class="right-bottom corner"></div>
                <div class="left-bottom corner"></div>
            </template>
        </map-layer-control>
    </div>
</template>

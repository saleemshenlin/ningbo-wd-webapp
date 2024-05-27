# 地图控件 By maplibre-gl

## maplibre-gl

-   [maplibre-gl](https://maplibre.org/maplibre-gl-js/docs/)
-   [maplibre Style Spec](https://maplibre.org/maplibre-style-spec/)

## 使用方法

### 1. 添加地图

```vue
<BaseMap
    :config="mapConfig"
    :basic-layers="basicLayers"
    :model-layers="modelLayers"
    :result-set="resultSet"
    v-model:visibleLayers="visibleLayers"
    v-model:loading="loading"
    v-model:highlightIds="highlightIds"
    @load="onRendered"
    @prepare="onPrepare"
></BaseMap>
<script lang="ts" setup>
import { BaseMap } from 'dhi-dss-mf-map-maplibre/base-map'
import 'dhi-dss-mf-map-maplibre/dist/style.css'
</script>
```

### 2. 底图配置

```typescript
import { makeTMapSource } from 'dhi-dss-mf-map-maplibre/source'
export const mapConfig: IMapConfig = {
    source: makeTMapSource('vec', 'cva', 'w', import.meta.env.VITE_APP_MAPTK),
    center: [117.40663, 39.13304],
    zoom: 14,
}
```

### 3. 基础图层

构建 basickLayer 对象，样式可以引用 **'dhi-dss-mf-map-maplibre/style'** 中的通用方法

```typescript
import { makeTMapSource } from 'dhi-dss-mf-map-maplibre/source'
export const basicLayers: IBasicGIS = {
    [图层名]: {
        geojson: JSON.parse(gisQueryApiStore.gisMap.get('pipe')!),
        style: fnSimpleLine({
            id: BASE_PIPE,
            sourceName: BASE_PIPE,
            color: 'rgb(3, 251, 192)',
            highlightColor: '#ff0000',
            width: 4,
        }),// 样式
        withArrow: fnLineCenterImage({
            id: `${BASE_PIPE}_ARROW`,
            sourceName: BASE_PIPE,
            imageName: 'pipe-arrow',
            color: '#fff',
            size: 0.5,
        }),// 是否标注流向
        popup: (f) => {
            return null
        },// 是否点击弹窗，配置了点击会有高亮效果
        fitness: true, // 是否窗口居中
        promoteId: 'Muid', // 唯一标识的属性
    } as IBasicGIS
    },
}
```

### 4. 模拟结果图层

构建 modelLayers 对象，样式可以引用 **'dhi-dss-mf-map-maplibre/style'** 中的通用方法
与 basiclayer 的配置方式相同
配套 resultSet 对象，用于结果播放

```typescript
const resultSet = reactive<IMapResult>({
    resultItem: props.resultItem,
    idList: resultStore.timeSeriesList.iDs!,
    timeList: resultStore.timeSeriesList.time!,
    data: resultStore.timeSeriesList.data!,
    currentIndex: currentIndex.value ?? 0,
    layerId: MODEL_PIPE,
})
```

### 5. 响应事件

```typescript
const emit = defineEmits<{
    load: [map: Map] // 地图加载后触发，用于自定义一些地图功能
    prepare: [map: Map] // 地图加载前触发，用于地图需要的图标
    layerLoad: [layer: string, map: Map] // 图层加载完触发
}>()
```

具体使用方式

```vue
<BaseMap
    :config="mapConfig"
    :basic-layers="basicLayers"
    :model-layers="modelLayers"
    :result-set="resultSet"
    v-model:visibleLayers="visibleLayers"
    v-model:loading="loading"
    v-model:highlightIds="highlightIds"
    @load="onRendered"
    @prepare="onPrepare"
></BaseMap>
<script lang="ts" setup>
import { BaseMap } from 'dhi-dss-mf-map-maplibre/base-map'
import 'dhi-dss-mf-map-maplibre/dist/style.css'
const onRendered = async (map: Map) => {
    // 地图加载后触发，用于自定义一些地图功能
    logger.debug('onRendered', map)
    map.on('click', BASE_PIPE, (e) => {
        doWithProfilePipeClick(e, map)
    })
}

const onPrepare = async (map: Map) => {
    // 地图加载前触发，用于地图需要的图标
    logger.debug('onPrepare', map)
    const image = await map.loadImage(ArrowPNG)
    map.addImage('pipe-arrow', image.data, { sdf: true })
}
</script>
```

### 6. 双向绑定

-   visibleLayers 显示隐藏图层，total 需要控制的列表，checked 需要显示的列表，如果图层不在 total 内则不受控制
-   loading 加载状态，用于控制加载动画
-   highlightIds 高亮要素，string[], “${图层}:${id}”

```typescript
const highlightIds = defineModel<string[]>('highlightIds', { default: [] })
const loading = defineModel<Boolean>('loading', { default: false })
const visibleLayers = defineModel<{ total: string[]; checked: string[] }>('visibleLayers', {
    default: {
        total: [],
        checked: [],
    },
})
```

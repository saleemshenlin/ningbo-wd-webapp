import Graphic from '@geoscene/core/Graphic'
import ArcGISMap from '@geoscene/core/Map'
import FeatureLayer from '@geoscene/core/layers/FeatureLayer'
import GraphicsLayer from '@geoscene/core/layers/GraphicsLayer'
import Point from '@geoscene/core/geometry/Point'
import { DefaultLocationSymbol } from '../symbol/wdSymbol'
export const flyTo = (map: ArcGISMap, layerId: string, positions: number[]): void => {
    const featureLayer = map.findLayerById(layerId) as FeatureLayer
    if (layerId !== 'BASE_PIPE') {
        featureLayer.queryFeatures().then((res) => {
            const graphic = res.features.find((item) => {
                console.log(item)
                const { x, y } = item.geometry as any
                return x === positions[0] && y === positions[1]
            })
            console.log('fly to graphic res>>', graphic)
            if (graphic) {
                console.log(graphic)
                // 删除
                const deleteEdits = {
                    deleteFeatures: [graphic],
                }
                // 添加
                const addEdits = {
                    addFeatures: [graphic],
                }

                // 设置闪烁间隔和次数
                const interval = 500 // 闪烁间隔，以毫秒为单位
                const blinkCount = 6 // 闪烁次数

                let counter = 0
                let visible = true // 隐藏或显示要素
                const timer = setInterval(() => {
                    counter++
                    visible = !visible
                    visible
                        ? featureLayer.applyEdits(addEdits)
                        : featureLayer.applyEdits(deleteEdits)
                    if (counter === blinkCount) {
                        clearInterval(timer)
                    }
                }, interval)
                // 高亮
            } else {
                createAnimationLayer(map, positions)
                // 设置定时器,5秒之后清除图层元素
                clearGraphic(map)
            }
        })
    } else {
        createAnimationLayer(map, positions)
        // 设置定时器,5秒之后清除图层元素
        clearGraphic(map)
    }
}

export const clearGraphic = (map: ArcGISMap): void => {
    setTimeout(() => {
        console.log('定时执行')
        const animationLayer = map.findLayerById('animationLayer') as GraphicsLayer
        animationLayer.graphics.removeAll()
    }, 8000)
}

const createAnimationLayer = (map: ArcGISMap, positions: number[]): void => {
    const animationLayer = map.findLayerById('animationLayer') as GraphicsLayer
    const geometry = new Point({
        x: positions[0],
        y: positions[1],
        spatialReference: { wkid: 4326 },
    })
    const graphic = new Graphic({
        geometry,
        attributes: {},
        symbol: DefaultLocationSymbol,
    })
    if (animationLayer === undefined) {
        const animationLayer = new GraphicsLayer({
            id: 'animationLayer',
        })
        animationLayer.add(graphic)
        map.add(animationLayer)
    } else {
        animationLayer.add(graphic)
    }
}

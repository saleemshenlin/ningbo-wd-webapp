import { ModelResultBasicType, WDModelResultType } from 'dhi-dss-api-store/result-service'
import { ref } from 'vue'

/**
 * 将legend的类型 转成 查询Result的类型
 * @param item
 * @returns
 */
export function transferResultItem(item: string): WDModelResultType {
    const [modelType, typeName] = item.split('_')
    switch (typeName) {
        case 'HydroChronology':
            return 'Average_Water_Age' as any
        default:
            return typeName as any
    }
}

/**
 * 获取对应GIS数据key
 * @param item
 */
export function getResultGISKey(item: string): string {
    const [modelType, typeName] = item.split('_')
    switch (typeName) {
        case 'Pressure':
            return 'wd-junction'
        default:
            return 'wd-pipe'
    }
}

export function useResultItem() {
    const activeItem = ref(ModelResultBasicType)
    const fetchResultItemData = (typeName: string, modelType: string) => {
        activeItem.value = `${modelType}_${typeName}`
        // 获取结果
    }
    return {
        activeItem,
        fetchResultItemData,
    }
}

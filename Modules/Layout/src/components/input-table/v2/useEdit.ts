import { cloneDeep } from 'lodash'
import { Ref, ref, watch } from 'vue'

export const useEdit = <T extends Object>(data: Ref<T[]>) => {
    const cloneData: Ref<T[]> = ref([])

    const restore = () => {
        return cloneDeep(cloneData.value)
    }

    watch(data, (newData) => {
        cloneData.value = cloneDeep(newData)
    })
    return { restore }
}

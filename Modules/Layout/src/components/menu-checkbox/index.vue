<template>
    <div class="menu-checkbox">
        <div v-for="item in reactiveList" :key="item.configType" class="choose-item">
            <div class="label">
                <span> {{ item[muneKey] }}</span>
            </div>
            <div class="check-area">
                <div
                    v-for="config in item[listName] ?? []"
                    :key="config[itemName]"
                    class="check-item"
                >
                    <a-checkbox
                        v-model="config[selectKey]"
                        @change="onSelectChange(config)"
                        :disabled="
                        !!(!config[selectKey] &&
                            max &&
                            max <=
                                item[listName].filter((it: any) => it[selectKey]).length)
                        "
                        >{{ config[itemName] }}</a-checkbox
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
// eslint-disable-next-line no-unused-vars
import { ref, Ref, watch, reactive } from 'vue'
export interface IProps {
    chooseList: Record<string, any>[]
    muneKey: string // 菜单key
    listName: string // 列表名
    itemName: string // 列表项名
    selectKey: string // 进行选择的键名
    max?: number // 最大选择数
}
// eslint-disable-next-line no-unused-vars
const props = withDefaults(defineProps<IProps>(), {})
const emit = defineEmits(['change'])
const reactiveList: Record<string, any>[] = reactive([])

watch(
    () => props.chooseList,
    (val) => {
        reactiveList.splice(0, reactiveList.length, ...val)
    },
)
const onSelectChange = (record: any) => {
    console.log('menu checkbox selected change', record, reactiveList)
    const paload = {
        record,
        list: reactiveList,
    }
    emit('change', paload)
}
</script>
<script lang="ts">
export default {
    name: 'menu-checkbox',
}
</script>

<style lang="scss" scoped>
.menu-checkbox {
    .choose-item {
        display: flex;
        .label {
            box-sizing: border-box;
            padding-top: 10px;
            padding-left: 20px;
            padding-right: 10px;
            display: flex;
            justify-content: space-between;
            width: 200px;
            white-space: nowrap;
            background-color: var(--color-fill-2);
            margin-right: 25px;
            line-height: 28px;
            .icon-circle {
                width: 28px;
                height: 28px;
                object-fit: scale-down;
            }
        }
        .check-area {
            box-sizing: border-box;
            padding-top: 16px;
            display: flex;
            flex-wrap: wrap;
            width: 100%;
            .check-item {
                margin-right: 20px;
                margin-bottom: 10px;
            }
        }
    }
}
</style>

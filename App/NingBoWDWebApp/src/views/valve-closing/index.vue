<template>
    <div class="valve-closing">
        <valve-map class="valve-map"></valve-map>
        <valve-pipe-info
            class="valve-info"
            :query-valve="queryValve"
            :loading="loadingObj"
            :fly-to="flyTo"
        ></valve-pipe-info>
    </div>
</template>
<script setup lang="ts">
import { inject, onMounted, reactive } from 'vue'
import ValvePipeInfo from './valve-pipe-info.vue'
import ValveMap from '@/components/map/valve-map.vue'
import { useValveClosingAnalysisStore } from '@/store/ValveClosingAnalysis'
import { Message } from '@arco-design/web-vue'
import { BurstPipeValvesItem } from '@dhicn/domain-paas-sdk-ts/wd-domain'
import { useAccidentApiStore } from 'dhi-dss-api-store/wd-domain'
import { getActivePinia } from 'pinia'
import { API, ApiHelperExtend } from '@/api/api'

const valveClosingAnalysisStore = useValveClosingAnalysisStore()
const accidentApiStore = useAccidentApiStore(getActivePinia())
const $api = inject(API) as ApiHelperExtend

const id = '5800046e-196d-4cb6-a6ae-1edf57b96ab2'

const loadingObj = reactive({
    loadingPipe: false,
    loadingValve: false,
})

const queryValve = () => {
    if (valveClosingAnalysisStore.valveInfo.pipeTableData.length === 0) {
        Message.warning('已选择管道列表不能为空')
        valveClosingAnalysisStore.isMapEdit = false
    } else {
        loadingObj.loadingValve = true
        const params: BurstPipeValvesItem[] = valveClosingAnalysisStore.valveInfo.pipeTableData.map(
            (item: any) => {
                return {
                    pipeId: item.MUID as string,
                    x: item.x,
                    y: item.y,
                }
            },
        )

        accidentApiStore
            .findValves($api.accident, { items: params })
            .then((res) => {
                console.log('res>>>', res)
                valveClosingAnalysisStore.valveInfo.valveTableData = res
            })
            .finally(() => {
                loadingObj.loadingValve = false
                valveClosingAnalysisStore.isMapEdit = false
            })
    }
}

const flyTo = (props: any) => {
    logger.debug('flyTo', props)
}

onMounted(() => {
    valveClosingAnalysisStore.getValveTimeRangeAndPipeData($api.accident, id as string) // 基本信息和管道列表
    valveClosingAnalysisStore.getValveData($api.accident, id as string) // 阀门列表
})
</script>

<style lang="scss" scoped>
.valve-closing {
    display: flex;
    height: 100%;
    width: 100%;
    .valve-map {
        height: 100%;
        width: 100%;
        flex: 1;
    }
    .valve-info {
        width: 480px;
        height: 100%;
        background-color: #fff;
    }
}
</style>

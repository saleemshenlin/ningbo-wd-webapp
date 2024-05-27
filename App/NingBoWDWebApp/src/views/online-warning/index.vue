<script setup lang="ts">
import ResultMap from '@/components/ResultMap/ResultMap.vue'
import { inject, onMounted, onUnmounted, ref, Ref } from 'vue'
import { API, ApiHelperExtend } from '@/api/api'
import { useAlarmLogApiStore, useOnlineApiStore } from 'dhi-dss-api-store/wd-domain'
import { useLegendApiStore } from 'dhi-dss-api-store/model-Configuration'
import { useOnlineStore } from '@/store/Online'
import { FetchLatestScenarioMinute } from '@/store/Online/config'
import { getActivePinia } from 'pinia'
import { requestAlarmLog } from '@/store/AppStore/config'

const $api = inject(API) as ApiHelperExtend
const alarmStore = useAlarmLogApiStore(getActivePinia())
const wdOnlineStore = useOnlineApiStore(getActivePinia())
const resultStore = useLegendApiStore(getActivePinia())
const onlineStore = useOnlineStore()
const timer = ref(0)
const $resultMap: Ref<InstanceType<typeof ResultMap> | null> = ref(null)

onMounted(async () => {
    await onlineStore.fetchLatestAutoRunScenario($api.scenario.library) // 获得最后一个方案ID
    resultStore.fetchResultItemList($api.global_model_configuration_service.resultItem)
    initialTaskSchedule()
    await fetchOnlineData()
    console.debug('onMounted :>> ', 'page-online_warning')
    doPopupDataUpdate()
})

onUnmounted(() => {
    clearTaskSchedule()
})

const fetchOnlineData = async () => {
    await alarmStore.fetchAlarmLog($api.alarmLog, requestAlarmLog)
    await wdOnlineStore.fetchTankStorage($api.online)
}

const initialTaskSchedule = () => {
    timer.value = window.setInterval(async () => {
        const minutes = new Date().getMinutes()
        console.log('initialTaskSchedule :>> ', minutes, minutes % 10 === 0)
        if (minutes % 10 === 0) {
            // 更新数据 整10分更新数据
            await fetchOnlineData()
            doPopupDataUpdate()
            if (minutes === FetchLatestScenarioMinute) {
                // 20分钟 更新方案
                onlineStore.fetchLatestAutoRunScenario($api.scenario.library)
            }
        }
    }, 60 * 1000)
}

const clearTaskSchedule = () => {
    if (timer.value > 0) {
        clearInterval(timer.value)
    }
}

const doPopupDataUpdate = () => {
    $resultMap.value!.doPopupDataUpdate(wdOnlineStore.tankStorage, onlineStore.dailyWaterVolumeMap)
    $resultMap.value!.doAlarmDataUpdate(alarmStore.latestAlarmMap)
}
</script>

<template>
    <a-layout-content class="app-content page-online_warning">
        <result-map
            ref="$resultMap"
            :scenario="onlineStore.latestScenario"
            :is-online="true"
            @popup-render="doPopupDataUpdate"
        ></result-map>
    </a-layout-content>
</template>

<style lang="scss" scoped>
.page-online_warning {
    height: 100%;
}
.info-panel {
    overflow: auto;
    display: flex;
    flex-direction: column;
    padding: 0rem;
    gap: 0.3125rem;

    & > div {
        // margin-bottom: .5rem;
        &:last-child {
            margin-bottom: 0;
        }
    }
}
</style>

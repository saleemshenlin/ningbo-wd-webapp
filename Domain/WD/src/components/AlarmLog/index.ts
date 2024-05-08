import { App } from 'vue'
import WDAlarmLog from './AlarmLog.vue'
export * from './config'
export * from './type'
export { WDAlarmLog }

export default {
    install(app: App) {
        app.component('WDAlarmLog', WDAlarmLog)
    },
}

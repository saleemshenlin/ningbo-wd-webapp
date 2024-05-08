import { App } from 'vue'
import WDDailyWaterVolume from './DailyWaterVolume.vue'
export * from './config'
export * from './type'
export { WDDailyWaterVolume }

export const LoginModule = {
    install(app: App) {
        app.component('WDDailyWaterVolume', WDDailyWaterVolume)
    },
}

import { App } from 'vue'
import WDDeviceTSData from './DeviceTSData.vue'
export * from './config'
export * from './type'
export { WDDeviceTSData }

export const LoginModule = {
    install(app: App) {
        app.component('WDDeviceTSData', WDDeviceTSData)
    },
}

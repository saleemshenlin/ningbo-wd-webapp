import { App } from 'vue'
import WDLayerControl from './LayerControl.vue'
export * from './config'
export * from './type'
export { WDLayerControl }

export default {
    install(app: App) {
        app.component('WDLayerControl', WDLayerControl)
    },
}

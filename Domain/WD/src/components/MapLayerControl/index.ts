import { App } from 'vue'
import MapLayerControl from './MapLayerControl.vue'
export * from './config'
export * from './type'
export { MapLayerControl }

export const LoginModule = {
    install(app: App) {
        app.component('MapLayerControl', MapLayerControl)
    },
}

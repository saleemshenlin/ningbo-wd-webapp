import { App } from 'vue'
import MapDevicePopup from './MapDevicePopup.vue'
import MapPipePopup from './MapPipePopup.vue'
import MapJunctionPopup from './MapJunctionPopup.vue'
export * from './config'
export { MapDevicePopup, MapPipePopup, MapJunctionPopup }

export const LoginModule = {
    install(app: App) {
        app.component('MapDevicePopup', MapDevicePopup)
        app.component('MapPipePopup', MapPipePopup)
        app.component('MapJunctionPopup', MapJunctionPopup)
    },
}

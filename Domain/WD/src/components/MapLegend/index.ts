import { App } from 'vue'
import MapLegend from './MapLegend.vue'
export { MapLegend }

export const LoginModule = {
    install(app: App) {
        app.component('MapLegend', MapLegend)
    },
}

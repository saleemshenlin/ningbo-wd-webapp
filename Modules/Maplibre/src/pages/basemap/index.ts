import { App } from 'vue'
import BaseMap from './map.vue'

export { BaseMap }

export default {
    install(app: App) {
        app.component('BaseMap', BaseMap)
    },
}

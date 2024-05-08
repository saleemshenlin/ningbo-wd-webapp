import { App } from 'vue'
import DhiDssUFMap from './UFMap.vue'

export { DhiDssUFMap }

export default {
    install(app: App) {
        app.component('DhiDssUFMap', DhiDssUFMap)
    },
}

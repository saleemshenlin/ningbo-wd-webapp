import { App } from 'vue'
import DhiDssValveMap from './ValveMap.vue'

export { DhiDssValveMap }

export default {
    install(app: App) {
        app.component('DhiDssValveMap', DhiDssValveMap)
    },
}

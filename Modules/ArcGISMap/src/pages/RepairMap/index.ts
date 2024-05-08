import { App } from 'vue'
import DhiDssRepairMap from './RepairMap.vue'

export { DhiDssRepairMap }

export default {
    install(app: App) {
        app.component('DhiDssRepairMap', DhiDssRepairMap)
    },
}

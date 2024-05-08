import { App } from 'vue'
import DhiDssRiskMap from './RiskMap.vue'

export { DhiDssRiskMap }

export default {
    install(app: App) {
        app.component('DhiDssRiskMap', DhiDssRiskMap)
    },
}

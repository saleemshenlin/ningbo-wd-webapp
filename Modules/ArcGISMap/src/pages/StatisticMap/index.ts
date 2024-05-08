import { App } from 'vue'
import DhiDssStatisticMap from './StatisticMap.vue'

export { DhiDssStatisticMap }

export default {
    install(app: App) {
        app.component('DhiDssStatisticMap', DhiDssStatisticMap)
    },
}

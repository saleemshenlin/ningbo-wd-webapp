import { App } from 'vue'
import LegendItem from './index.vue'
import LegendItemV2 from './index_v2.vue'
export { LegendItem, LegendItemV2 }

export const LegendModule = {
    install(app: App) {
        app.component('LegendItem', LegendItem)
    },
}

export const LegendModuleV2 = {
    install(app: App) {
        app.component('LegendItemV2', LegendItemV2)
    },
}

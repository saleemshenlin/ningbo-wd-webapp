import { App } from 'vue'
import DhiScenarioEditor from './index.vue'

export { DhiScenarioEditor }

export const LayoutModule = {
    install(app: App) {
        app.component('DhiScenarioEditor', DhiScenarioEditor)
    },
}

import { App } from 'vue'
import ScenarioBaseInfo from './ScenarioBaseInfo.vue'
import ScenarioEditor from './ScenarioEditor.vue'

export { ScenarioBaseInfo, ScenarioEditor }

export const ScenarioModule = {
    install(app: App) {
        app.component('ScenarioBaseInfo', ScenarioBaseInfo)
        app.component('ScenarioEditor', ScenarioEditor)
    },
}

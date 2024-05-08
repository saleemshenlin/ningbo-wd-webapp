import { App } from 'vue'
import ScenarioTable from './index.vue'
import ScenarioTableCompare from './index_v2.vue'
import ScenarioAction from './ScenarioAction.vue'
import ScenarioState from './ScenarioState.vue'

export { ScenarioTable, ScenarioAction, ScenarioState, ScenarioTableCompare }

export const ScenarioModule = {
    install(app: App) {
        app.component('ScenarioTable', ScenarioTable)
        app.component('ScenarioAction', ScenarioAction)
        app.component('ScenarioState', ScenarioState)
        app.component('ScenarioTableCompare', ScenarioTableCompare)
    },
}

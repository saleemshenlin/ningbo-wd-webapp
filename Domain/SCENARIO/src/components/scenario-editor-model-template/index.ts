import { App } from 'vue'
import ScenarioBaseInfoModelTemplate from './ScenarioBaseInfoModelTemplate.vue'
import ScenarioEditorModelTemplate from './ScenarioEditor.vue'

export * from '../../config'
export { ScenarioBaseInfoModelTemplate, ScenarioEditorModelTemplate }

export const ScenarioModule = {
    install(app: App) {
        app.component('ScenarioBaseInfoModelTemplate', ScenarioBaseInfoModelTemplate)
        app.component('ScenarioEditorModelTemplate', ScenarioEditorModelTemplate)
    },
}

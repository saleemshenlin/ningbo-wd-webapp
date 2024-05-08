import { App } from 'vue'
import ResultMap from './ResultMap.vue'
export * from './config'
export * from './type'
export { ResultMap }

export default {
    install(app: App) {
        app.component('ResultMap', ResultMap)
    },
}

import { App } from 'vue'
import ResultMapValve from './ResultMapValve.vue'
export * from './config'
export * from './type'
export { ResultMapValve }

export default {
    install(app: App) {
        app.component('ResultMapValve', ResultMapValve)
    },
}

import { App } from 'vue'
import ResultStatistic from './index.vue'
export * from './config'
export * from './type'
export { ResultStatistic }

export const LoginModule = {
    install(app: App) {
        app.component('ResultStatistic', ResultStatistic)
    },
}

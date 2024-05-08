import { App } from 'vue'
import ResultItem from './ResultItem.vue'
export { ResultItem }

export const LoginModule = {
    install(app: App) {
        app.component('ResultItem', ResultItem)
    },
}

import { App } from 'vue'
import DhiNotFound from './NotFound.vue'

export { DhiNotFound }

export const LayoutModule = {
    install(app: App) {
        app.component('DhiNotFound', DhiNotFound)
    },
}

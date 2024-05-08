import { App } from 'vue'
import DhiMenuCheckbox from './index.vue'

export { DhiMenuCheckbox }

export const LayoutModule = {
    install(app: App) {
        app.component('DhiMenuCheckbox', DhiMenuCheckbox)
    },
}

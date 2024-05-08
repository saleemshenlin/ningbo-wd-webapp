import { App } from 'vue'
import DhiCheckTable from './index.vue'

export { DhiCheckTable }

export const LayoutModule = {
    install(app: App) {
        app.component('DhiCheckTable', DhiCheckTable)
    },
}

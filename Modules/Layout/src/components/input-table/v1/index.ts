import { App } from 'vue'
import DhiInputTable from './index.vue'

export { DhiInputTable }

export const LayoutModule = {
    install(app: App) {
        app.component('DhiInputTable', DhiInputTable)
    },
}

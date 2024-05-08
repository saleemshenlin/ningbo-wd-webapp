import { App } from 'vue'
import DhiLogTable from './index.vue'

export { DhiLogTable }

export const LayoutModule = {
    install(app: App) {
        app.component('DhiLogTable', DhiLogTable)
    },
}

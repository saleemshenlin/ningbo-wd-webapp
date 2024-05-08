import { App } from 'vue'
import AutoScrollList from './index.vue'

export { AutoScrollList }

export const LayoutModule = {
    install(app: App) {
        app.component('AutoScrollList', AutoScrollList)
    },
}

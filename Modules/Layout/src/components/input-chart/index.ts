import { App } from 'vue'
import DhiInputChart from './index.vue'

export { DhiInputChart }

export const LayoutModule = {
    install(app: App) {
        app.component('DhiInputChart', DhiInputChart)
    },
}

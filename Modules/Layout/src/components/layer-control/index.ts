import { App } from 'vue'
import LayerControl from './index.vue'
import LayerControlV2 from './index_v2.vue'
export { LayerControl, LayerControlV2 }

export const LayerControlModule = {
    install(app: App) {
        app.component('LayerControl', LayerControl)
    },
}
export const LayerControlV2Module = {
    install(app: App) {
        app.component('LayerControlV2', LayerControlV2)
    },
}

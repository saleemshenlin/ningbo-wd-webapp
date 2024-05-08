import { App } from 'vue'
import DhiTopNavMenu from './TopNavMenu.vue'

export { DhiTopNavMenu }

export const LayoutModule = {
    install(app: App) {
        app.component('DhiTopNavMenu', DhiTopNavMenu)
    },
}

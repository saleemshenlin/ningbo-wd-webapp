import { App } from 'vue'
import DhiLogo from './SingleLogo.vue'

export { DhiLogo }

export const LayoutModule = {
    install(app: App) {
        app.component('DhiLogo', DhiLogo)
    },
}

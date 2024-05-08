import { App } from 'vue'
import DhiTitleLogo from './TitleWithLogo.vue'

export { DhiTitleLogo }

export const LayoutModule = {
    install(app: App) {
        app.component('DhiTitleLogo', DhiTitleLogo)
    },
}

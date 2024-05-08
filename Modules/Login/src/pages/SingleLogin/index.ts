import { App } from 'vue'
import DhiDssLogin from './SingleLogin.vue'
export { DhiDssLogin }
export const LoginModule = {
    install(app: App) {
        app.component('DhiDssLogin', DhiDssLogin)
    },
}

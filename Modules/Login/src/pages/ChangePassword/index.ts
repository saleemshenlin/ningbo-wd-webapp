import { App } from 'vue'
import DhiDssChangePassword from './ChangePassword.vue'
export { DhiDssChangePassword }
export const LoginModule = {
    install(app: App) {
        app.component('DhiDssChangePassword', DhiDssChangePassword)
    },
}

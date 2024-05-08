import { App } from 'vue'
import DhiDssPhoneLogin from './PhoneLogin.vue'
export { DhiDssPhoneLogin }
export const LoginModule = {
    install(app: App) {
        app.component('DhiDssPhoneLogin', DhiDssPhoneLogin)
    },
}

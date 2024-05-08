import { App } from 'vue'
import DhiDssSystemLogin from './LoginSystemConfiguration.vue'
export { DhiDssSystemLogin }
export const LoginModule = {
    install(app: App) {
        app.component('DhiDssSystemLogin', DhiDssSystemLogin)
    },
}

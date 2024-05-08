import { App } from 'vue'
import TankStorage from './TankStorage.vue'
export * from './config'
export * from './type'
export { TankStorage }

export const LoginModule = {
    install(app: App) {
        app.component('TankStorage', TankStorage)
    },
}

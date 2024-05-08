import { App } from 'vue'
import ProfileMap from './ProfileMap.vue'
export * from './config'
export * from './type'
export { ProfileMap }

export const LoginModule = {
    install(app: App) {
        app.component('ProfileMap', ProfileMap)
    },
}

import { App } from 'vue'
import ProfileData from './ProfileData.vue'
export * from './config'
export { ProfileData }

export const LoginModule = {
    install(app: App) {
        app.component('ProfileData', ProfileData)
    },
}

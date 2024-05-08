import { App } from 'vue'
import AnimationControl from './AnimationControl.vue'
export * from './config'
export { AnimationControl }

export const LoginModule = {
    install(app: App) {
        app.component('AnimationControl', AnimationControl)
    },
}

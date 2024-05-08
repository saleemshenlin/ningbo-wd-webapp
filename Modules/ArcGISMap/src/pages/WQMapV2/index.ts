import { App } from 'vue'
import DhiDssWQMap from './WQMap.vue'

export { DhiDssWQMap }

export default {
    install(app: App) {
        app.component('DhiDssWDMap', DhiDssWQMap)
    },
}

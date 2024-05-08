import { App } from 'vue'
import DhiDssWDMap from './WDMap.vue'

export { DhiDssWDMap }

export default {
    install(app: App) {
        app.component('DhiDssWDMap', DhiDssWDMap)
    },
}

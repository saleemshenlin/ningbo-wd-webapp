import { App } from 'vue'
import ProfileMapChart from './ProfileMapChart.vue'
export { ProfileMapChart }

export const ChartModule = {
    install(app: App) {
        app.component('ProfileMapChart', ProfileMapChart)
    },
}

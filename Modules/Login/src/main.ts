import { createApp } from 'vue'
import App from './App.vue'
import ArcoVue, { Message } from '@arco-design/web-vue'
import '@arco-design/web-vue/dist/arco.css'

// #region initial font-size
const height = document.documentElement.clientHeight
const rate = window.devicePixelRatio
const size = `${(height / 1080) * 100}px`
const logMessage = `window height :>> ${height}; device rate :>> ${rate}; font size :>> ${size}`
console.info(logMessage)
document.documentElement.style.fontSize = size // 90.625 px
// #endregion

const vueApp = createApp(App)

// #region prepare api
// const apiHelper = new ApiHelper()
// apiHelper.changeTenantId('3a060550-6cd1-22fd-10fc-d5f22ad03ef6')
// vueApp.provide(API, apiHelper.api)
// #endregion

vueApp.use(ArcoVue)
Message._context = vueApp._context

vueApp.mount('#app')

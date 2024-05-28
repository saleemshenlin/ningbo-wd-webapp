import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import '@arco-design/web-vue/dist/arco.css'
import { API, apiHelper } from '@/api/api'
import ArcoVue, { Message } from '@arco-design/web-vue'
import { Helper } from '@dhicn/helper'
import { name } from '../package.json'
import localforage from 'localforage'

import 'dhi-dss-domain-wd/dist/style.css'
import 'dhi-dss-mf-layout/dist/style.css'

const logger = new Helper.Logger(name)
window.logger = logger
const height = document.documentElement.clientHeight
const rate = window.devicePixelRatio
const size = `${(height / 1080) * 100}px`
const logMessage = `window height :>> ${height}; device rate :>> ${rate}; font size :>> ${size}`
console.info(logMessage)
document.documentElement.style.fontSize = size // 90.625 px
// #endregion

const pinia = createPinia()
const vueApp = createApp(App)

// #region prepare api

vueApp.provide(API, apiHelper)

// #endregion

// vueApp.use(apolloProvider)

vueApp.use(pinia)
vueApp.use(router).mount('#app')

const { VITE_APP_NAME, VITE_APP_VERSION } = import.meta.env
document.title = VITE_APP_NAME
console.log('App install :>> ', VITE_APP_NAME, document)

vueApp.use(ArcoVue)
Message._context = vueApp._context

localforage.config({
    name: VITE_APP_NAME,
    driver: localforage.INDEXEDDB,
})

export const lfStore = localforage.createInstance({
    name: name,
    storeName: `${VITE_APP_NAME}-store`,
    description: `${VITE_APP_NAME}-store`,
})

localforage.getItem<number>('indexedDB version').then(async (currentVersion) => {
    if (currentVersion === null || currentVersion !== Number(VITE_APP_VERSION)) {
        await lfStore.clear()
        await localforage.setItem<number>('indexedDB version', Number(VITE_APP_VERSION))
    }
    logger.debug(
        `${name} create indexedDB version ${Number(
            VITE_APP_VERSION,
        )}, old version ${currentVersion}`,
    )
})

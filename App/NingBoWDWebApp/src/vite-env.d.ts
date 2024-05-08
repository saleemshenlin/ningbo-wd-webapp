/// <reference types="vite/client" />
import { Helper } from '@dhicn/helper'

declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}

declare global {
    var logger: Helper.Logger
    interface Window {
        logger: Helper.Logger
    }
}

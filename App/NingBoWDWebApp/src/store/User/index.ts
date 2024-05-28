import router from '@/router'
import { ApiHelperExtend } from '@/api/api'
import { IToken, IUser, IRoles, LoginStorage } from 'dhi-dss-mf-login'
import { UserState } from './type'
import { defineStore } from 'pinia'
import { Message } from '@arco-design/web-vue'
import { getAuthFromStorage, tenantInfo } from './config'
import { useProjectStore } from '../Project'
import { useOnlineStore } from '../Online'
import localforage from 'localforage'
import { lfStore } from '@/main'
import { useLegendApiStore } from 'dhi-dss-api-store/model-Configuration'
import { useResult } from '../Result'

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        api: null,
        user: getAuthFromStorage()?.user ?? null,
        token: getAuthFromStorage()?.token ?? null,
        roles: getAuthFromStorage()?.roles ?? null,
        tenantInfo,
    }),
    getters: {
        // 是否处于登陆有效状态
        isLogin(): boolean {
            // logger.debug('isLogin??', this.user, this.token, getAuthFromStorage())
            return (
                !(this.token == null) &&
                !(this.user == null) &&
                this.user?.name === getAuthFromStorage()?.user?.name
            )
        },
        localStorage() {
            // init when first time
            return lfStore
        },
    },
    actions: {
        setAuth(props: { token: IToken; user: IUser; roles: IRoles }, $api: ApiHelperExtend) {
            logger.debug('执行到这里了>', props)
            this.user = props.user
            this.token = props.token
            this.roles = props.roles
            $api.changeTenantId(props.user.tenantId as string)
            $api.setAuth(props.token)
        },
        async logOut(clearStorage = true) {
            try {
                if (clearStorage) {
                    LoginStorage.clearLoginStorage(import.meta.env.VITE_APP_NAME)
                }
                Message.success('退出成功!')
            } catch (error) {
                console.error('logOut error: ', error)
            }
        },

        // api 请求中无权限的登出
        async forbiddenAuthLogout() {
            try {
                LoginStorage.clearLoginStorage(import.meta.env.VITE_APP_NAME)
                await router.replace('/no-found')
            } catch (error) {
                console.error('logOut error: ', error)
            }
        },
        /**
         * 项目初始化之前时进行的动作（页面刷新，登陆等）
         * @param $api
         * @param auth
         */
        async projectInitialization(
            tenantId: string,
            $api?: ApiHelperExtend,
            auth?: { token: IToken; user: IUser; roles: IRoles },
        ) {
            if ($api !== undefined) {
                this.api = $api
            }
            // token和tanetid初始化
            let initAuth = getAuthFromStorage()

            if (auth != null) {
                initAuth = auth
            }
            logger.debug('initAuth', initAuth)
            if (initAuth != null) {
                if (this.api !== null) {
                    if (tenantId !== initAuth.user.tenantId) {
                        initAuth.user.tenantId = tenantId
                    }
                    this.setAuth(initAuth, this.api as ApiHelperExtend)
                    // app挂载前需要准备好的接口数据
                    const onlineStore = useOnlineStore()
                    await onlineStore.fetchLatestAutoRunScenario(
                        (this.api as ApiHelperExtend).api.scenario.library,
                    )
                    const projectStore = useProjectStore()
                    await projectStore.fetchBasicGIS(
                        this.api as ApiHelperExtend,
                        onlineStore.template!,
                    )
                    const resultStore = useResult()
                    await resultStore.getAllResultItem(this.api as ApiHelperExtend)
                }
            } else {
                await router.replace('/login')
            }
            return true
        },
    },
})

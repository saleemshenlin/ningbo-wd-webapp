<script lang="ts" setup>
import { reactive, inject, onBeforeMount } from 'vue'
import { getAuthFromStorage, tenantInfo } from '@/store/User/config'
import { IToken, IUser, IRoles } from 'dhi-dss-mf-login'
import { DhiDssLogin } from 'dhi-dss-mf-login/login'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/User'
import { ApiHelperExtend } from '@/api/api'
import 'dhi-dss-mf-login/dist/style.css'
const router = useRouter()
const tenant = reactive(tenantInfo)
const store = useUserStore()

const $api = inject('API') as ApiHelperExtend

const goToHome = async (props: { token: IToken; user: IUser; roles: IRoles }) => {
    store.projectInitialization(props.user.tenantId!, $api, props).finally(() => {
        router.push('/home/visualization')
    })
}
const getLogOut = () => {
    store.logOut(false)
}

onBeforeMount(async () => {
    const auth = getAuthFromStorage()
    if (store.isLogin && auth) {
        logger.debug('%cauth', 'color:#fff;background:#1677b3;', auth)
        goToHome({ ...auth })
    }
})
</script>

<template>
    <dhi-dss-login
        :tenant="tenant"
        :log-out="getLogOut"
        :base-url="tenant.baseUrl"
        @login="goToHome"
    />
</template>
<style lang="scss" scoped></style>

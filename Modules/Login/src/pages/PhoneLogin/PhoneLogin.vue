<!-- eslint-disable no-unused-vars -->
<script setup lang="ts">
import { Ref, ref, reactive, onMounted, onBeforeMount, watch, onUnmounted } from 'vue'
import {
    DEFAULT_ASSETS_TENANT,
    defaultLoginParameter,
    dhiLogo,
    LOGIN_FORM_RULES,
    userManagementHost,
} from '../../store/config'
import { IconQrcode, IconDesktop, IconSync } from '@arco-design/web-vue/es/icon'
import {
    ILoginConfig,
    ILoginInfo,
    IPhoneLoginParams,
    IUser,
    IPhoneLoginToken,
    IPhoneLoginRes,
    TenantList,
} from '../../store/type'
import icoPwd from '../../assets/icon/vector_pwd.png'
import icoUser from '../../assets/icon/vector_user.png'
import triangleBg from '../../assets/icon/triangle-bg.png'
import { useErrorMessage, useSuccessMessage, useWarningMessage } from '../../helper/message'

import {
    getLoginTimeFromStorage,
    getTenantFromStorage,
    getTokenFromStorage,
    getUserFromStorage,
    getUserNameFromStorage,
    setLoginTimeFromStorage,
    setLogoFromStorage,
    setRolesFromStorage,
    setTenantFromStorage,
    setTenantNameFromStorage,
    setTitleFromStorage,
    setTokenFromStorage,
    setUserFromStorage,
    setUserNameFromStorage,
} from '../../helper/LoginWithStorage'
import { debounce, isEmpty } from 'lodash'
import { ApiHelperExtend } from '../../api/api'
import dayjs from 'dayjs'
import Form, { ValidatedError } from '@arco-design/web-vue/es/form'
import { Message } from '@arco-design/web-vue'
import { loginErrorCheck } from '../../helper/ErrorCheck'
import { AuthResultOutput } from '@dhicn/domain-paas-sdk-ts/identity-service'

export interface ILoginProps {
    appName: string // APP名称（不会改变，和localStorage相关）
    baseUrl: string
    logOut: (state: boolean, forceOut?: boolean) => void
    jumpLoading?: boolean
    enableQR?: boolean // 是否支持二维码登录
    defaultTenantId?: string // 默认租户id （手机登录后会根据接口返回信息重新设置）
}

const props = withDefaults(defineProps<ILoginProps>(), {
    jumpLoading: () => false,
    baseUrl: () => '',
    logOut: (state: boolean, forceOut?: boolean) => state,
    enableQR: () => false,
    defaultTenantId: () => DEFAULT_ASSETS_TENANT.id,
    appName: () => DEFAULT_ASSETS_TENANT.name,
})

const emit = defineEmits<{
    (e: 'login', props: IPhoneLoginRes): void
}>()

const $api = new ApiHelperExtend(props.baseUrl)
const $login: Ref<typeof Form | null> = ref(null)

const loading = ref(false)
const isLogin = ref(false)

const showChooseTenants = ref(false) // 是否展示选择多个租户
const tenantList = ref<TenantList>([]) // 多租户信息
const selectedTenantId = ref('') // 当前选择的租户信息
const loginParamsData = ref<IPhoneLoginParams>({
    username: '',
    password: '',
})

const onTenantIdChange = async (id: string) => {
    console.log('on TenantIdChange', id)
    if (id) {
        showChooseTenants.value = false
        selectedTenantId.value = id
        loginInfo.tenantId = id
        await updateTenantConfig()
        getAccountToken(loginParamsData.value)
    }
}

const loginInfo = reactive<ILoginInfo>({
    username: '',
    password: '',
    autoLogin: true,
    tenantId: props.defaultTenantId || DEFAULT_ASSETS_TENANT.id,
})

const metaConfig = reactive<ILoginConfig>({
    info: defaultLoginParameter,
    icon: dhiLogo,
    logo: dhiLogo,
    coverType: 0,
    cover: dhiLogo,
})
const loginFormRule = ref(LOGIN_FORM_RULES)

// #region page event

const loginWithToken = async (userToken: IPhoneLoginToken) => {
    console.log('login With Token:>> ', userToken)
    if (!userToken) {
        return
    }
    const { tenantId } = userToken
    loginInfo.tenantId = tenantId!
    await updateTenantConfig()
    // @ts-ignore
    setTokenFromStorage(userToken, props.appName)
    //  设置用户权限
    // @ts-ignore
    $api.setAuth(userToken)
    try {
        //  获取用户信息
        const user = await $api.userInfo()
        const roles = await $api.fetchRoles(user.sub)
        // localStorage存储用户信息
        setUserNameFromStorage(user.name, props.appName)
        setUserFromStorage(user, props.appName)
        setLoginTimeFromStorage(new Date(), props.appName)
        if (roles !== null) {
            setRolesFromStorage(roles as Record<string, string>, props.appName)
        }
        // 添加事件
        addUserLoginChecker()
        useSuccessMessage('登录成功！')
        emit('login', {
            token: userToken,
            user,
            roles,
            tenantName: metaConfig.info.titleCN,
            tenantLogo: metaConfig.logo,
        })
        loading.value = false
    } catch (error) {
        console.warn('login With Token err', error)
        loading.value = false
    }
}

const updateTenantList = async (loginParams: IPhoneLoginParams) => {
    return $api.loginApi
        .apiV1LoginTenantsPost(loginParams)
        .then((result) => {
            console.log('update TenantList', result.data)
            return result.data ?? []
        })
        .catch((err) => {
            console.error('update TenantList err', err)
            return false
        })
}

const getAccountToken = async (loginParams: IPhoneLoginParams) => {
    loginParamsData.value = loginParams
    if (!selectedTenantId.value) {
        const tenantListRes = await updateTenantList(loginParams)
        if (typeof tenantListRes === 'boolean' && !tenantListRes) {
            return
        } else {
            tenantList.value = tenantListRes as TenantList
            if (tenantList.value.length === 1) {
                selectedTenantId.value = tenantList.value[0].id as string
                loginInfo.tenantId = tenantList.value[0].id as string
                await updateTenantConfig()
            }
            if (tenantList.value.length > 1) {
                console.warn('该用户存在多个租户，需要选择....')
                showChooseTenants.value = true
                return
            }
        }
    }
    loading.value = true
    $api.loginApi
        .apiV1LoginTokenPost(loginParams)
        .then((result) => {
            const phoneRes = result.data ?? {}
            console.log(phoneRes)
            if (phoneRes && phoneRes.access_token) {
                loginWithToken(phoneRes)
            } else {
                console.error('token获取异常', result)
                loading.value = false
            }
        })
        .catch((err) => {
            loading.value = false
            console.error('getAccount Token >> ', err)
        })
}

const handleSubmit = () => {
    ;($login.value as any).validate((errors: undefined | Record<string, ValidatedError>) => {
        const checked = loginErrorCheck(loginInfo, errors, Message.warning)
        if (checked) {
            getAccountToken({
                username: loginInfo.username,
                password: loginInfo.password,
            })
        }
    })
}

const handleSubmitEnter = (ev: KeyboardEvent) => {
    if (ev.key === 'Enter') {
        handleSubmit()
    }
}

// #region page function

const updateTenantConfig = async () => {
    const tenaId = loginInfo.tenantId
    $api.changeTenantId(tenaId)
    try {
        const getRep = await $api.tenant.apiAppTenantManagerTenantPersonalizedinfoTenantIdGet(
            tenaId,
        )
        const { title, cover, coverType, icon, logo } = getRep.data
        try {
            metaConfig.info = JSON.parse(title) ?? defaultLoginParameter
        } catch (error) {
            console.error('title parse err', error)
        }

        if (isEmpty(metaConfig.info.backgroundColor)) {
            metaConfig.info.backgroundColor = 'transparent'
        }
        metaConfig.cover = (cover as string).replace(userManagementHost, props.baseUrl)
        metaConfig.coverType = coverType as 0 | 1
        metaConfig.icon = (icon || '').replace(userManagementHost, props.baseUrl)
        metaConfig.logo = (logo || '').replace(userManagementHost, props.baseUrl)

        const tName = metaConfig.info.titleCN
        document.title = tName
        setTenantFromStorage(tenaId, props.appName)
        setTenantNameFromStorage(tName, props.appName)
        // set logo
        setLogoFromStorage(metaConfig.logo, props.appName)
        // set title
        setTitleFromStorage(metaConfig.info, props.appName)
        // 设置icon
        const iconEle = document.querySelector('link[rel= "icon"]') as any
        iconEle.href = `${metaConfig.icon}`
        return true
    } catch (error) {
        console.error('update Tenant Config :>> ', error)
        return false
    }
}

// #endregion

// #region life cycle
const storeUserName = getUserNameFromStorage(props.appName) as string
const storeToken = getTokenFromStorage(props.appName) as IPhoneLoginToken
const loginTime = getLoginTimeFromStorage(props.appName) as string

/**
 * check login info from localstorage
 */
const checkStorage = () => {
    if (!isEmpty(storeUserName) || !isEmpty(storeToken)) {
        if (!isEmpty(loginTime)) {
            const newTime = dayjs(loginTime).add(-1, 'day').toDate()
            const Expiration = newTime.getTime()
            const currentTime = new Date().getTime()
            if (currentTime > Expiration) {
                // clearLoginStorage(props.appName)
            } else {
                const storeTenantId = getTenantFromStorage(props.appName) as string
                // @ts-ignore
                $api.setAuth(storeToken)
                $api.changeTenantId(storeTenantId)
                isLogin.value = true
            }
        }
    }
}
checkStorage()

// #region check two user login at same time
const loginUserCheck = (event: StorageEvent) => {
    const user = getUserFromStorage(props.appName)
    const userName = loginInfo.username || (user as IUser).name
    const userNameJSON = JSON.stringify(userName)
    const showError = debounce(() => {
        useWarningMessage('有其他账号登录，如有需要请重新登录！')
        doLogout(true)
    }, 1000)
    if (
        event.key === `${props.appName}-userName` &&
        event.newValue !== null &&
        event.newValue !== userNameJSON
    ) {
        showError()
    }
}

const doLogout = (forceOut = false) => {
    window.removeEventListener('storage', loginUserCheck)
    props.logOut(true, forceOut)
}

/**
 *  添加事件
 */
const addUserLoginChecker = () => {
    console.log('add event: login UserCheck', props.appName)
    window.addEventListener('storage', loginUserCheck)
}

// #endregion

onBeforeMount(async () => {
    console.log('Login App :>> ', props.appName)
    const user = getUserFromStorage(props.appName)
    if (user !== null) {
        // 添加事件
        addUserLoginChecker()
    }
})

onMounted(() => {
    if (isLogin.value) {
        console.log('phone already login ')
        return false
    }
    console.log('phone not login,set default tenant', loginInfo)
    updateTenantConfig()
})
// #endregion

// 扫码登录相关
const isQrMode = ref(false)
const qrCodeUrl = ref('')
const loopTimer: Ref<any> = ref(null)
const showRefresh = ref(false)

const clearTimer = () => {
    if (loopTimer.value) {
        clearInterval(loopTimer.value)
    }
}

const loopQrResult = (filename: string) => {
    showRefresh.value = false
    clearTimer()
    loopTimer.value = setInterval(async () => {
        try {
            const qrAuthRes = await $api.connectApi.apiV1ConnectAuthResultGet(filename)
            console.log('qrAuthRes', qrAuthRes)
            const { data, code, message, status } = qrAuthRes.data as any
            if (!status) {
                console.warn('二维码过期', code, message)
                showRefresh.value = true
                clearTimer()
                return
            }
            const { tokenInfo, state, errMsg, tenantId } = data as AuthResultOutput
            if (state === 3) {
                useErrorMessage(errMsg || '')
                showRefresh.value = true
                clearTimer()
                return
            }
            if (tokenInfo && state === 2) {
                clearTimer()
                const tokenData = { ...tokenInfo, tenantId }
                loginWithToken(tokenData as IPhoneLoginToken)
            }
        } catch (error) {
            console.error('loop QrResult error:>> ', error)
            showRefresh.value = true
            clearTimer()
        }
    }, 1000)
}

const updateQrCode = async () => {
    try {
        const qrRes = await $api.connectApi.apiV1ConnectQrcodeGet({
            responseType: 'blob',
        })
        console.log('qrRes :>> ', qrRes)
        if (qrRes.data as unknown as any) {
            const blobData = qrRes.data as any
            const blob = new Blob([blobData], { type: blobData.type })
            const url = URL.createObjectURL(blob)
            console.log('qr url :>> ', url)
            qrCodeUrl.value = url
            const dispositionArr = qrRes.headers['content-disposition'].split(';')
            console.log('dispositionArr :>> ', dispositionArr)
            const filenameItem = dispositionArr.find((item: string) => item.includes('filename='))
            console.log('filenameItem :>> ', filenameItem)
            const filename = filenameItem?.split('=')[1].replace(/.png/g, '')
            console.log('filename :>> ', filename)
            if (!filename) {
                useErrorMessage('二维码信息异常！')
                return
            }
            loopQrResult(filename)
        }
    } catch (error) {
        console.error('update QrCode error:>> ', error)
    }
}
onUnmounted(() => {
    clearTimer()
})

watch(isQrMode, (val) => {
    if (val) {
        updateQrCode()
    } else {
        clearTimer()
    }
})
</script>

<template>
    <a-layout class="phone_login_container">
        <div
            v-if="metaConfig.coverType === 0"
            :style="{
                width: '100%',
                height: '100%',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundImage: `url('${metaConfig.cover}')`,
            }"
        ></div>
        <div class="system_background">
            <a-layout-content id="login-main">
                <div class="login-content">
                    <div
                        class="login-dhi-pic"
                        :style="{ backgroundColor: metaConfig.info.backgroundColor }"
                    >
                        <h1 class="dss-header-title">
                            <a-image
                                :preview="false"
                                :src="metaConfig.logo"
                                width="120px"
                                hight="120px"
                                fit="scale-down"
                                alt="logo"
                            />
                        </h1>
                        <h2 class="dss-header_title">
                            <span
                                class="title-text"
                                :style="{
                                    color: metaConfig.info.colorCN,
                                    fontSize: `${metaConfig.info.fontSizeCN * 0.01}rem`,
                                    fontFamily: metaConfig.info.fontCN,
                                    lineHeight: `${metaConfig.info.fontSizeCN * 0.01}rem`,
                                }"
                            >
                                {{ metaConfig.info.titleCN }}
                            </span>
                            <span
                                class="title-text"
                                :style="{
                                    color: metaConfig.info.colorCN,
                                    fontSize: `${metaConfig.info.fontSizeEN * 0.01}rem`,
                                    fontFamily: metaConfig.info.fontEN,
                                }"
                            >
                                {{ metaConfig.info.titleEN }}
                            </span>
                        </h2>
                    </div>
                    <div class="login-container">
                        <a-spin :loading="props.jumpLoading" tip="系统登录中...">
                            <div :class="['login-area', props.enableQR ? 'qr-area' : '']">
                                <template v-if="showChooseTenants">
                                    <div class="choose-tenant">
                                        <div class="select-text">请选择租户</div>
                                        <a-list :max-height="210" hoverable :bordered="false">
                                            <a-list-item
                                                v-for="item in tenantList"
                                                :key="item.id"
                                                @click="onTenantIdChange(item.id!)"
                                                >{{ item.name }}</a-list-item
                                            >
                                        </a-list>
                                    </div>
                                </template>
                                <template v-else>
                                    <template v-if="props.enableQR">
                                        <a-tooltip
                                            background-color="#2979FF"
                                            :content="isQrMode ? '账号登录' : '扫码登录'"
                                            position="left"
                                            mini
                                        >
                                            <div
                                                class="switch-corner"
                                                @click="isQrMode = !isQrMode"
                                            >
                                                <img :src="triangleBg" />
                                                <icon-desktop v-if="isQrMode" class="icon-mode" />
                                                <icon-qrcode v-else class="icon-mode" />
                                            </div>
                                        </a-tooltip>
                                    </template>
                                    <div v-if="props.enableQR && isQrMode" class="login-qr">
                                        <div class="qr-title">扫码登录</div>
                                        <div class="qr-tip">
                                            请使用 {{ metaConfig.info.titleCN }}移动端扫码登录
                                        </div>
                                        <div class="qr-wrapper">
                                            <a-image
                                                fit="scale-down"
                                                width="150"
                                                height="150"
                                                :src="qrCodeUrl"
                                            />
                                            <div
                                                class="refresh-cover"
                                                v-if="showRefresh"
                                                @click="updateQrCode"
                                            >
                                                <icon-sync />
                                            </div>
                                        </div>
                                    </div>
                                    <a-form
                                        v-else
                                        ref="$login"
                                        :model="loginInfo"
                                        class="login-form"
                                        :rules="loginFormRule"
                                        :label-col-props="{
                                            span: 0,
                                        }"
                                    >
                                        <div class="form-header" v-if="props.enableQR">
                                            <span>欢迎使用</span>
                                            <span class="sub-title">{{
                                                metaConfig.info.titleCN
                                            }}</span>
                                        </div>
                                        <a-form-item
                                            prop="username"
                                            :rules="[{ required: true }]"
                                            class="login-form-item"
                                        >
                                            <a-input
                                                v-model="loginInfo.username"
                                                placeholder="请输入您的用户名"
                                                autocomplete
                                            >
                                                <template #prepend>
                                                    <img :src="icoUser" class="input-icon" />
                                                    <span class="icon-text">账号：</span>
                                                </template>
                                            </a-input>
                                        </a-form-item>

                                        <a-form-item
                                            prop="password"
                                            :rules="[{ required: true }]"
                                            class="login-form-item"
                                        >
                                            <!--20220414 增加键盘回车-->
                                            <a-input-password
                                                allow-clear
                                                v-model="loginInfo.password"
                                                placeholder="请输入您的密码"
                                                @press-enter="handleSubmitEnter"
                                                autocomplete
                                            >
                                                <template #prepend>
                                                    <img :src="icoPwd" class="input-icon" />
                                                    <span class="icon-text">密码：</span>
                                                </template>
                                            </a-input-password>
                                        </a-form-item>

                                        <a-form-item class="login-form-item">
                                            <a-button
                                                type="primary"
                                                class="el-login"
                                                style="width: 100%"
                                                :loading="loading"
                                                @click="handleSubmit()"
                                            >
                                                登录
                                            </a-button>
                                        </a-form-item>
                                    </a-form>
                                </template>
                            </div>
                        </a-spin>
                    </div>
                </div>
            </a-layout-content>
            <a-layout-footer>
                <p class="copyright-text">版权所有&copy;丹华水利环境技术（上海）有限公司</p>
            </a-layout-footer>
        </div>
    </a-layout>
</template>

<style lang="scss" scoped>
.phone_login_container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    .system_background {
        width: 90%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        position: absolute;
        z-index: 100;
    }

    #login-main {
        display: flex;
        align-items: center;
        justify-content: space-around;
        overflow: hidden;
        width: 100%;
        height: 100%;

        .login-content {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            :deep(.arco-col-19) {
                flex: 1;
                width: 100%;
            }
            .dss-header_title {
                display: flex;
                flex-direction: column;
            }
            .qr-area {
                box-sizing: border-box;
                background-color: #fff;
                display: flex;
                overflow: hidden;
                border: 0.5px solid #a0b1c4;
                border-radius: 8px;
                height: 370px !important;
            }
            .switch-corner {
                position: absolute;
                top: 10px;
                right: 10px;
                width: 60px;
                height: 60px;
                border-radius: 8px;
                overflow: hidden;
                cursor: pointer;
                img {
                    width: 60px;
                    height: 60px;
                    object-fit: scale-down;
                }
                .icon-mode {
                    position: absolute;
                    top: 4px;
                    right: 4px;
                    color: #fff;
                    font-size: 40px;
                }
            }
            .login-container {
                margin-left: 1rem;
            }
            :deep(.arco-spin-mask) {
                border-radius: 8px;
            }
            .login-area {
                box-sizing: border-box;
                position: relative;
                display: flex;
                flex-direction: column;
                width: 360px;
                padding: 70px 40px 40px 40px;
            }
            .choose-tenant {
                .select-text {
                    font-size: 24px;
                    color: #09334b;
                    margin-bottom: 26px;
                }
            }
            .login-qr {
                display: flex;
                flex-direction: column;
                align-items: center;
                .qr-title {
                    font-weight: 700;
                    font-size: 24px;
                    color: #09334b;
                }
                .qr-tip {
                    margin-top: 14px;
                    margin-bottom: 20px;
                    font-size: 14px;
                    line-height: 22px;
                    color: #86909c;
                }
                .qr-wrapper {
                    position: relative;
                    width: 150px;
                    height: 150px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    .refresh-cover {
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        background-color: rgba(0, 0, 0, 0.7);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        color: #fff;
                        font-size: 60px;
                    }
                }
            }
            .login-form {
                .form-header {
                    display: flex;
                    flex-direction: column;
                    color: #09334b;
                    font-weight: 700;
                    font-size: 24px;
                    line-height: 24px;
                    span {
                        margin-bottom: 8px;
                    }
                    .sub-title {
                        font-size: 14px;
                    }
                }
                .login-form-item {
                    margin-top: 15px;
                }
            }
        }

        .login-dhi-pic {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0.3rem;

            .dss-header-title {
                margin-right: 0.2rem;
            }
        }

        .input-icon {
            width: 16px;
            height: 16px;
            vertical-align: middle;
            margin-right: 10px;
            object-fit: scale-down;
        }

        .title-text.cn {
            display: inline-block;
            width: 8.9rem; //5.6rem = 2行
            color: #408ac8;
            font-weight: bold;
            font-size: 0.6rem;
            letter-spacing: 0.03rem;
            -webkit-text-stroke: 0.01rem #fff;
        }
        .title-text.en {
            display: inline-block;
            width: 8.9rem;
            color: #408ac8;
            font-weight: bold;
            font-size: 0.38rem;
            letter-spacing: 0.01rem;
            -webkit-text-stroke: 0.007rem #fff;
        }
    }
}

.input-select {
    width: 2.7rem;
    position: absolute;
    right: 0px;
    top: 0;
    border: 0;
}

.input-select :v-deep {
    .a-input__inner {
        border: 0;
        height: 0.38rem;
    }
}

:v-deep input::-webkit-input-placeholder {
    color: #c9cdd4;
}
:v-deep input::-moz-input-placeholder {
    color: #c9cdd4;
}
:v-deep input::-ms-input-placeholder {
    color: #c9cdd4;
}

.copyright-text {
    color: #fff;
    font-size: 0.16rem;
    line-height: 0.16rem;
    text-align: center;
}
</style>

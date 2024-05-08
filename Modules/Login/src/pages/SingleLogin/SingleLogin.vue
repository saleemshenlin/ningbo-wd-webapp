<script setup lang="ts">
import { Ref, ref, reactive, onMounted, onBeforeMount, watch, onUnmounted } from 'vue'
import {
    CLIENT_ID,
    CLIENT_SECRET,
    defaultLoginParameter,
    defaultTenants,
    dhiLogo,
    GRANT_TYPE,
    LOGIN_FORM_RULES,
    userManagementHost,
} from '../../store/config'
import { IconQrcode, IconDesktop, IconSync } from '@arco-design/web-vue/es/icon'
import { ILoginConfig, ILoginInfo, ITenantOption, IToken, IUser } from '../../store/type'
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
import { ILoginRes } from '../../export'
import { AuthResultOutput } from '@dhicn/domain-paas-sdk-ts/identity-service'

export interface ILoginProps {
    tenant: ITenantOption
    baseUrl: string
    logOut: (state: boolean, forceOut?: boolean) => void
    enableQR?: boolean // 是否支持二维码登录
}

const props = withDefaults(defineProps<ILoginProps>(), {
    baseUrl: () => '',
    tenant: () => defaultTenants[0],
    logOut: (state: boolean, forceOut?: boolean) => state,
    enableQR: () => false,
})

const emit = defineEmits<{
    (e: 'login', props: ILoginRes): void
}>()

const $api = new ApiHelperExtend(props.baseUrl)
const $login: Ref<typeof Form | null> = ref(null)

const loading = ref(false)
const isLogin = ref(false)
const backgroundType: Ref<0 | 1> = ref(0)
const bgImage = ref('')

const loginInfo = reactive<ILoginInfo>({
    username: '',
    password: '',
    autoLogin: true,
    tenantId: '',
})
const config = reactive<ILoginConfig>({
    info: defaultLoginParameter,
    icon: dhiLogo,
    logo: dhiLogo,
    coverType: 0,
    cover: dhiLogo,
})
const loginFormRule = ref(LOGIN_FORM_RULES)

// #region page event
const handleSubmit = () => {
    loading.value = true
    ;($login.value as any).validate((errors: undefined | Record<string, ValidatedError>) => {
        const checked = loginErrorCheck(loginInfo, errors, Message.warning)
        if (checked) {
            getAccountToken({
                username: loginInfo.username,
                password: loginInfo.password,
                tenantId: loginInfo.tenantId,
            })
        } else {
            loading.value = false
        }
    })
}

const handleSubmitEnter = (ev: KeyboardEvent) => {
    if (ev.key === 'Enter') {
        handleSubmit()
    }
}

// #region page function
/**
 * check login info from localstorage
 */
const checkStorage = () => {
    if (!isEmpty(user) || !isEmpty(token)) {
        if (!isEmpty(loginTime)) {
            const newTime = dayjs(loginTime).add(-1, 'day').toDate()
            const Expiration = newTime.getTime()
            const currentTime = new Date().getTime()
            if (currentTime > Expiration) {
                // clearLoginStorage(props.tenant.tenantName)
            } else {
                const tenantId = getTenantFromStorage(props.tenant.tenantName) as string
                $api.setAuth(token)
                $api.changeTenantId(tenantId)
                isLogin.value = true
            }
        }
    }
}

/**
 * TODO set video playbackRate
 */
const setVideoPlay = () => {
    // const video = document.getElementById('video-element') as any;
    //     if (!isEmpty(video)) {
    //         video.playbackRate = 0.6;
    //     }
}

/**
 * set tenant info
 */
const setTenant = async () => {
    console.log('setTenant: tenant>> ', props.tenant)
    console.log('setTenant:>> ', props.tenant.tenantId)
    if (props.tenant.tenantId !== undefined) {
        loginInfo.tenantId = props.tenant.tenantId
        setTenantFromStorage(props.tenant.tenantId, props.tenant.tenantName)
        setTenantNameFromStorage(props.tenant.tenantName, props.tenant.tenantName)
        $api.changeTenantId(props.tenant.tenantId)
        settingBackground()
    }
}

const settingBackground = async () => {
    try {
        await fetchConfig(props.tenant.tenantId)
        // TODO check null
        backgroundType.value = config.coverType
        bgImage.value = config.cover
        document.title = config.info.titleCN
        // set logo
        setLogoFromStorage(config.logo, props.tenant.tenantName)
        // set title
        setTitleFromStorage(config.info, props.tenant.tenantName)

        // 设置icon
        const icon = document.querySelector('link[rel= "icon"]') as any
        icon.href = `${config.icon}`
        console.log('bgImage :>> ', bgImage.value)
    } catch (error) {
        console.error('settingBackground:>> ', error)
    }
}

const loginWithToken = async (userToken: IToken) => {
    console.log('login With Token:>> ', userToken)
    if (!userToken) {
        return
    }
    setTokenFromStorage(userToken, props.tenant.tenantName)
    //  设置用户权限
    $api.setAuth(userToken)
    try {
        //  获取用户信息
        const user = await $api.userInfo()
        const roles = await $api.fetchRoles(user.sub)
        // localStorage存储用户信息
        setUserNameFromStorage(user.name, props.tenant.tenantName)
        setUserFromStorage(user, props.tenant.tenantName)
        setLoginTimeFromStorage(new Date(), props.tenant.tenantName)
        if (roles !== null) {
            setRolesFromStorage(roles as Record<string, string>, props.tenant.tenantName)
        }
        // 添加事件
        addUserLoginChecker()
        useSuccessMessage('登录成功！')
        emit('login', {
            token: userToken,
            user,
            roles,
            tenantInfo: {
                tenantId: props.tenant.tenantId,
                appName: props.tenant.tenantName,
            },
        })
        loading.value = false
    } catch (error) {
        console.warn('login With Token err', error)
        loading.value = false
    }
}

const getAccountToken = async (loginInfo: ILoginInfo) => {
    try {
        // console.log('login form :>> ', loginInfo)
        await $api.logIn(
            loginInfo.tenantId,
            CLIENT_ID,
            GRANT_TYPE,
            CLIENT_SECRET,
            loginInfo.username,
            loginInfo.password,
        )
        const token = $api.apiToken as IToken
        if (token && token.access_token) {
            loginWithToken(token)
        } else {
            // 403/401报错
            loading.value = false
        }
    } catch (err) {
        loading.value = false
        console.error('getAccountToken >> ', err)
    }
}

const fetchConfig = async (tenantId: string) => {
    try {
        const getRep = await $api.tenant.apiAppTenantManagerTenantPersonalizedinfoTenantIdGet(
            tenantId,
        )
        const { title, cover, coverType, icon, logo } = getRep.data
        config.info = JSON.parse(title)
        if (isEmpty(config.info.backgroundColor)) {
            config.info.backgroundColor = 'transparent'
        }
        config.cover = (cover as string).replace(userManagementHost, props.baseUrl)
        config.coverType = coverType as 0 | 1
        config.icon = (icon || '').replace(userManagementHost, props.baseUrl)
        config.logo = (logo || '').replace(userManagementHost, props.baseUrl)
    } catch (error) {
        console.error('fetchConfig :>> ', error)
    }
}

// #endregion

// #region life cycle
const user = getUserNameFromStorage(props.tenant.tenantName) as string
const token = getTokenFromStorage(props.tenant.tenantName) as IToken
const loginTime = getLoginTimeFromStorage(props.tenant.tenantName) as string

checkStorage()

// #region check two user login at same time
const loginUserCheck = (event: StorageEvent) => {
    const user = getUserFromStorage(props.tenant.tenantName)
    const userName = loginInfo.username || (user as IUser).name
    const userNameJSON = JSON.stringify(userName)
    const showError = debounce(() => {
        useWarningMessage('有其他账号登录，如有需要请重新登录！')
        doLogout(true)
    }, 1000)
    if (
        event.key === `${props.tenant.tenantName}-userName` &&
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
    console.log('loginUserCheck >>> add event:', props.tenant.tenantName)
    window.addEventListener('storage', loginUserCheck)
}

// #endregion

onBeforeMount(async () => {
    console.log('Login App :>> ', props.tenant.tenantName)
    const user = getUserFromStorage(props.tenant.tenantName)
    if (user !== null) {
        // 添加事件
        addUserLoginChecker()
    }
})

onMounted(() => {
    if (isLogin.value) {
        return false
    }

    setVideoPlay()
    setTenant()
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
            const { tokenInfo, state, errMsg } = data as AuthResultOutput
            if (state === 3) {
                useErrorMessage(errMsg || '')
                showRefresh.value = true
                clearTimer()
                return
            }
            if (tokenInfo && state === 2) {
                clearTimer()
                console.log('tokenInfo', tokenInfo)
                loginWithToken(tokenInfo as IToken)
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
    <a-layout class="login_container">
        <div
            v-if="backgroundType === 0"
            :style="{
                width: '100%',
                height: '100%',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundImage: `url('${bgImage}')`,
            }"
        ></div>
        <div class="system_background">
            <a-layout-content id="login-main">
                <div class="login-content">
                    <div
                        class="login-dhi-pic"
                        :style="{ backgroundColor: config.info.backgroundColor }"
                    >
                        <h1 class="dss-header-title">
                            <a-image
                                :preview="false"
                                :src="config.logo"
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
                                    color: config.info.colorCN,
                                    fontSize: `${config.info.fontSizeCN * 0.01}rem`,
                                    fontFamily: config.info.fontCN,
                                    lineHeight: `${config.info.fontSizeCN * 0.01}rem`,
                                }"
                            >
                                {{ config.info.titleCN }}
                            </span>
                            <span
                                class="title-text"
                                :style="{
                                    color: config.info.colorCN,
                                    fontSize: `${config.info.fontSizeEN * 0.01}rem`,
                                    fontFamily: config.info.fontEN,
                                }"
                            >
                                {{ config.info.titleEN }}
                            </span>
                        </h2>
                    </div>
                    <div :class="['login-area', props.enableQR ? 'qr-area' : '']">
                        <template v-if="props.enableQR">
                            <a-tooltip
                                background-color="#2979FF"
                                :content="isQrMode ? '账号登录' : '扫码登录'"
                                position="left"
                                mini
                            >
                                <div class="switch-corner" @click="isQrMode = !isQrMode">
                                    <img :src="triangleBg" />
                                    <icon-desktop v-if="isQrMode" class="icon-mode" />
                                    <icon-qrcode v-else class="icon-mode" />
                                </div>
                            </a-tooltip>
                        </template>
                        <div v-if="props.enableQR && isQrMode" class="login-qr">
                            <div class="qr-title">扫码登录</div>
                            <div class="qr-tip">请使用 {{ config.info.titleCN }}移动端扫码登录</div>
                            <div class="qr-wrapper">
                                <a-image
                                    fit="scale-down"
                                    width="150"
                                    height="150"
                                    :src="qrCodeUrl"
                                />
                                <div class="refresh-cover" v-if="showRefresh" @click="updateQrCode">
                                    <icon-sync />
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            <a-form
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
                                    <span class="sub-title">{{ config.info.titleCN }}</span>
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
                        </div>
                    </div>
                </div>
            </a-layout-content>
            <a-layout-footer>
                <p class="copyright-text">版权所有&copy;丹华水利环境技术（上海）有限公司</p>
            </a-layout-footer>
        </div>
    </a-layout>
</template>

<style lang="scss">
.login_container {
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
            .arco-col-19 {
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
            .login-area {
                box-sizing: border-box;
                position: relative;
                display: flex;
                flex-direction: column;
                margin-left: 1rem;
                width: 360px;
                padding: 70px 40px 40px 40px;
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

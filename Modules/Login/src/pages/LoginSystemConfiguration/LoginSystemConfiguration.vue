<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { onBeforeMount, reactive, Ref, ref } from 'vue'
import Form, { ValidatedError } from '@arco-design/web-vue/es/form'
import { Message } from '@arco-design/web-vue'
import { ILoginInfo, ILoginRes } from '../../store/type'
import { ApiHelperExtend } from '../../api/api'
import {
    getUserFromStorage,
    setAppNameFromStorage,
    setLoginTimeFromStorage,
    setRolesFromStorage,
    setSystemFromStorage,
    setTenantFromStorage,
    setTenantNameFromStorage,
    setTokenFromStorage,
    setUserFromStorage,
    setUserNameFromStorage,
} from '../../helper/LoginWithStorage'
import { useSuccessMessage, useWarningMessage } from '../../helper/message'
import { loginErrorCheck } from '../../helper/ErrorCheck'
import {
    CLIENT_ID,
    CLIENT_SECRET,
    defaultLoginInfo,
    defaultLoginParameter,
    GRANT_TYPE,
} from '../../store/config'
import { IToken, IUser } from '../../export'
import { debounce } from 'lodash'
import {
    FunctionDto,
    GetSystemsOutput,
    GetTenantsBySysOutput,
    TenantPersonalizedInfoDto,
} from '@dhicn/domain-paas-sdk-ts/identity-service'
import { GetCustomOutput, GetTenantsOutput } from '@dhicn/domain-paas-sdk-ts/identity-service'
import { getLabelConfigFunc } from './config'

interface IProp {
    logOut: (state: boolean) => void
    appName: string
    baseUrl?: string
    isLangShow?: boolean
    currentLang?: string
}
const props = withDefaults(defineProps<IProp>(), {
    logOut: (state: boolean) => state,
    appName: () => defaultLoginParameter.titleCN,
    baseUrl: () => '',
    isLangShow: false,
    currentLang: 'zh-CN',
})

// 系统列表
const systemList: Ref<GetSystemsOutput[]> = ref([])
// 租户列表
const tenantList: Ref<GetTenantsBySysOutput[]> = ref([])
// 租户个性化
const tenantPerson: Ref<TenantPersonalizedInfoDto> = ref({
    title: '',
    icon: '',
    logo: '',
})
const loading = ref(false)
const $login: Ref<typeof Form | null> = ref(null)

const $api = new ApiHelperExtend(props.baseUrl)
const loginInfo = reactive<ILoginInfo>({ ...defaultLoginInfo })
const customList: Ref<GetCustomOutput[]> = ref([])
const customTenantList: Ref<GetTenantsOutput[]> = ref([])
const custom_id = ref('')

const emit = defineEmits<{
    (e: 'loginRes', props: ILoginRes): void
}>()

const changeSystem = async (id: any) => {
    console.log('changeSystem:>>>>>:', id)
    // await getTenantInfo(id)
    await getTenantIdByCustomId(id)
}

const changeTenant = async (id: any) => {
    console.log('changeTenant:>>>>>:', id)
    setTenant(id)

    await getTenantPersonalizedInfo(id)
}

/**
 * 提交按钮
 */
const handleSubmit = () => {
    loading.value = true
    ;($login.value as any).validate((errors: undefined | Record<string, ValidatedError>) => {
        const checked = loginErrorCheck(loginInfo, errors, Message.warning)
        if (checked) {
            getAccountToken({
                username: loginInfo.username,
                password: loginInfo.password,
                tenantId: loginInfo.tenantId,
                system: loginInfo.system,
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

const getAccountToken = async (loginInfo: ILoginInfo) => {
    try {
        // const system = systemList.value.find((item) => item.id === (loginInfo.system as string))
        await $api.logIn(
            loginInfo.tenantId,
            CLIENT_ID,
            GRANT_TYPE,
            CLIENT_SECRET,
            loginInfo.username,
            loginInfo.password,
        )
        const token = $api.apiToken as IToken
        if (token) {
            const result = token
            setTokenFromStorage(result, props.appName)
            if (result !== null) {
                $api.setAuth(result)
                const user = await $api.userInfo()
                const roles = await $api.fetchRoles(user.sub)
                const tenantInfo = { tenantId: loginInfo.tenantId, appName: props.appName }
                const system = await getBusinessType()
                setUserFromStorage(user, props.appName)
                setSystemFromStorage(system[0] as Record<string, string>, props.appName)
                setLoginTimeFromStorage(new Date(), props.appName)
                // 加入传入App的名称
                setAppNameFromStorage(props.appName, props.appName)
                if (roles !== null) {
                    setRolesFromStorage(roles as Record<string, string>, props.appName)
                }
                // 添加事件
                addUserLoginChecker()
                useSuccessMessage(`${props.currentLang === 'zh-CN' ? '登录成功' : 'Login Success'}`)
                emit('loginRes', {
                    token,
                    user,
                    roles,
                    tenantInfo,
                    system: system[0],
                    customId: custom_id.value,
                })

                loading.value = false
            }
        } else {
            loading.value = false
            // 清空
        }
    } catch (error) {
        loading.value = false
        console.error('getAccountToken >> ', error)
    }
}

// 设置tenantId
const setTenant = async (tenantId: string) => {
    if (tenantId !== undefined) {
        setTenantFromStorage(tenantId, props.appName)
        setTenantNameFromStorage(tenantId, props.appName)
        loginInfo.tenantId = tenantId
        $api.changeTenantId(tenantId)
        // settingBackground()
    }
}

// 获得所有系统列表 - 弃用
const getSystem = async () => {
    try {
        systemList.value = []
        // const res = await $api.tenant.apiAppTenantManagerSystemsGet()
        const res = await $api.tenant.apiAppTenantManagerSystemsWithTypeGet() // 12-15 更新接口
        if (res.data.length > 0) {
            systemList.value = res.data
            loginInfo.system = systemList.value[0].id
            await getTenantInfo(loginInfo.system as string)
        } else {
            useWarningMessage(
                `${props.currentLang === 'zh-CN' ? '未找到系统!' : 'System not found'}`,
            )
        }
    } catch (error) {
        console.log(error)
    }
}

// 获得租户信息
const getTenantInfo = async (systemId: string) => {
    try {
        tenantList.value = []
        const res = await $api.tenant.apiAppTenantManagerTenantsBySystemIdSystemIdGet(systemId)
        tenantList.value = res.data
        console.log('tenantList', tenantList.value)
    } catch (error) {
        console.log(error)
    }
}

// 获取租户个性化信息
const getTenantPersonalizedInfo = async (tenantId: string) => {
    try {
        tenantPerson.value = { title: '', icon: '', logo: '' }
        const res = await $api.tenant.apiAppTenantManagerTenantPersonalizedinfoTenantIdGet(tenantId)
        const { title, icon, logo } = res.data
        tenantPerson.value = {
            title,
            icon,
            logo,
        }
    } catch (error) {
        console.log(error)
    }
}

/** 获得客户列表  */
const getCustomList = async () => {
    const res = await $api.customManagerApi.apiV1CustomListGet()
    customList.value = res.data || []
    console.log('getCustomList', customList.value)
    if (customList.value.length > 0) {
        loginInfo.system = customList.value[0].id
    }
}

/** 获得客户列表下的租户id */
const getTenantIdByCustomId = async (customId: string) => {
    // 清空头文件中Tenantid
    $api.changeTenantId('')
    custom_id.value = customId
    const res = await $api.tenant.apiV1TenantListTenantsByCustomGet(customId)
    console.log('getTenantIdByCustomId', res)
    customTenantList.value = res.data || []
    if (customTenantList.value.length > 0) {
        loginInfo.tenantId = customTenantList.value[0].id as string
    }

    console.log('默认的tenantId', loginInfo.tenantId)
}
/** 获得businessType */
const getBusinessType = async () => {
    const res = await $api.tenant.apiV1TenantFunctionsGet()
    console.log('getBusinessType', res.data)
    return res.data as FunctionDto[]
}

// #region check two user login at same time
const loginUserCheck = (event: StorageEvent) => {
    const user = getUserFromStorage(props.appName)
    const userName = loginInfo.username || (user as IUser).name
    const userNameJSON = JSON.stringify(userName)
    const showError = debounce(() => {
        // 有其他账号登录，如有需要请重新登录！
        useWarningMessage(
            `${props.currentLang === 'zh-CN' ? '有其他账号登录' : 'Other account login'}`,
        )
        doLogout()
    }, 1000)
    if (
        event.key === `${props.appName}-userName` &&
        event.newValue !== null &&
        event.newValue !== userNameJSON
    ) {
        showError()
    }
}

const doLogout = () => {
    window.removeEventListener('storage', loginUserCheck)
    props.logOut(true)
}

/**
 *  添加事件
 */
const addUserLoginChecker = () => {
    console.log('loginUserCheck >>> add event:', props.appName)
    window.addEventListener('storage', loginUserCheck)
}

// #endregion

onBeforeMount(async () => {
    console.log('Login App :>> ', props.appName)
    // await getSystem()
    await getCustomList() //  获得客户信息
    await getTenantIdByCustomId(loginInfo.system as string)
    const user = getUserFromStorage(props.appName)
    if (user !== null) {
        // 添加事件
        addUserLoginChecker()
    }
})
</script>

<template>
    <div
        class="container"
        style="
            height: 100%;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-content: center;
            /* background-image: url('/images/bg.jpg'); */
            background-size: 100% 100%;
            background-attachment: fixed;
        "
    >
        <!-- 加入插槽 用于显示多语言 -->

        <div class="content" style="margin: auto">
            <a-form ref="$login" :model="loginInfo" :style="{ width: '600px' }">
                <a-form-item
                    field="system"
                    :label="getLabelConfigFunc('custom', props.currentLang).label"
                    :rules="[
                        {
                            required: true,
                            message: `${getLabelConfigFunc('custom', props.currentLang).rules}`,
                        },
                    ]"
                >
                    <a-select v-model="loginInfo.system" @change="changeSystem">
                        <a-option
                            :value="item.id!"
                            :key="item.id"
                            :label="item.name!"
                            v-for="item in customList"
                        >
                            {{ item.name! }}
                        </a-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    field="tenantId"
                    :label="getLabelConfigFunc('tenantId', props.currentLang).label"
                    :rules="[
                        {
                            required: true,
                            message: `${getLabelConfigFunc('tenantId', props.currentLang).rules}`,
                        },
                    ]"
                >
                    <a-select v-model="loginInfo.tenantId" @change="changeTenant">
                        <a-option
                            :value="item.id!"
                            :key="item.id"
                            :label="item.name!"
                            v-for="item in customTenantList"
                        >
                            {{ item.name! }}
                        </a-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    field="username"
                    :label="getLabelConfigFunc('username', props.currentLang).label"
                    :rules="[
                        {
                            required: true,
                            message: `${getLabelConfigFunc('username', props.currentLang).rules}`,
                        },
                    ]"
                >
                    <a-input
                        v-model="loginInfo.username"
                        :placeholder="getLabelConfigFunc('username', props.currentLang).rules"
                    >
                    </a-input>
                </a-form-item>
                <a-form-item
                    field="password"
                    :label="getLabelConfigFunc('password', props.currentLang).label"
                    :rules="[
                        {
                            required: true,
                            message: `${getLabelConfigFunc('password', props.currentLang).rules}`,
                        },
                    ]"
                >
                    <a-input-password
                        v-model="loginInfo.password"
                        :placeholder="getLabelConfigFunc('password', props.currentLang).rules"
                        @press-enter="handleSubmitEnter"
                    ></a-input-password>
                </a-form-item>
                <a-form-item>
                    <a-space>
                        <a-button
                            type="primary"
                            class="el-login"
                            style="width: 3rem"
                            :loading="loading"
                            @click="handleSubmit()"
                        >
                            {{ props.currentLang === 'zh-CN' ? '登录' : 'Login' }}
                        </a-button>
                        <div class="lang" v-if="isLangShow"><slot name="lang" /></div>
                    </a-space>
                </a-form-item>
            </a-form>
        </div>

        <div class="footer" style="font-size: 20px; text-align: center">
            <p>
                {{
                    props.currentLang === 'zh-CN'
                        ? '版权所有&copy;丹华水利环境技术（上海）有限公司'
                        : 'All Rights Reserved&copy;DHI (Shanghai) Water & Environment Technology Co., Ltd.'
                }}
            </p>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100%;
    display: flex;
    background-color: red;
    .content {
        width: 40vmin;
        height: 40vmin;
        margin: auto !important;
    }
    .footer {
        font-size: 20px;
        text-align: center;
    }
}
</style>

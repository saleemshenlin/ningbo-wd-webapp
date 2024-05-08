<template>
    <div class="password-content">
        <h2>修改密码</h2>
        <a-form
            ref="formComponent"
            auto-label-width
            :model="data.form"
            :style="{ width: '450px' }"
            @submit="handleSubmit"
        >
            <a-form-item
                field="old"
                label="当前密码:"
                :rules="[{ required: true, message: '当前密码必填' }]"
                :validate-trigger="['input', 'change']"
            >
                <a-input-password v-model="data.form.old" placeholder="请输入旧密码" />
            </a-form-item>
            <a-form-item
                field="new"
                label="新密码:"
                :rules="[
                    { required: true, message: '新密码必填' },
                    { validator: isSameWithOldPassword },
                ]"
                :validate-trigger="['input', 'change']"
            >
                <a-input-password v-model="data.form.new" placeholder="请输入新密码" />
            </a-form-item>
            <a-form-item
                field="confirm"
                label="确认密码:"
                :rules="[
                    { required: true, message: '确认密码必填' },
                    { validator: isSameWithNewPassword },
                ]"
                :validate-trigger="['input', 'change']"
            >
                <a-input-password
                    v-model="data.form.confirm"
                    placeholder="请再次输入新密码"
                    @press-enter="handleSubmit"
                />
            </a-form-item>
            <a-form-item>
                <a-button type="primary" html-type="submit">确定</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>

<!-- eslint-disable n/no-callback-literal -->
<script lang="ts" setup>
import { Form, Message } from '@arco-design/web-vue'
import { onMounted, reactive, ref } from 'vue'
import { ApiHelperExtend } from '../../api/api'
import { ILoginRes, PasswordItem } from '../../store/type'
import { ChangePasswordInput } from '@dhicn/domain-paas-sdk-ts/identity-service'

interface IProp {
    logOut: (state: boolean) => void
    loginInfo: ILoginRes
}

const props = withDefaults(defineProps<IProp>(), {
    logOut: (state: boolean) => state,
})

const $api = new ApiHelperExtend(props.loginInfo.tenantInfo.baseUrl)
// console.log('ChangePassword :>> ', props.loginInfo)
if (props.loginInfo !== undefined) {
    $api.changeTenantId(props.loginInfo.tenantInfo.tenantId)
    $api.setAuth(props.loginInfo.token)
}

const formComponent = ref<InstanceType<typeof Form> | null>(null)
const data = reactive({
    form: {} as PasswordItem,
    userInfo: {} as any,
})

const isSameWithOldPassword = (value: string, callback: (error?: string) => void) => {
    if (value === data.form.old) {
        callback('新密码不能与旧密码一致')
    } else {
        callback()
    }
}

const isSameWithNewPassword = (value: string, callback: (error?: string) => void) => {
    if (value !== data.form.new) {
        callback('确认密码需要与新密码一致')
    } else {
        callback()
    }
}

// 密码设置
const passwordSetting = (params: ChangePasswordInput) => {
    $api.person.apiAppPersonalCenterChangePasswordPost(params).then((res) => {
        if (res.status) {
            Message.success('密码设置成功')
            props.logOut(true)
        } else {
            Message.error('密码设置失败')
        }
    })
}

const handleSubmit = (prop: any) => {
    if (formComponent.value !== null) {
        formComponent.value.validate((errors) => {
            if (errors === undefined) {
                const params = {
                    userId: data.userInfo.id,
                    currentPassword: prop.values.old,
                    newPassword: prop.values.confirm,
                } as ChangePasswordInput

                passwordSetting(params)
            }
        })
    }
}

onMounted(async () => {
    const user = await $api.user.apiAppUsersMnangerUserPersGet()
    if (user.data !== undefined) {
        const { userInfo } = user.data
        data.userInfo = userInfo
    }
})
</script>

<style lang="scss" scoped></style>

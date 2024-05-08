// zh-CN 和 en-US 识别
const LabelConfig: Record<string, any> = {
    custom: {
        'zh-CN': {
            label: '选择客户',
            rules: '请选择客户',
        },
        'en-US': {
            label: 'Custom',
            rules: 'Please Select Custom',
        },
    },
    tenantId: {
        'zh-CN': {
            label: '选择租户',
            rules: '请选择租户',
        },
        'en-US': {
            label: 'Tenant',
            rules: 'Please Select Tenant',
        },
    },
    username: {
        'zh-CN': {
            label: '账号',
            rules: '请输入您的用户名',
        },
        'en-US': {
            label: 'Username',
            rules: 'Please input your username',
        },
    },
    password: {
        'zh-CN': {
            label: '密码',
            rules: '请输入您的密码',
        },
        'en-US': {
            label: 'Password',
            rules: 'Please input your password',
        },
    },
}

export const getLabelConfigFunc = (key: string, lang: string): { label: string; rules: string } => {
    return LabelConfig[key][lang]
}

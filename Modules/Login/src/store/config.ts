import { ILoginParameter, ITenantOption, ILoginInfo } from './type'
export const INVALID_GRANT = 'invalid_grant'

export const INVALID_CLIENT = 'invalid_client'

export const UNSUPPORTED_GRANT = 'unsupported_grant'

export const connectBaseUrl = '/connect'

export const userManagementHost = 'http://172.23.21.33:1110'

export const CLIENT_ID = 'IdentityServer_App'
export const CLIENT_SECRET = '955q2w3e*'
export const GRANT_TYPE = 'password'

export const StepFormat = `YYYY/MM/DD HH:mm:ss`

export const LOGIN_FORM_RULES = {
    username: [{ required: true, message: '请输入您的用户名' }],
    password: [{ required: true, message: '请输入您的密码' }],
}

export const defaultLoginParameter: ILoginParameter = {
    titleCN: 'DHI 用户登录系统',
    titleEN: 'DHI User Management',
    fontCN: 'TitleCN',
    fontEN: 'TitleEN',
    colorCN: '#ffffff',
    colorEN: '#ffffff',
    fontSizeCN: 74,
    fontSizeEN: 36,
    backgroundColor: 'transparent',
}

export const defaultTenants: ITenantOption[] = [
    {
        tenantId: '3a01a6eb-dd71-ee47-24a4-9ff078839e78',
        tenantName: '张家港1',
    },
]

// 资产管理系统的默认租户id和名称
export const DEFAULT_ASSETS_TENANT = {
    id: '3a073ed2-8692-a772-c59a-3b1f09e0e369',
    name: '资产运维管理系统',
}

export const defaultLoginInfo: ILoginInfo = {
    system: '',
    tenantId: '',
    username: '',
    password: '',
}

export const dhiLogo =
    'data:image/png;base64,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'

import type {
    GetSystemsOutput,
    QueryUserInformationOutput,
    TokenModelWithTenant,
    GetTenantsBySysOutput,
} from '@dhicn/domain-paas-sdk-ts/identity-service'

export interface ILoginParameter {
    titleCN: string
    titleEN: string
    fontCN: string
    fontEN: string
    colorCN: string
    colorEN: string
    fontSizeCN: number
    fontSizeEN: number
    backgroundColor: string
}

export interface ILoginInfo {
    username: string
    password: string
    autoLogin?: boolean
    tenantId: string
    system?: string
    tenantName?: string
}

export interface IPhoneLoginParams {
    username: string
    password: string
}

export type IPhoneLoginToken = TokenModelWithTenant
export type TenantList = GetTenantsBySysOutput[]

export interface IToken {
    access_token: string
    expires_in: number
    token_type: string
    refresh_token: string
    scope: string
    error?: string
}

export interface IUser {
    sub: string
    phone_number: string
    phone_number_verified: string
    email: string
    email_verified: string
    preferred_username: string
    name: string
    given_name: string
    family_name: string
    role: string | string[]
    tenantId?: string
}

export interface ITenantOption {
    tenantId: string
    tenantName: string
}

export interface ILoginConfig {
    info: ILoginParameter
    icon: string
    logo: string
    coverType: 0 | 1
    cover: string
}

export interface AuthState {
    token: IToken | null
    user: IUser | null
    config: ILoginConfig
}

export interface ITenantInfo {
    tenantId: string
    appName: string
    baseUrl?: string
    tenantName?: string
}

export type IRoles = QueryUserInformationOutput | null

export interface ILoginRes {
    token: IToken
    user: IUser
    roles: IRoles
    tenantInfo: ITenantInfo
    system?: GetSystemsOutput
    customId?: string
}

export interface IPhoneLoginRes {
    token: TokenModelWithTenant
    user: IUser
    roles: IRoles
    tenantName?: string
    tenantLogo?: string
    system?: GetSystemsOutput
}

export type ISystem = GetSystemsOutput

export interface PasswordItem {
    old: string
    new: string
    confirm: string
}

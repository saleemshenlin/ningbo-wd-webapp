import { encrypt } from './encrypt'
import { IToken, IUser, IRoles, ITenantInfo } from './../export'
import { ApiHelperExtend } from '../api/api'
import { ILoginInfo, ITenantOption } from '../store/type'
import {
    setLoginTimeFromStorage,
    setRolesFromStorage,
    setTokenFromStorage,
    setUserFromStorage,
    setUserNameFromStorage,
} from './LoginWithStorage'

/**
 * 后台登录
 * @param tenantInfo
 * @param loginInfo
 * @param baseUrl
 * @returns
 */
export async function loginInBackground(
    tenantInfo: ITenantOption,
    loginInfo: ILoginInfo,
    baseUrl: string,
): Promise<{
    token: IToken
    user: IUser
    roles: IRoles
    tenantInfo: ITenantInfo
}> {
    try {
        const $api = new ApiHelperExtend(baseUrl)
        $api.changeTenantId(tenantInfo.tenantId)
        const encryptMsg = encrypt(
            JSON.stringify({ username: loginInfo.username, password: loginInfo.password }),
        )
        const rep = await $api.loginApi.apiV1LoginTokenPlusPost({
            contents: encryptMsg,
        })
        $api.changeTenantId(rep.data.tenantId as string)
        $api.setAuth({
            token_type: rep.data.token_type as string,
            access_token: rep.data.access_token as string,
        })
        const token = rep.data as IToken
        if (token.access_token === '') {
            throw new Error('Token is not right')
        }
        setTokenFromStorage(token, tenantInfo.tenantName)
        //  获取用户信息
        const user = await $api.userInfo()
        const roles = await $api.fetchRoles(user.sub)
        setUserNameFromStorage(user.name, tenantInfo.tenantName)
        setUserFromStorage(user, tenantInfo.tenantName)
        setLoginTimeFromStorage(new Date(), tenantInfo.tenantName)
        if (roles !== null) {
            setRolesFromStorage(roles as Record<string, string>, tenantInfo.tenantName)
        }
        return {
            token,
            user,
            roles,
            tenantInfo: {
                tenantId: tenantInfo.tenantId,
                appName: tenantInfo.tenantName,
            },
        }
    } catch (error) {
        return await Promise.reject(new Error(error as string))
    }
}

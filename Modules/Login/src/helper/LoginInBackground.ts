import { GRANT_TYPE } from './../store/config'
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
import { CLIENT_ID, CLIENT_SECRET } from '../store/config'

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
        await $api.logIn(
            loginInfo.tenantId,
            CLIENT_ID,
            GRANT_TYPE,
            CLIENT_SECRET,
            loginInfo.username,
            loginInfo.password,
        )
        const token = $api.apiToken as IToken
        if (token.access_token === '') {
            throw new Error('Token is not right')
        }
        setTokenFromStorage(token, tenantInfo.tenantName)
        //  设置用户权限
        $api.setAuth(token)
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

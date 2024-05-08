import { isEmpty } from 'lodash'
import { IToken, IUser, IRoles, LoginStorage, LoginExpiresCheck } from 'dhi-dss-mf-login'

export function getAuthFromStorage(): {
    token: IToken
    user: IUser
    roles: IRoles
} | null {
    const token = LoginStorage.getTokenFromStorage(VITE_APP_NAME) as IToken
    const user = LoginStorage.getUserFromStorage(VITE_APP_NAME) as IUser
    const roles = LoginStorage.getRolesFromStorage(VITE_APP_NAME) as IRoles
    const expires: boolean = LoginExpiresCheck.checkLoginExpires(VITE_APP_NAME)
    const loginIn = isEmpty(token) || isEmpty(user) || expires
    if (loginIn) {
        return null
    } else {
        return {
            token,
            user,
            roles,
        }
    }
}

const {
    VITE_APP_NAME,
    VITE_APP_TENANTID,
    VITE_APP_SERVER_URL,
    VITE_APP_PROJECT_NAME,
    VITE_APP_PROJECT_NAME_FOR_LAB,
} = import.meta.env

export const tenantInfo = {
    tenantId: VITE_APP_TENANTID,
    tenantName: VITE_APP_NAME,
    baseUrl: VITE_APP_SERVER_URL,
    projectName: VITE_APP_PROJECT_NAME,
    projectLabName: VITE_APP_PROJECT_NAME_FOR_LAB,
}

/**!!!修改businessType=/wwtp-config-management */
export const routerPath = {
    login: '/login',
    index: '/index',
    businessType: '/login',
}

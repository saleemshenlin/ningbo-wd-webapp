import { isString } from 'lodash'
import { IToken } from '../store/type'
import { getLoginTimeFromStorage, getTokenFromStorage } from './LoginWithStorage'

/**
 * 检查登录是否过期
 */
export function checkLoginExpires(app: string): boolean {
    const loginTimeStr = getLoginTimeFromStorage(app)
    const token = getTokenFromStorage(app) as IToken
    if (isString(loginTimeStr)) {
        const loginTime = Date.parse(loginTimeStr)
        const now = Date.now()
        const expiresTime = (now - loginTime) / 1000
        console.log('Login expires:>> ', expiresTime, token.expires_in)
        return expiresTime > token.expires_in
    } else {
        return true
    }
}

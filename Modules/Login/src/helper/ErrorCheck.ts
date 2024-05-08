import { isEmpty } from 'lodash'
import { ILoginInfo } from './../store/type'

/**
 * check login from submit
 * @param loginInfo
 * @param errors
 * @param warningNoticeFn
 * @returns
 */
export function loginErrorCheck(
    loginInfo: ILoginInfo,
    errors: undefined | Record<string, any>,
    warningNoticeFn: (message: string) => void,
): boolean {
    if (errors != null) {
        warningNoticeFn('请检查必填项!')
        return false
    } else if (isEmpty(loginInfo.username)) {
        warningNoticeFn('用户名不能为空')
        return false
    } else if (isEmpty(loginInfo.password)) {
        warningNoticeFn('密码不能为空')
        return false
    }
    return true
}

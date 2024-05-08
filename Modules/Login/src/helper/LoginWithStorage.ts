import { IToken, IUser } from './../store/type'

export type StorageData = Record<string, string | number | boolean | string[]> | IToken | IUser

function getItemFromStorage(key: string, appName: string): string | StorageData {
    const item = window.localStorage.getItem(`${appName}-${key}`)
    if (item === null) {
        return ''
    } else {
        return JSON.parse(item)
    }
}

function setItemFromStorage(key: string, item: string | StorageData, appName: string): void {
    window.localStorage.setItem(`${appName}-${key}`, JSON.stringify(item))
}

export function getTitleFromStorage(appName: string): string | StorageData {
    return getItemFromStorage('title', appName)
}

export function getLogoFromStorage(appName: string): string | StorageData {
    return getItemFromStorage('logoSrc', appName)
}

export function getUserNameFromStorage(appName: string): string | StorageData {
    return getItemFromStorage('userName', appName)
}

export function getTokenFromStorage(appName: string): string | IToken {
    return getItemFromStorage('token', appName) as IToken
}

export function getUserFromStorage(appName: string): string | IUser {
    return getItemFromStorage('loginUser', appName) as IUser
}

export function getLoginTimeFromStorage(appName: string): string | StorageData {
    return getItemFromStorage('loginTime', appName)
}

export function getTenantFromStorage(appName: string): string | StorageData {
    return getItemFromStorage('tenantId', appName)
}

export function getTenantNameFromStorage(appName: string): string | StorageData {
    return getItemFromStorage('tenantName', appName)
}

export function getPermissionFromStorage(appName: string): string | StorageData {
    return getItemFromStorage('loginPermission', appName)
}

export function setTitleFromStorage(value: StorageData, appName: string): void {
    setItemFromStorage('title', value, appName)
}

export function setLogoFromStorage(value: string, appName: string): void {
    setItemFromStorage('logoSrc', value, appName)
}

export function setUserNameFromStorage(value: string, appName: string): void {
    setItemFromStorage('userName', value, appName)
}

export function setTokenFromStorage(value: StorageData, appName: string): void {
    setItemFromStorage('token', value, appName)
}

export function setUserFromStorage(value: IUser, appName: string): void {
    setItemFromStorage('loginUser', value as any, appName)
}

export function setLoginTimeFromStorage(value: Date, appName: string): void {
    setItemFromStorage('loginTime', value as any, appName)
}

export function setTenantFromStorage(value: string, appName: string): void {
    setItemFromStorage('tenantId', value, appName)
}

export function setTenantNameFromStorage(value: string, appName: string): void {
    setItemFromStorage('tenantName', value, appName)
}

export function setPermissionFromStorage(value: StorageData, appName: string): void {
    setItemFromStorage('loginPermission', value, appName)
}

// 应用名称
export function setAppNameFromStorage(value: string, appName: string): void {
    setItemFromStorage('appName', value, appName)
}

export function getAppNameFromStorage(appName: string): string | StorageData {
    return getItemFromStorage('appName', appName)
}

// 用户角色
export function setRolesFromStorage(value: StorageData, appName: string): void {
    setItemFromStorage('roles', value, appName)
}

export function getRolesFromStorage(appName: string): string | StorageData {
    return getItemFromStorage('roles', appName)
}

// 系统
export function setSystemFromStorage(value: StorageData, appName: string): void {
    setItemFromStorage('system', value, appName)
}

export function getSystemFromStorage(appName: string): string | StorageData {
    return getItemFromStorage('system', appName)
}

export function clearLoginStorage(appName: string): void {
    window.localStorage.removeItem(`${appName}-title`)
    window.localStorage.removeItem(`${appName}-logoSrc`)
    window.localStorage.removeItem(`${appName}-userName`)
    window.localStorage.removeItem(`${appName}-token`)
    window.localStorage.removeItem(`${appName}-loginUser`)
    window.localStorage.removeItem(`${appName}-loginTime`)
    window.localStorage.removeItem(`${appName}-tenantId`)
    window.localStorage.removeItem(`${appName}-tenantName`)
    window.localStorage.removeItem(`${appName}-loginPermission`)
    window.localStorage.removeItem(`${appName}-appName`)
    window.localStorage.removeItem(`${appName}-roles`)
    window.localStorage.removeItem(`${appName}-system`)
}

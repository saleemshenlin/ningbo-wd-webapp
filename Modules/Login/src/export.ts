import * as Interface from './store/type'

export type IToken = Interface.IToken
export type IPhoneLoginToken = Interface.IPhoneLoginToken
export type IUser = Interface.IUser
export type IRoles = Interface.IRoles
export type ISystem = Interface.ISystem
export type ILoginRes = Interface.ILoginRes
export type ITenantInfo = Interface.ITenantInfo
export * as LoginStorage from './helper/LoginWithStorage'
export * as LoginInBack from './helper/LoginInBackground'
export * as LoginInBackEncrypt from './helper/EncryptLoginInBackground'
export * as Encrypt from './helper/encrypt'
export * as LoginExpiresCheck from './helper/CheckExpires'

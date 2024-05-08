import { ApiHelperExtend } from '@/api/api'
import { IToken, IUser, IRoles } from 'dhi-dss-mf-login'

export interface UserState {
    api: ApiHelperExtend | null
    token: IToken | null
    user: IUser | null
    roles: IRoles
    tenantInfo: {
        tenantId: string
        tenantName: string
    }
}

export interface IHeader {
    tenantId: string
    Authorization: string
}

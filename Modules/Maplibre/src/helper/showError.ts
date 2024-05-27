import { Helper } from '@dhicn/helper'

export const logger = new Helper.Logger('dhi-dss-api-store')
export const showError = (store: string, api: string, error: any) => {
    logger.error(`%0-%0 \n %0`, store, api, error)
}

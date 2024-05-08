// 对localStorage的封装
import { getStorage } from '@dhicn/helper/storage'
const PRE_FIX = 'store_wwtp_webapp_'
export default getStorage(PRE_FIX)

import { createI18n } from 'vue-i18n'
import { shareStorage } from '@dhicn/helper/storage'
import zh_CN from '../locales/zh-CN.json'
import en from '../locales/en.json'
import { AllLang } from './langType'
type MessageSchema = typeof en
type SupportLang = 'en-US' | 'zh-CN'
const messages = {
    'zh-CN': zh_CN,
    'en-US': en,
}

const i18n = createI18n<[MessageSchema], SupportLang>({
    legacy: false,
    locale: shareStorage.get('userLang') ?? 'zh-CN',
    fallbackLocale: 'en-US',
    messages,
})

export const getNowLang = (): SupportLang => {
    const lang = shareStorage.get('userLang') ?? 'zh-CN'
    console.log('now lang', lang)
    console.log('all lang', i18n.global.availableLocales)
    return lang as SupportLang
}

export default i18n

export const getLangTextByKey = (key: AllLang): string => {
    return i18n.global.t(key)
}

import type { ClassifyLegendInfo } from '@dhicn/domain-paas-sdk-ts/model-configuration'
import { colorToRGB } from './color2RGB'

/**
 * 根据 ClassifyLegendInfo 生成 颜色等级
 * @param legendData
 * @param field
 * @param interpolate 是否启用插值
 * @param legendKey 等级值 默认为 minValue
 * @returns
 */
export const legend2Color = (
    legendData: ClassifyLegendInfo[],
    field: string,
    interpolate = true,
    legendKey: keyof ClassifyLegendInfo = 'minValue',
) => {
    const colorExpression: any[] = interpolate
        ? ['interpolate', ['linear'], ['get', field]]
        : ['step', ['get', field], 'rgba(0,0,0,0)']

    legendData.forEach((item: any) => {
        const { red, green, blue } = item
        colorExpression.push(item[legendKey], colorToRGB(red, green, blue))
    })

    colorExpression.push(legendData.at(-1)!.maxValue, colorToRGB(150, 215, 231))
    return colorExpression
}

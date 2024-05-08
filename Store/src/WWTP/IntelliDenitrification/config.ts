/** 药剂投加类别  */
export const dosingCategoryEnum = {
    CD: 1,
    PAC: 2,
    // 加入铁催化剂和双氧水- waxg
    Fe: 3,
    H2O2: 4,
} as const

// mccr 工艺线过滤条件
export const ProductLineMccrFilter = '3,4'
export const DenitrificationC = 1
export const DenitrificationFe = 3
export const DenitrificationH202 = 4
export const DenitrificationTAG = {
    1: '碳源',
    2: '除磷剂',
    3: '铁催化剂',
    4: '双氧水',
}

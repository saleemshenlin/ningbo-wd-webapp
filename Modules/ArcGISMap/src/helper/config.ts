// base pipe  TJWD
export const valueExpression =
    "When($feature.Diameter >= 800, 'red', $feature.Diameter >= 300 && $feature.Diameter < 800, 'yellow', $feature.Diameter >= 110  && $feature.Diameter < 300, 'green', 'blue')"
export const uniqueValueInfos = [
    {
        value: 'blue',
        symbol: { type: 'simple-line', color: '#1FC6FF', width: 3 } as any,
    } as any,
    {
        value: 'green',
        symbol: { type: 'simple-line', color: '#7DD61B', width: 3 } as any,
    } as any,
    {
        value: 'yellow',
        symbol: { type: 'simple-line', color: '#F5E74F', width: 3 } as any,
    } as any,
    {
        value: 'red',
        symbol: { type: 'simple-line', color: '#F5594F', width: 3 } as any,
    } as any,
]

import type { AddLayerObject } from 'maplibre-gl'

export const fnSimplePoint = (
    props: {
        id: string
        sourceName: string
        color: string | any[]
        size: number | any[]
        highlightColor?: string | any[]
    },
    options?: Record<string, any>,
) => {
    const layer = {
        id: props.id,
        type: 'circle',
        source: props.sourceName,
        paint: {
            'circle-color': [
                'case',
                [
                    'any',
                    ['boolean', ['feature-state', 'hover'], false],
                    ['boolean', ['feature-state', 'highlight'], false],
                    ['boolean', ['feature-state', 'clicked'], false],
                ],
                props.highlightColor ?? props.color,
                props.color ?? '#fff',
            ],
            'circle-radius': props.size ?? 5,
        },
    } as AddLayerObject
    if (options !== undefined) {
        Object.assign(layer, options)
    }
    return layer
}

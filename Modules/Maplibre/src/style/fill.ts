import type { AddLayerObject } from 'maplibre-gl'

export const fnSimpleFill = (
    props: {
        id: string
        sourceName: string
        sourceLayer?: string
        color?: string | any[]
        opacity?: number | any[]
        highlightColor?: string | any[]
    },
    options?: Record<string, any>,
) => {
    const layer = {
        id: props.id,
        type: 'fill',
        source: props.sourceName,
        paint: {
            'fill-color': [
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
            'fill-opacity': props.opacity ?? 1,
        },
    } as AddLayerObject

    if (options !== undefined) {
        Object.assign(layer, options)
    }
    return layer
}

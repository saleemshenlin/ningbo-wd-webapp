import type { AddLayerObject } from 'maplibre-gl'

export const fnSimpleLine = (
    props: {
        id: string
        sourceName: string
        color: string | any[]
        width: number | any[]
        highlightColor?: string | any[]
    },
    options?: Record<string, any>,
) => {
    const layer = {
        id: props.id,
        type: 'line',
        source: props.sourceName,
        layout: {
            'line-join': 'round',
            'line-cap': 'round',
        },
        paint: {
            'line-color': [
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
            'line-width': props.width ?? 1,
        },
    } as AddLayerObject
    if (options !== undefined) {
        Object.assign(layer, options)
    }
    return layer
}

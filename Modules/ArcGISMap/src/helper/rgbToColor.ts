import Color from '@geoscene/core/Color'
export function rgbToColor(props: { red: number; green: number; blue: number }): Color {
    return new Color({ r: props.red, g: props.green, b: props.blue })
}

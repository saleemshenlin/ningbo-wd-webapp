import type { Map } from 'maplibre-gl'

export class PulsingDot {
    width: number
    height: number
    data: Uint8ClampedArray | Uint8Array
    context: CanvasRenderingContext2D | null
    map: Map
    fill: { r: number; g: number; b: number }
    stroke: { r: number; g: number; b: number }
    constructor(
        map: Map,
        fill = { r: 255, g: 100, b: 100 },
        stroke = { r: 255, g: 255, b: 255 },
        size = 200,
    ) {
        this.width = size
        this.height = size
        this.data = new Uint8Array(size * size * 4)
        this.context = null
        this.map = map
        this.fill = fill
        this.stroke = stroke
    }
    onAdd() {
        const canvas = document.createElement('canvas')
        canvas.width = this.width
        canvas.height = this.height
        this.context = canvas.getContext('2d')
    }

    render() {
        const duration = 1000
        const t = (performance.now() % duration) / duration

        const radius = (this.width / 2) * 0.3
        const outerRadius = (this.width / 2) * 0.7 * t + radius
        // draw outer circle
        if (this.context !== null) {
            this.context.clearRect(0, 0, this.width, this.height)
            this.context.beginPath()
            this.context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2)
            this.context.fillStyle = `rgba(${this.fill.r},${this.fill.g},${this.fill.b},${1 - t})`
            this.context.fill()

            // draw inner circle
            this.context.beginPath()
            this.context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2)
            this.context.fillStyle = `rgba(${this.fill.r},${this.fill.g},${this.fill.b},1)`
            this.context.strokeStyle = `rgba(${this.stroke.r},${this.stroke.g},${this.stroke.b},1)`
            this.context.lineWidth = 2 + 4 * (1 - t)
            this.context.fill()
            this.context.stroke()

            // update this image's data with data from the canvas
            this.data = this.context.getImageData(0, 0, this.width, this.height).data

            // continuously repaint the map, resulting in the smooth animation of the dot
            this.map.triggerRepaint()
        }
        // return `true` to let the map know that the image was updated
        return true
    }
}

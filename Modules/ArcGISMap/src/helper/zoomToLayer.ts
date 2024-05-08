import MapView from '@geoscene/core/views/MapView'
import GeoJSONLayer from '@geoscene/core/layers/GeoJSONLayer'

export async function addZoomToLayerCallback(
    layer: GeoJSONLayer,
    view: MapView,
    expand = 1,
    cb: Function = () => {},
): Promise<void> {
    layer.when(async () => {
        const extent = await layer.queryExtent()
        await view.goTo(extent.extent.expand(expand), {
            easing: 'ease-in-out', // easing function to slow down when reaching the target
        })
        cb && cb()
    })
}

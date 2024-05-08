import GeoJSONLayer from '@geoscene/core/layers/GeoJSONLayer'
import { transferJSONToUrl } from './jsonToUrl'

export const createGeoJSONLayer = (props: {
    id: string
    geojson: string
    fields: Array<{ name: string; type: string }>
    renderer: __geoscene.RendererProperties
    popupTemplate: __geoscene.PopupTemplateProperties
    labelingInfo: __geoscene.LabelClassProperties[]
}): GeoJSONLayer => {
    const geojsonLayer = new GeoJSONLayer({
        id: props.id,
        url: transferJSONToUrl(props.geojson),
        copyright: 'DHI China',
        outFields: ['*'],
        fields: props.fields as any[],
        renderer: props.renderer,
        popupTemplate: props.popupTemplate,
        labelingInfo: props.labelingInfo,
    })
    return geojsonLayer
}

export function transferJSONToUrl(geojson: string): string {
    const blob = new Blob([geojson], {
        type: 'application/json',
    })
    // URL reference to the blob
    const url = URL.createObjectURL(blob)
    return url
}

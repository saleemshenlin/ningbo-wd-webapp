import * as IotApi from '@dhicn/domain-paas-sdk-ts/iot-service'
import * as DigitalTwinApi from '@dhicn/domain-paas-sdk-ts/digital-twin-service'
import { IUploadTableRow } from './type'
// import { IBaseAsset } from '../Asset/type'

// export const tableToAsset = (table: IUploadTableRow): IBaseAsset => {
//     const asset: IBaseAsset = {
//         name: table.a_name,
//         type: table.a_type,
//         label: table.a_label,
//         lng: table.d_lng,
//         lat: table.d_lat,
//     }
//     return asset
// }

// export const tableToDevice = (table: IUploadTableRow): IBaseAsset => {
//     const asset: IBaseAsset = {
//         name: table.a_name,
//         type: table.a_type,
//         label: table.a_label,
//         lng: table.d_lng,
//         lat: table.d_lat,
//     }
//     return asset
// }

// 资产
export const tableToPostAsset = (table: IUploadTableRow): IotApi.AddAssetInput => {
    const lng: number =
        table.a_lng !== undefined ? table.a_lng : table.d_lng !== undefined ? table.d_lng : 0
    const lat: number =
        table.a_lat !== undefined ? table.a_lat : table.d_lat !== undefined ? table.d_lat : 0
    const area: string =
        table.a_area !== undefined ? table.a_area : table.d_area !== undefined ? table.d_area : ''
    const asset = {
        name: table.a_name.toString().trim(),
        type: table.a_type,
        label: table.a_label,
        description: '',
        attributes: [
            {
                key: 'lng',
                value: lng.toString(),
            },
            {
                key: 'area',
                value: area,
            },
            {
                key: 'lat',
                value: lat.toString(),
            },
        ],
    }
    return asset
}

// 设备
export const tableToPostDevice = (table: IUploadTableRow): IotApi.AddDeviceInput => {
    const lng: number =
        table.d_lng !== undefined ? table.d_lng : table.a_lng !== undefined ? table.a_lng : 0
    const lat: number =
        table.d_lat !== undefined ? table.d_lat : table.a_lat !== undefined ? table.a_lat : 0
    const area: string =
        table.d_area !== undefined ? table.d_area : table.a_area !== undefined ? table.a_area : ''
    const device: IotApi.AddDeviceInput = {
        name: table.d_name.toString().trim(),
        label: table.d_label,
        description: table.d_desc,
        attributes: [
            {
                key: 'lng',
                value: lng.toString(),
            },
            {
                key: 'area',
                value: area,
            },
            {
                key: 'lat',
                value: lat.toString(),
            },
        ],
    }
    return device
}

export const tableToPostIndicator = (
    table: IUploadTableRow,
): DigitalTwinApi.AddDeviceIndicatorInput => {
    const device: DigitalTwinApi.AddDeviceIndicatorInput = {
        indicator: (table.i_name as string | number).toString().trim(),
        showName: table.i_desc,
        label: table.i_label,
        type: table.i_type,
        unit: table.i_unit,
    }
    return device
}

export const tableToPostRealityModelRelation = (
    deviceSet: IUploadTableRow[],
    templateId: string,
): DigitalTwinApi.AddRealityModelRelationInput => {
    const row = deviceSet[0]
    const relation = {
        templateId,
        modelPointId: row.mp_id,
        entityId: row.d_id,
        entityType: 'Device',
        dataTypeMapping: [] as DigitalTwinApi.DataTypeMappingItem[],
    }
    relation.dataTypeMapping = deviceSet.map((indicator) => {
        return {
            modelComponent: '',
            deviceIndicatorId: indicator.i_id,
            modelDataType: indicator.mp_dataType,
        }
    })
    return relation
}

export const IndicatorToTable = ({
    assets,
    devices,
    indicators,
}: {
    assets: IotApi.AssetInfoOutput[]
    devices: IotApi.DeviceInfosOutput[]
    indicators: IotApi.DeviceIndicatorOutput[]
}): IUploadTableRow[] => {
    return indicators.map((indicator) => {
        const row: IUploadTableRow = {}
        row.i_id = indicator.id
        row.i_name = indicator.indicator
        row.i_desc = indicator.showName
        row.i_label = indicator.label
        row.i_type = (indicator as any).type
        row.i_unit = indicator.unit
        const device = devices.find((device) => device.id === indicator.deviceId)
        if (device !== undefined) {
            row.d_name = device.name
            row.d_label = device.label
            row.d_desc = device.description
            row.d_id = device.id
            const lng = device.attributes?.find((attr: any) => attr.key === 'lng')
            if (lng !== undefined) {
                row.d_lng = Number(lng.value)
            }
            const lat = device.attributes?.find((attr: any) => attr.key === 'lat')
            if (lat !== undefined) {
                row.d_lat = Number(lat.value)
            }
            const area = device.attributes?.find((attr: any) => attr.key === 'area')
            if (area !== undefined) {
                row.d_area = area.value
            }
        } else {
            row.d_name = 'EMPTY'
        }
        const asset = assets.find((assert) =>
            (assert as any).devices.some((device: any) => {
                return device.deviceId === indicator.deviceId
            }),
        )
        if (asset !== undefined) {
            row.a_name = asset.name
            row.a_type = asset.type
            row.a_label = asset.label
            row.a_id = asset.id
            const lng = asset.attributes?.find((attr: any) => attr.key === 'lng')
            if (lng !== undefined) {
                row.d_lng = Number(lng.value)
            }
            const lat = asset.attributes?.find((attr: any) => attr.key === 'lat')
            if (lat !== undefined) {
                row.d_lat = Number(lat.value)
            }
            const area = asset.attributes?.find((attr: any) => attr.key === 'area')
            if (area !== undefined) {
                row.d_area = area.value
            }
        }

        return row
    })
}

// export const modelPointToTable = (

// ): IUploadTableRow[] => {}

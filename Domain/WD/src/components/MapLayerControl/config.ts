import { IMapLayerControlSourceData } from './type'

export const MapLayerControlSourceData: IMapLayerControlSourceData[] = [
    {
        name: '节点',
        type: 'BASE_JUNCTION',
    },
    {
        name: '管线',
        type: 'BASE_PIPE',
    },
    {
        name: '水泵',
        type: 'BASE_PUMP',
    },
    {
        name: '水池',
        type: 'BASE_TANK',
    },
    {
        name: '阀门',
        type: 'BASE_VALVE',
    },
    {
        name: '流量计',
        type: 'BASE_FLOW',
    },
    {
        name: '压力计',
        type: 'BASE_PRESSURE',
    },
    {
        name: '液位计',
        type: 'BASE_LEVEL',
    },
]

export const MapLayerControlTreeData = [
    {
        title: '全选',
        key: 'BASE',
        children: [
            {
                title: '节点',
                key: 'BASE_JUNCTION',
                image: '',
            },
            {
                title: '管线',
                key: 'BASE_PIPE',
                image: '',
            },
            {
                title: '水泵',
                key: 'BASE_PUMP',
                image: '',
            },
            {
                title: '水池',
                key: 'BASE_TANK',
                image: '',
            },
            {
                title: '阀门',
                key: 'BASE_VALVE',
                image: '',
            },
            {
                title: '监测设备',
                key: 'BASE_DEVICE',
                image: '',
            },
        ],
    },
]

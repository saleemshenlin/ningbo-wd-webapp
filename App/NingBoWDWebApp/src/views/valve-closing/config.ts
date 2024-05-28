import type { TableColumnData } from '@arco-design/web-vue'

export const TablePipeColumns: TableColumnData[] = [
    {
        title: '管道ID',
        width: 100,
        dataIndex: 'MUID',
        align: 'center',
    },
    {
        title: '管径(mm)',
        width: 100,
        dataIndex: 'Diameter',
        align: 'center',
    },
    {
        title: '操作',
        width: 100,
        dataIndex: 'Action',
        slotName: 'Action',
        align: 'center',
    },
]

export const TableValveColumns: TableColumnData[] = [
    {
        title: '阀门ID',
        width: 100,
        dataIndex: 'gisId',
        align: 'center',
    },
    {
        title: '阀径(mm)',
        width: 150,
        dataIndex: 'diameter',
        sortable: {
            sortDirections: ['ascend', 'descend'],
        },
        align: 'center',
    },
    {
        title: '地址',
        width: 100,
        dataIndex: 'address',
        tooltip: true,
        ellipsis: true,
        align: 'center',
    },
    {
        title: '定位',
        width: 100,
        dataIndex: 'location',
        slotName: 'location',
        align: 'center',
    },
]

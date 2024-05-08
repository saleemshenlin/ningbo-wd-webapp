import { TableColumnData } from '@arco-design/web-vue'
export const wDTankStorageTitle = '水池当前蓄水量(m³)'
export const wDTankStorageColumns: TableColumnData[] = [
    {
        dataIndex: 'tankName',
        title: '名称',
        slotName: 'tankName',
        width: 100,
        align: 'center',
    },
    {
        dataIndex: 'totalStorageValue',
        title: '总调蓄值',
        slotName: 'totalStorageValue',
        width: 100,
        align: 'right',
    },
    {
        dataIndex: 'storageValue',
        title: '当前值',
        slotName: 'storageValue',
        width: 100,
        align: 'left',
    },
]

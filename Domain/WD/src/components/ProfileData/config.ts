import { TableColumnData } from '@arco-design/web-vue'
export const profileDataColumns: TableColumnData[] = [
    {
        dataIndex: 'pipeName',
        title: '管道',
        slotName: 'pipeName',
        width: 100,
        align: 'center',
    },
    {
        dataIndex: 'upJunction',
        title: '上游节点',
        width: 100,
        slotName: 'upJunction',
        align: 'center',
    },
    {
        dataIndex: 'downJunction',
        title: '下游节点',
        width: 100,
        slotName: 'downJunction',
        align: 'center',
    },
    {
        dataIndex: 'operation',
        title: '操作',
        width: 100,
        slotName: 'operation',
        align: 'center',
    },
]

export const SecondaryBtn = '清空已选管线'
export const PrimaryBtn = '生成剖面图'

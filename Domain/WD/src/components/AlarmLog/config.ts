import { TableColumnData } from '@arco-design/web-vue'
export const wDAlarmTitle = '报警预警'
export const wDAlarmColumns: TableColumnData[] = [
    {
        dataIndex: 'deviceName',
        title: '名称',
        slotName: 'deviceName',
        width: 100,
        align: 'center',
    },
    {
        dataIndex: 'alarmDataType',
        title: '类型',
        width: 100,
        slotName: 'alarmDataType',
        align: 'center',
    },
    {
        dataIndex: 'valueDiff',
        title: '超出阈值',
        width: 80,
        slotName: 'valueDiff',
        align: 'center',
    },
    {
        dataIndex: 'alarmTime',
        title: '报警预警时间',
        width: 140,
        slotName: 'alarmTime',
        align: 'center',
    },

    {
        dataIndex: 'location',
        title: '定位',
        width: 80,
        slotName: 'location',
        align: 'center',
    },
]

export interface IAlarmLog {
    alarmDataType?: string | null
    /**
     * 报警策略（0：阈值报警，1：范围值报警）
     * @type {number}
     * @memberof AlarmLogDto
     */
    alarmPolicy?: number
    /**
     * 报警时间
     * @type {string}
     * @memberof AlarmLogDto
     */
    alarmTime?: string
    /**
     *
     * @type {number}
     * @memberof AlarmLogDto
     */
    x?: number
    /**
     *
     * @type {number}
     * @memberof AlarmLogDto
     */
    y?: number
    /**
     *
     * @type {number}
     * @memberof AlarmLogDto
     */
    z?: number
    /**
     * 模型点位id
     * @type {string}
     * @memberof AlarmLogDto
     */
    modelId?: string | null
    /**
     * 模型结果值
     * @type {number}
     * @memberof AlarmLogDto
     */
    modelValue?: number
    /**
     * 设备名称
     * @type {string}
     * @memberof AlarmLogDto
     */
    deviceName?: string | null
    /**
     * 指标名称
     * @type {string}
     * @memberof AlarmLogDto
     */
    indicatorName?: string | null
    /**
     * 实测值
     * @type {number}
     * @memberof AlarmLogDto
     */
    measureValue?: number
    /**
     * 差值
     * @type {number}
     * @memberof AlarmLogDto
     */
    valueDiff?: number
}

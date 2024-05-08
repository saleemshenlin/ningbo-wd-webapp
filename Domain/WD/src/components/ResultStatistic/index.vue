<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { CSSProperties, computed, toRefs } from 'vue'
import { IStatisticItem } from './type'
import { StatisticItemConfigLabel, DecimalPlaces, getInterpolatedColor } from './config'
import { Helper } from '@dhicn/helper'
import type { ClassifyLegendInfo } from '@dhicn/domain-paas-sdk-ts/model-configuration'

interface IProps {
    isActive: boolean
    dataSet?: IStatisticItem
    title: string
    unit: string
    legendItems: ClassifyLegendInfo[] // 图列
}

const props = withDefaults(defineProps<IProps>(), {
    isActive: false,
    title: '',
    unit: '',
    legendItems: () => [],
})

const { isActive, title, unit } = toRefs(props)
// TODO: 根据isActive设置样式

const toFixedDecimal = computed(() => {
    return DecimalPlaces.find((item) => item.title === title.value)?.decimal || 2
})

// 根据图例获得显示颜色
const getColor = (value: number) => {
    // console.log('getColor :>> ', props.legendItems)
    const rgbSet = getInterpolatedColor(props.legendItems, value)
    const rgb = `rgb(${rgbSet?.r},${rgbSet?.g},${rgbSet?.b})`
    // console.log('统计rgb>>', rgb, 'value>>', value, 'legendItem>>', rgb)
    return {
        fontWeight: 700,
        fontSize: '20px',
        lineHeight: '33px',
        color: rgb,
    } as CSSProperties
}
</script>

<template>
    <div :class="!isActive ? 'result-statistic' : 'result-statistic-active'">
        <div class="result-statistic-title">
            <a-space>
                <span>{{ title }}</span>
                <span>{{ unit }}</span>
            </a-space>
        </div>
        <div
            class="result-statistic-items"
            v-if="props.dataSet !== undefined && props.legendItems.length > 1"
        >
            <div class="result-statistic-item">
                <div class="result-statistic-item-title">
                    {{ StatisticItemConfigLabel.AvgValue }}
                </div>
                <div
                    :style="!isActive ? '' : getColor(props.dataSet.statisticTimeItem.avgValue)"
                    :class="!isActive ? 'result-statistic-item-value' : ''"
                >
                    {{ Helper.toFixed(props.dataSet.statisticTimeItem.avgValue, toFixedDecimal) }}
                </div>
            </div>
            <div class="result-statistic-item">
                <div class="result-statistic-item-title">
                    {{ StatisticItemConfigLabel.MaxValue }}
                </div>
                <div
                    :style="!isActive ? '' : getColor(props.dataSet.statisticTimeItem.maxValue)"
                    :class="!isActive ? 'result-statistic-item-value' : ''"
                >
                    {{ Helper.toFixed(props.dataSet.statisticTimeItem.maxValue, toFixedDecimal) }}
                </div>
            </div>
            <div class="result-statistic-item">
                <div class="result-statistic-item-title">
                    {{ StatisticItemConfigLabel.MinValue }}
                </div>
                <div
                    :style="!isActive ? '' : getColor(props.dataSet.statisticTimeItem.minValue)"
                    :class="!isActive ? 'result-statistic-item-value' : ''"
                >
                    {{ Helper.toFixed(props.dataSet.statisticTimeItem.minValue, toFixedDecimal) }}
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.result-statistic {
    background: rgba(24, 29, 45, 0.8);
    border: 2px solid #1e3769;
    backdrop-filter: blur(10px);
    border-radius: 8px;
    width: 250px;
    .result-statistic-title {
        font-weight: 400;
        font-size: 18px;
        line-height: 20px;
        color: rgba(255, 255, 255, 0.9);
        margin: 5px 10px;
    }
    .result-statistic-items {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
        .result-statistic-item {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            .result-statistic-item-title {
                font-weight: 400;
                font-size: 12px;
                line-height: 20px;
                color: rgba(255, 255, 255, 0.7);
            }
            .result-statistic-item-value {
                font-weight: 700;
                font-size: 20px;
                line-height: 33px;
                background: linear-gradient(
                    0deg,
                    #3c7eff 0%,
                    #5edfd6 99.99%,
                    rgba(60, 126, 255, 0) 100%,
                    rgba(60, 126, 255, 0) 100%
                );
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
        }
    }
}
.result-statistic-active {
    background: rgba(59, 94, 192, 0.6);
    border: 2px solid #3d72ff;
    backdrop-filter: blur(10px);
    border-radius: 8px;
    width: 250px;
    .result-statistic-title {
        font-weight: 400;
        font-size: 18px;
        line-height: 20px;
        color: rgba(255, 255, 255, 0.9);
        margin: 5px 10px;
    }
    .result-statistic-items {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
        .result-statistic-item {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            .result-statistic-item-title {
                font-weight: 400;
                font-size: 12px;
                line-height: 20px;
                color: rgba(255, 255, 255, 0.7);
            }
            .result-statistic-item-avg-value-active {
                font-weight: 700;
                font-size: 20px;
                line-height: 33px;
                background: linear-gradient(
                    0deg,
                    #f5b34f 0%,
                    #cddf5e 99.98%,
                    #5edfd6 99.99%,
                    rgba(60, 126, 255, 0) 100%,
                    rgba(193, 255, 60, 0) 100%
                );

                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            .result-statistic-item-max-value-active {
                font-weight: 700;
                font-size: 20px;
                line-height: 33px;
                background: linear-gradient(
                    0deg,
                    #ff3c3c 0%,
                    #cddf5e 99.98%,
                    #5edfd6 99.99%,
                    rgba(60, 126, 255, 0) 100%,
                    rgba(251, 255, 60, 0) 100%,
                    rgba(255, 154, 60, 0) 100%
                );
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            .result-statistic-item-min-value-active {
                font-weight: 700;
                font-size: 20px;
                line-height: 33px;
                background: linear-gradient(
                    0deg,
                    #1fc6ff 0%,
                    #cddf5e 99.98%,
                    #5edfd6 99.99%,
                    rgba(60, 126, 255, 0) 100%,
                    rgba(60, 255, 173, 0) 100%
                );
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
        }
    }
}
</style>

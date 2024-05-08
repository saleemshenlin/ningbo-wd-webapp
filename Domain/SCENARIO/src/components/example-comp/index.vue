<template>
    <div class="example-comp">
        <h5>{{ title }}</h5>
        <p>{{ props.demoProp }}</p>
    </div>
</template>

<script lang="ts" setup>
// eslint-disable-next-line no-unused-vars
import { ref, Ref, watch, reactive } from 'vue'
import { labelConfig } from './config'
import { IDemo } from './types'
const { title } = labelConfig

const props = withDefaults(
    defineProps<{
        demoProp: IDemo
    }>(),
    {
        demoProp: () => 'demo',
    },
)
</script>
<script lang="ts">
export default {
    name: 'example-comp',
}
</script>

<style lang="scss" scoped>
.example-comp {
}
</style>

<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        module?: string
        goHome: () => void
    }>(),
    {
        module: () => '该页面',
        goHome: () => {},
    },
)
</script>

<template>
    <a-result status="404" :subtitle="`...'${module}'正在建设中...`">
        <template #extra>
            <a-space>
                <a-button type="primary" @click="goHome">返回主页</a-button>
            </a-space>
        </template>
    </a-result>
</template>

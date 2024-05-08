<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'

export interface IRouteMenu {
    default: string
    // 'vue-router' RouteRecordRaw
    menus: RouteRecordRaw[]
    goTo: (route: RouteRecordRaw) => void
    selectedKey: string
}

const props = withDefaults(defineProps<IRouteMenu>(), {
    default: () => '',
    menus: () => [],
    goTo: (route: RouteRecordRaw) => {},
    selectedKey: () => '',
})
</script>

<template>
    <a-menu
        class="app-menu"
        mode="horizontal"
        :default-selected-keys="[props.default]"
        :collapsed="false"
        :collapsed-width="1000"
        :selected-keys="[props.selectedKey]"
    >
        <a-menu-item
            v-for="menu in menus"
            :key="menu.path"
            :disabled="(menu.meta!.disable as boolean)"
            @click="props.goTo(menu)"
        >
            {{ menu.name }}
        </a-menu-item>
    </a-menu>
</template>

<style lang="scss" scoped>
.app-menu {
    line-height: 0.85rem;
    height: 0.85rem;
    font-size: 0.24rem;
    background-color: transparent;

    :deep(.arco-menu-inner) {
        overflow: hidden;
        padding: 0;
    }

    :deep(.arco-menu-disabled),
    :deep(.arco-menu-item.arco-menu-selected:hover) {
        background-color: transparent;
    }

    :deep(.arco-menu-selected-label) {
        bottom: -0.05rem;
        height: 0.03rem;
        background-color: rgb(var(--primary-6));
    }
}
</style>

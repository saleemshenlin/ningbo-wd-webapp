<template>
    <a-layout class="container-layout">
        <a-layout-header>
            <a-row justify="space-between" class="header-row">
                <a-col :span="6">
                    <div class="title">
                        <a-image
                            class="logo"
                            :preview="false"
                            width="36"
                            height="36"
                            fit="scale-down"
                            :src="dhiLogo"
                        />
                        <span>{{ APP_NAME }}</span>
                    </div>
                </a-col>
                <a-col :span="17">
                    <a-menu mode="horizontal" :default-selected-keys="[defaultKey]" theme="dark">
                        <template v-for="item in homeRoutes" :key="item.path">
                            <a-sub-menu
                                :key="item.path"
                                v-if="item.children?.filter((item) => !item?.meta?.hidden)?.length"
                            >
                                <template #icon v-if="item?.meta?.icon">
                                    <component :is="item.meta && item.meta.icon"> </component
                                ></template>
                                <template #title> {{ item.meta?.title }}</template>
                                <template
                                    :key="`/home/${item.path}/${child.path}`"
                                    v-for="child in item.children?.filter(
                                        (item) => !item?.meta?.hidden,
                                    )"
                                >
                                    <a-menu-item
                                        @click="jumpPath(`/home/${item.path}/${child.path}`)"
                                    >
                                        <template #icon v-if="item?.meta?.icon">
                                            <component :is="item.meta && child.meta?.icon">
                                            </component
                                        ></template>
                                        {{ child.meta?.title }}
                                    </a-menu-item>
                                </template>
                            </a-sub-menu>
                            <template v-else>
                                <a-menu-item
                                    v-if="!item?.meta?.hidden"
                                    :key="`/home/${item.path}`"
                                    @click="jumpPath(`/home/${item.path}`)"
                                >
                                    <template #icon v-if="item?.meta?.icon">
                                        <component :is="item.meta && item.meta.icon"> </component
                                    ></template>
                                    {{ item.meta?.title }}
                                </a-menu-item>
                            </template>
                        </template>
                    </a-menu>
                </a-col>
                <a-col :span="1">
                    <a-dropdown trigger="hover">
                        <div class="user" style="margin-right: 20px">
                            <a-avatar class="avatar">
                                <icon-user />
                            </a-avatar>
                            <!-- <div class="">
                                <div class="name">{{ user?.given_name }}</div>
                            </div> -->
                        </div>
                        <template #content>
                            <a-doption @click="doLogout()">
                                <template #icon>
                                    <icon-share-external />
                                </template>
                                <template #default> 登出 </template>
                            </a-doption>
                        </template>
                    </a-dropdown>
                </a-col>
            </a-row>
        </a-layout-header>
        <a-layout-content class="main-content">
            <router-view></router-view>
        </a-layout-content>
    </a-layout>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { homeRoutes } from '@/router/index'
import { APP_NAME } from '@/constant/index'
import dhiLogo from '@/assets/dhi_logo.svg'
import { useUserStore } from '@/store/User'
import { storeToRefs } from 'pinia'
document.title = APP_NAME
const router = useRouter()
const route = useRoute()
const store = useUserStore()
const { user } = storeToRefs(store)
// logger.debug('route path', route.path)
const defaultKey = computed(() => {
    const nowPath = route.path
    return nowPath
})
const jumpPath = (path: string) => {
    logger.debug('jump Path', path)
    router.push(path.replace(':area', 'kg'))
}

const doLogout = () => {
    store.logOut()
    router.replace('/')
}
</script>
<script lang="ts">
export default {
    name: 'layout',
}
</script>

<style lang="scss">
.container-layout {
    font-size: 24px;
    font-stretch: condensed;
    font-weight: 400;
    overflow: hidden;
    .arco-layout-header {
        z-index: 1000;
    }

    .header-row {
        height: 58px;
        color: var(--color-white);
        border-bottom: 2px solid var(--color-white);
        display: flex;
        align-items: center;
        background: var(--color-neutral-10);
        padding-left: 20px;
        .title {
            color: var(--color-white);
            font-size: 24px;
            font-weight: 600;
            display: flex;
            align-items: center;
            .logo {
                margin-right: 18px;
            }
        }
    }
    .arco-menu-overflow-wrap {
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
    .arco-menu {
        font-size: 20px;
    }
    .arco-menu-dark {
        background-color: transparent;
    }
    .arco-menu-horizontal .arco-menu-inner {
        height: 58px;
        padding: 0;
        overflow-y: hidden;
    }
    .arco-menu-dark .arco-menu-item:hover,
    .arco-menu-dark .arco-menu-group-title:hover,
    .arco-menu-dark .arco-menu-pop-header:hover,
    .arco-menu-dark .arco-menu-inline-header:hover,
    .arco-menu-dark .arco-menu-item,
    .arco-menu-dark .arco-menu-group-title,
    .arco-menu-dark .arco-menu-pop-header,
    .arco-menu-dark .arco-menu-inline-header {
        background-color: transparent;
        line-height: 58px;
    }

    .arco-menu-dark.arco-menu-horizontal .arco-menu-item.arco-menu-selected,
    .arco-menu-dark.arco-menu-horizontal .arco-menu-group-title.arco-menu-selected,
    .arco-menu-dark.arco-menu-horizontal .arco-menu-pop-header.arco-menu-selected,
    .arco-menu-dark.arco-menu-horizontal .arco-menu-inline-header.arco-menu-selected {
        background: var(--color-neutral-10);
    }

    .arco-menu-selected-label {
        right: 0;
        bottom: 0;
        left: 0;
    }
    .main-content {
        background: var(--color-fill-1);
        height: calc(100vh - 58px);
    }
}
</style>

import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Layout from '@/components/Layout/index.vue'
import { useUserStore } from '@/store/User'
import { LoginInBack } from 'dhi-dss-mf-login'
import { apiHelper, baseUrl } from '@/api/api'

export const homeRoutes: RouteRecordRaw[] = [
    {
        path: 'visualization',
        name: 'visualization',
        component: () => import('@/components/not-found/index.vue'),
        meta: {
            title: '在线报警预测',
        },
    },
    {
        path: 'scenario',
        name: 'scenario',
        component: () => import('@/components/not-found/index.vue'),
        meta: {
            title: '方案模拟分析',
        },
    },
    {
        path: 'pipe-risk',
        name: 'pipe-risk',
        component: () => import('@/components/not-found/index.vue'),
        meta: {
            title: '管道风险评估',
        },
    },
    {
        path: 'setting',
        name: 'setting',
        component: () => import('@/components/not-found/index.vue'),
        meta: {
            title: '系统设置',
        },
    },
]

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/login',
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/index.vue'),
        meta: {
            title: '登录',
        },
    },
    {
        path: '/home',
        component: Layout,
        redirect: '/home/visualization',
        children: [...homeRoutes],
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach(async (to, from) => {
    if (to.path.includes('login')) {
        return true
    }
    const userStore = useUserStore()
    if (to.path.includes('scenario')) {
        // tj 项目
        const rep = await LoginInBack.loginInBackground(
            {
                tenantId: '3a0a3358-64ee-0e4c-2f55-4589bf1efde2',
                tenantName: 'tj-wd-webapp',
            },
            {
                username: 'tianjinwd',
                password: '955555=hot',
                tenantId: '3a0a3358-64ee-0e4c-2f55-4589bf1efde2',
            },
            baseUrl,
        )
        await userStore.projectInitialization(
            '3a0a3358-64ee-0e4c-2f55-4589bf1efde2',
            apiHelper,
            rep,
        )
    } else if (to.path.includes('visualization')) {
        // tz 项目
        const rep = await LoginInBack.loginInBackground(
            {
                tenantId: '3a079140-bac6-064f-fd97-577ada1dd61f',
                tenantName: 'tz-wd-webapp',
            },
            {
                username: 'taizhouwd',
                password: '955555=hot',
                tenantId: '3a079140-bac6-064f-fd97-577ada1dd61f',
            },
            baseUrl,
        )
        await userStore.projectInitialization(
            '3a079140-bac6-064f-fd97-577ada1dd61f',
            apiHelper,
            rep,
        )
    } else {
        const rep = await LoginInBack.loginInBackground(
            {
                tenantId: '3a126e29-7c80-5b8c-b855-4f71f1747f3e',
                tenantName: 'nb-wd-webapp',
            },
            {
                username: 'ningbowd',
                password: '955555=hot',
                tenantId: '3a126e29-7c80-5b8c-b855-4f71f1747f3e',
            },
            baseUrl,
        )
        await userStore.projectInitialization(
            '3a126e29-7c80-5b8c-b855-4f71f1747f3e',
            apiHelper,
            rep,
        )
    }

    return true
})

export default router

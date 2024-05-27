import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Layout from '@/components/Layout/index.vue'

export const homeRoutes: RouteRecordRaw[] = [
    {
        path: 'visualization',
        name: 'visualization',
        component: () => import('@/views/online-warning/index.vue'),
        meta: {
            title: '在线报警预测',
        },
    },
    {
        path: 'valve-shutdown',
        name: 'valve-shutdown',
        component: () => import('@/components/not-found/index.vue'),
        meta: {
            title: '关阀模拟',
        },
    },
    {
        path: 'pipe-risk',
        name: 'pipe-risk',
        component: () => import('@/components/not-found/index.vue'),
        meta: {
            title: '管线风险评估',
        },
    },
    {
        path: 'pipe-flushing',
        name: 'pipe-flushing',
        component: () => import('@/components/not-found/index.vue'),
        meta: {
            title: '管道冲洗',
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

export default router

import dts from 'vite-plugin-dts'
import { defineConfig, splitVendorChunkPlugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslintPlugin from 'vite-plugin-eslint'
import viteCompression from 'vite-plugin-compression'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        port: 51110,
        proxy: {
            '/api/v1/iot': {
                target: 'http://172.23.21.80:42003/',
                changeOrigin: true,
                // rewrite: (path) => path.replace(/^\/api/, ''),
            },
            '/api/v1/device-indicator': {
                target: 'http://172.23.21.43:32007/',
                changeOrigin: true,
                // rewrite: (path) => path.replace(/^\/api/, ''),
            },
            '/identity-service/': {
                target: 'http://172.23.21.148:10000',
                changeOrigin: true,
            },
            '/device-management/user-manager/': {
                target: 'http://172.23.21.148:10000/identity-service',
                changeOrigin: true,
                rewrite: (path) => path.replace('/device-management/user-manager', ''),
            },
            '/device-management/user-manager/connect': {
                target: 'http://172.23.21.148:10000/identity-service',
                changeOrigin: true,
                rewrite: (path) => path.replace('/device-management/user-manager', ''),
            },
            '/user-manager/': {
                target: 'http://172.23.21.148:10000/identity-service',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/user-manager/, ''),
            },
            '/user-manager/connect': {
                target: 'http://172.23.21.148:10000/identity-service',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/user-manager/, ''),
            },
            '/device-management/user_manager/TenantFiles': {
                target: 'http://172.23.21.148:10000/identity-service/TenantFiles',
                changeOrigin: true,
                rewrite: (path) => {
                    console.log('path :>> ', path)
                    return path.replace('/device-management/user_manager/TenantFiles', '')
                },
            },
            '/tj-wd/user_manager/TenantFiles': {
                target: 'http://172.23.21.148:10000/identity-service/TenantFiles',
                changeOrigin: true,
                rewrite: (path) => {
                    console.log('path :>> ', path)
                    return path.replace('/tj-wd/user_manager/TenantFiles', '')
                },
            },
            // 香港项目
            '/hk-wwtp/user-manager/connect': {
                target: 'http://172.23.21.253:10000/identity-service',
                changeOrigin: true,
                rewrite: (path) => path.replace('/hk-wwtp/user-manager', ''),
            },
        },
    },
    plugins: [
        vue(),
        // 添加下面这块
        eslintPlugin({
            include: ['src/**/*.ts', 'src/**/*.vue', 'src/*.ts', 'src/*.vue'],
            emitWarning: false,
            emitError: false,
        }),
        splitVendorChunkPlugin(),
        // gzip
        viteCompression({ filter: /\.(css|js|svg|html|ico|map)$/, threshold: 0 }),
        dts({ include: './src' }),
    ],
    // css: {
    //     preprocessorOptions: {
    //         scss: {
    //             additionalData: '@import "./style.scss";',
    //         },
    //     },
    // },
    build: {
        lib: {
            entry: {
                main: path.resolve(__dirname, 'src/export.ts'),
                'change-password': path.resolve(__dirname, 'src/pages/ChangePassword/index.ts'),
                login: path.resolve(__dirname, 'src/pages/SingleLogin/index.ts'),
                'phone-login': path.resolve(__dirname, 'src/pages/PhoneLogin/index.ts'),
                'login-system': path.resolve(
                    __dirname,
                    'src/pages/LoginSystemConfiguration/index.ts',
                ),
            },
            name: 'dhi.dss.login',
            fileName: (format, entryName) => {
                console.log('vite build lib :>> ', format, entryName, `${entryName}.${format}.js`)
                switch (entryName) {
                    case 'main':
                        return `dhi.dss.login.${format}.js`
                    default:
                        return `dhi.dss.login.${entryName}.${format}.js`
                }
            },
        },
        sourcemap: true,
        rollupOptions: {
            // 确保外部化处理那些你不想打包进库的依赖
            external: [
                'vue',
                'lodash',
                /^@arco-design\/web-vue.*$/,
                /^@dhicn\/domain-paas-sdk-ts.*$/,
                /^@dhicn\/helper\/.*$/,
            ],
            output: {
                // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
                globals: {
                    vue: 'Vue',
                },
                exports: 'named',
            },
        },
    },
})

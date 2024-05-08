import dts from 'vite-plugin-dts'
import { defineConfig, splitVendorChunkPlugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslintPlugin from 'vite-plugin-eslint'
import viteCompression from 'vite-plugin-compression'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        // 添加下面这块
        eslintPlugin({
            include: ['src/**/*.ts', 'src/**/*.vue', 'src/*.ts', 'src/*.vue'],
        }),
        splitVendorChunkPlugin(),
        // gzip
        viteCompression({ filter: /\.(css|js|svg|html|ico|map)$/, threshold: 0 }),
        dts({ include: './src' }),
    ],
    build: {
        lib: {
            entry: {
                main: path.resolve(__dirname, 'src/export.ts'),
                message: path.resolve(__dirname, 'src/message/index.ts'),
                'layout-not-found': path.resolve(__dirname, 'src/components/NotFound/index.ts'),
                'layout-logo': path.resolve(__dirname, 'src/components/SingleLogo/index.ts'),
                'layout-logo-title': path.resolve(
                    __dirname,
                    'src/components/TitleWithLogo/index.ts',
                ),
                'layout-top-nav': path.resolve(__dirname, 'src/components/TopNavMenu/index.ts'),
                'layout-check-table': path.resolve(
                    __dirname,
                    'src/components/check-table/index.ts',
                ),
                'layout-input-table': path.resolve(
                    __dirname,
                    'src/components/input-table/index.ts',
                ),
                'layout-input-chart': path.resolve(
                    __dirname,
                    'src/components/input-chart/index.ts',
                ),
                'layout-menu-checkbox': path.resolve(
                    __dirname,
                    'src/components/menu-checkbox/index.ts',
                ),
                'layout-scenario-editor': path.resolve(
                    __dirname,
                    'src/components/scenario-editor/index.ts',
                ),
                'layout-animation-control': path.resolve(
                    __dirname,
                    'src/components/animation-control/index.ts',
                ),
                'layout-operation-log': path.resolve(
                    __dirname,
                    'src/components/operation-log/index.ts',
                ),
                'layout-result-item': path.resolve(
                    __dirname,
                    'src/components/result-item/index.ts',
                ),
                'layout-legend-item': path.resolve(
                    __dirname,
                    'src/components/legend-item/index.ts',
                ),
                'layout-layer-control': path.resolve(
                    __dirname,
                    'src/components/layer-control/index.ts',
                ),
                'layout-auto-scroll-list': path.resolve(
                    __dirname,
                    'src/components/auto-scroll-list/index.ts',
                ),
            },
            name: 'dhi.dss.layout',
            fileName: (format, entryName) => {
                switch (entryName) {
                    case 'main':
                        return `dhi.dss.layout.${format}.js`
                    default:
                        // console.log(
                        //     'vite build lib :>> ',
                        //     format,
                        //     entryName,
                        //     `${entryName}.${format}.js`,
                        // )
                        return `dhi.dss.layout.${entryName}.${format}.js`
                }
            },
        },
        sourcemap: true,
        rollupOptions: {
            // 确保外部化处理那些你不想打包进库的依赖
            external: [
                'vue',
                'lodash',
                'dayjs',
                /^@dhicn\/helper.*$/,
                /^@arco-design\/web-vue.*$/,
                /^@dhicn\/chart.*$/,
            ],
        },
    },
})

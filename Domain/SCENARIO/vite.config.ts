import dts from 'vite-plugin-dts'
import { defineConfig, splitVendorChunkPlugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslintPlugin from 'vite-plugin-eslint'
import viteCompression from 'vite-plugin-compression'
import path from 'path'
import vueI18n from '@intlify/unplugin-vue-i18n/vite'

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
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
        vueI18n({
            runtimeOnly: false,
            include: [path.resolve(__dirname, './src/locales/**')],
        }),
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
                'scenario-table': path.resolve(__dirname, 'src/components/scenario-table/index.ts'),
                'scenario-editor': path.resolve(
                    __dirname,
                    'src/components/scenario-editor/index.ts',
                ),
                'scenario-editor-model-template': path.resolve(
                    __dirname,
                    'src/components/scenario-editor-model-template/index.ts',
                ),
            },
            name: 'dhi.dss.scenario',
            formats: ['es'],
            fileName: (format, entryName) => {
                console.log('vite build lib :>> ', format, entryName, `${entryName}.${format}.js`)
                switch (entryName) {
                    case 'main':
                        return `dhi.dss.domain.scenario.${format}.js`
                    default:
                        return `dhi.dss.domain.scenario.${entryName}.${format}.js`
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
                'vue-i18n',
                /^@dhicn\/helper.*$/,
                /^dhi-dss-api-store.*$/,
                /^@arco-design\/web-vue.*$/,
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
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: '@import "src/style.scss";',
            },
        },
    },
})

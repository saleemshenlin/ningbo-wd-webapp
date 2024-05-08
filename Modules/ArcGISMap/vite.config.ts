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
        chunkSizeWarningLimit: 2000,
        lib: {
            entry: {
                main: path.resolve(__dirname, 'src/export.ts'),
                'wd-map': path.resolve(__dirname, 'src/pages/WDMap/index.ts'),
                'wq-map': path.resolve(__dirname, 'src/pages/WQMap/index.ts'),
                'wq-map-v2': path.resolve(__dirname, 'src/pages/WQMapV2/index.ts'),
                'uf-map': path.resolve(__dirname, 'src/pages/UFMap/index.ts'),
                'valve-map': path.resolve(__dirname, 'src/pages/ValveMap/index.ts'),
                'statistic-map': path.resolve(__dirname, 'src/pages/StatisticMap/index.ts'),
                'risk-map': path.resolve(__dirname, 'src/pages/RiskMap/index.ts'),
                'repair-map': path.resolve(__dirname, 'src/pages/RepairMap/index.ts'),
                proj: path.resolve(__dirname, 'src/proj/index.ts'),
                helper: path.resolve(__dirname, 'src/helper/index.ts'),
                arcgisHelper: path.resolve(__dirname, 'src/arcgisHelper/index.ts'),
            },
            name: 'dhi.dss.map.arcgis',
            formats: ['es'],
            fileName: (format, entryName) => {
                switch (entryName) {
                    case 'main':
                        return `dhi.dss.map.arcgis.${format}.js`
                    default:
                        // console.log(
                        //     'vite build lib :>> ',
                        //     format,
                        //     entryName,
                        //     `${entryName}.${format}.js`,
                        // )
                        return `dhi.dss.map.arcgis.${entryName}.${format}.js`
                }
            },
        },
        sourcemap: true,
        rollupOptions: {
            // 确保外部化处理那些你不想打包进库的依赖
            external: ['vue', 'lodash', 'dayjs', /^@dhicn\/helper.*$/, /^@geoscene\/core.*$/],
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

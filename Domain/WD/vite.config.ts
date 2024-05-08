import dts from 'vite-plugin-dts'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslintPlugin from 'vite-plugin-eslint'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        eslintPlugin({
            include: ['src/**/*.ts', 'src/**/*.vue', 'src/*.ts', 'src/*.vue'],
        }),
        dts(),
    ],
    build: {
        lib: {
            entry: {
                main: path.resolve(__dirname, 'src/export.ts'),
                'alarm-log': path.resolve(__dirname, 'src/components/AlarmLog/index.ts'),
                'animation-control': path.resolve(
                    __dirname,
                    'src/components/AnimationControl/index.ts',
                ),
                'daily-water-volume': path.resolve(
                    __dirname,
                    'src/components/DailyWaterVolume/index.ts',
                ),
                'device-ts-data': path.resolve(__dirname, 'src/components/DeviceTSData/index.ts'),
                'map-layer-control': path.resolve(
                    __dirname,
                    'src/components/MapLayerControl/index.ts',
                ),
                'map-legend': path.resolve(__dirname, 'src/components/MapLegend/index.ts'),
                'map-popup': path.resolve(__dirname, 'src/components/Popup/index.ts'),
                'profile-data': path.resolve(__dirname, 'src/components/ProfileData/index.ts'),
                'profile-map': path.resolve(__dirname, 'src/components/ProfileMap/index.ts'),
                'result-item': path.resolve(__dirname, 'src/components/ResultItem/index.ts'),
                'result-map': path.resolve(__dirname, 'src/components/ResultMap/index.ts'),
                'result-map-valve': path.resolve(
                    __dirname,
                    'src/components/ResultMapValve/index.ts',
                ),
                'layer-control': path.resolve(__dirname, 'src/components/LayerControl/index.ts'),
                'result-statistic': path.resolve(
                    __dirname,
                    'src/components/ResultStatistic/index.ts',
                ),
                'tank-storage': path.resolve(__dirname, 'src/components/TankStorage/index.ts'),
            },
            name: 'dhi.dss.domain-wd',
            formats: ['es'],
            fileName: (format, entryName) => {
                console.log('vite build lib :>> ', format, entryName, `${entryName}.${format}.js`)
                switch (entryName) {
                    case 'main':
                        return `dhi.dss.domain-wd.${format}.js`
                    default:
                        return `dhi.dss.domain-wd.${entryName}.${format}.js`
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
                /^@dhicn\/domain-paas-sdk-ts.*$/,
                /^@arco-design\/web-vue.*$/,
                /^@geoscene\/core.*$/,
                /^@dhicn\/chart.*$/,
                /^dhi-dss-mf-map-arcgis.*$/,
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

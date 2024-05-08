import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import eslintPlugin from 'vite-plugin-eslint'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    plugins: [
        dts(),
        eslintPlugin({
            include: ['src/**/*.ts', 'src/**/*.vue', 'src/*.ts', 'src/*.vue'],
        }),
    ],
    build: {
        lib: {
            entry: {
                main: path.resolve(__dirname, 'src/main.ts'),
                scenario: path.resolve(__dirname, 'src/Scenario/index.ts'),
                'model-driver': path.resolve(__dirname, 'src/ModelDriver/index.ts'),
                'compute-service': path.resolve(__dirname, 'src/ComputeService/index.ts'),
                'wd-domain': path.resolve(__dirname, 'src/WDDomain/index.ts'),
                'model-Configuration': path.resolve(__dirname, 'src/ModelConfiguration/index.ts'),
                'model-information': path.resolve(__dirname, 'src/ModelInformation/index.ts'),
                'result-service': path.resolve(__dirname, 'src/ResultService/index.ts'),
                iot: path.resolve(__dirname, 'src/Iot/index.ts'),
                wwtp: path.resolve(__dirname, 'src/WWTP/index.ts'),
                'model-point-map': path.resolve(__dirname, 'src/ModelPointMap/index.ts'),
                'identity-service': path.resolve(__dirname, 'src/IdentityService/index.ts'),
                'gis-service': path.resolve(__dirname, 'src/GISService/index.ts'),
            },
            name: 'dhi-dss-store',
            fileName: (format, entryName) => {
                console.log('vite build lib :>> ', format, entryName, `${entryName}.${format}.js`)
                switch (entryName) {
                    case 'main':
                        return `dhi-dss-store.${format}.js`
                    default:
                        return `dhi-dss-store.${entryName}.${format}.js`
                }
            },
        },
        rollupOptions: {
            // 确保外部化处理那些你不想打包进库的依赖
            external: ['vue', 'lodash', 'dayjs', '@dhicn/helper', 'pinia'],
        },
    },
})

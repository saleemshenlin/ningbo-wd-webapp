import { defineConfig, splitVendorChunkPlugin } from 'vite'
import vue from '@vitejs/plugin-vue'
// import eslintPlugin from "vite-plugin-eslint";
import { vitePluginForArco } from '@arco-plugins/vite-vue'
import viteCompression from 'vite-plugin-compression'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    server: {
        port: 51110,
        proxy: {
            '/ningbo-wd': {
                target: 'http://172.23.21.80:1110/',
                changeOrigin: true,
            },
        },
    },
    plugins: [
        vue(),
        vitePluginForArco({
            style: 'css',
        }),
        // 添加下面这块
        // eslintPlugin({
        //   include: ["src/**/*.ts", "src/**/*.vue", "src/*.ts", "src/*.vue"],
        // }),
        splitVendorChunkPlugin(),
        // gzip
        viteCompression({ filter: /\.(css|js|svg|html|ico|map)$/, threshold: 0 }),
        //
        VueI18nPlugin({
            runtimeOnly: false,
            include: path.resolve(__dirname, './src/locales/**'),
        }),
    ],
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: '@import "./src/css/app.scss";',
            },
        },
    },
    // build: {
    //   chunkSizeWarningLimit: 900,
    // },
})

import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import eslintPlugin from 'vite-plugin-eslint'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      name: 'dhi-dss-package-excel',
      fileName: (format) => `dhi-dss-package-excel.${format}.js`,
    },
    sourcemap: true,
  },
  plugins: [
    dts(),
    eslintPlugin({
      include: ['src/**/*.ts', 'src/*.ts'],
    }),
  ],
})

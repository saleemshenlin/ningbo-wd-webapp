TODO: Give a short introduction of your project. Let this section explain the objectives or the motivation behind this project.

# Getting Started

TODO: Guide users through getting your code up and running on their own system. In this section you can talk about:

1. [rushjs+pnpm 之 monorepo 初探](https://juejin.cn/post/6958360065577320485#heading-7)
2. [rushjs+pnpm 之 monorepo rush 进阶](https://juejin.cn/post/6991420751190425613)
3. [rushjs](https://rushjs.io/)
4. 重新安装依赖

```powershell
rush update --purge
```

5. [用 Vue 3+Vite+TypeScript 从 0 打造一个 UI 组件库](https://juejin.cn/post/6987562123182211080)
6. [vue3+vite 配置 eslint&prettier](https://juejin.cn/post/6975442828386107400)
7. [Vite vue3 EsLint](https://www.jianshu.com/p/4b94540dd998)

# Create new Package

1. 通过命令行 CD 到目标目录

```powershell
cd D:\DHI-Project\DHI.DSS.WebApp\Domain
```

2. 通过命令行 执行 pnpm create vite

```powershell
pnpm create vite
```

3. 创建项目

- Project name 是文件夹名称，首字母大写，例如 WWTP ，
- Package name 包名全小写横杠连接，"dhi-dss-**XXX-XXX**" , 例如"dhi-dss-domain-wwtp"
- Framework: 选择 Vue
- variant 选择 Typescript
- 创建好后 D:\DHI-Project\DHI.DSS.WebApp\Domain\WWTP

4. 拷贝 \*\*.eslintrc.js, .gitignore,.prettierignore,.prettierrc.js

5. 更新 package.json，,**注意项目名、项目路径和打包后的文件名**，package 打包发布和网站打包发布不一致

```json 包发布 **XXX-XXX** 是包名称，dependencies 和 devDependencies 每个项目不一致，需要自行删减
{
  "name": "dhi-dss-XXX-XXX",
  "private": true,
  "version": "0.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build",
    "build-dhi": "vue-tsc --noEmit && vite build",
    "preview": "vite preview",
    "lint": "eslint --ext .ts,.vue --ignore-path .eslintignore --fix src",
    "format": "prettier .  --write"
  },
  "files": ["dist", "src"],
  "module": "./dist/dhi.dss.XXX.XXX.es.js",
  "main": "./dist/dhi.dss.XXX.XXX.umd.js",
  "types": "./dist/export.d.ts",
  "exports": {
    ".": {
      "import": "./dist/dhi.dss.XXX.XXX.es.js",
      "require": "./dist/dhi.dss.XXX.XXX.umd.js"
    },
    "./dist/style.css": {
      "import": "./dist/style.css",
      "require": "./dist/style.css"
    }
  },
  "dependencies": {
    "vue": "^3.4.3",
    "lodash": "~4.17.21"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.2.3",
    "typescript": "^4.7.4",
    "vite": "^4.3.2",
    "vue-tsc": "^1.0.6",
    "eslint": "~8.23.0",
    "vite-plugin-eslint": "~1.8.1",
    "eslint-plugin-vue": "~9.4.0",
    "eslint-config-standard-with-typescript": "^43.0.0",
    "eslint-plugin-n": "^16.6.2",
    "eslint-plugin-promise": "^6.1.1",
    "@typescript-eslint/parser": "~5.36.1",
    "@typescript-eslint/eslint-plugin": "~5.36.1",
    "eslint-plugin-import": "~2.26.0",
    "prettier": "~2.7.1",
    "eslint-config-prettier": "~8.5.0",
    "eslint-plugin-prettier": "~4.2.1",
    "eslint-plugin-n": "~15.2.5",
    "eslint-plugin-promise": "~6.0.1",
    "@arco-plugins/vite-vue": "~1.4.5",
    "consola": "~2.15.3",

    "node-sass": "~8.0.0",

    "@types/lodash": "~4.14.185",
    "vite-plugin-compression": "~0.5.1",
    "vite-plugin-dts": "^3.7.3"
  }
}
```

```json 网页打包发布
{
  "name": "dhi-dss-app-XXX-XXX",
  "private": true,
  "version": "0.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build --base=/tz-wd/",
    "build-dhi": "vue-tsc --noEmit && vite build --base=/tz-wd-dhi/",
    "build-tz": "vue-tsc --noEmit && vite build --base=/tz-wd/ --mode tz",
    "preview": "vite preview",
    "lint": "eslint --ext .ts,.vue --ignore-path .eslintignore --fix src",
    "format": "prettier .  --write"
  },
  "dependencies": {
    "vue": "^3.3.12"
   "@arco-design/web-vue":  "^2.53.3",
    "pinia": "2.1.3",
    "dhi-dss-mf-apiservice": "workspace:*",
    "lodash": "~4.17.21",
    "vue-router": "~4.1.5",
    "dhi-dss-mf-login": "workspace:*",
    "@dhicn/helper": "~0.0.14",
    "@dhicn/chart": "~0.0.12",
    "dhi-dss-mf-layout": "workspace:*",
    "dhi-dss-mf-map-arcgis": "workspace:*",
    "@turf/helpers": "~6.5.0",
    "dhi-dss-domain-wd": "workspace:*",
    "dhi-dss-data-store": "workspace:*"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.2.3",
    "typescript": "^4.7.4",
    "vite": "^4.3.2",
    "vue-tsc": "^1.0.6",
    "eslint": "~8.23.0",
    "vite-plugin-eslint": "~1.8.1",
    "eslint-plugin-vue": "~9.4.0",
    "eslint-config-standard-with-typescript": "^43.0.0", "eslint-plugin-n": "^16.6.2", "eslint-plugin-promise": "^6.1.1",
    "@typescript-eslint/parser": "~5.36.1",
    "@typescript-eslint/eslint-plugin": "~5.36.1",
    "eslint-plugin-import": "~2.26.0",
    "prettier": "~2.7.1",
    "eslint-config-prettier": "~8.5.0",
    "eslint-plugin-prettier": "~4.2.1",
    "eslint-plugin-n": "~15.2.5",
    "eslint-plugin-promise": "~6.0.1",
    "@arco-plugins/vite-vue": "~1.4.5",
    "consola": "~2.15.3",


    "node-sass": "~8.0.0",

    "@types/lodash": "~4.14.185",
    "vite-plugin-compression": "~0.5.1"
  }
}
```

6. 更新 vite.config.ts,**注意项目名、项目路径和打包后的文件名**，package 打包发布和网站打包发布不一致

```typescript 包发布 每个项目不一致，需要自行删减
import dts from 'vite-plugin-dts';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import eslintPlugin from 'vite-plugin-eslint';
import { createStyleImportPlugin } from 'vite-plugin-style-import';
import { vitePluginForArco } from '@arco-plugins/vite-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    createStyleImportPlugin({
      libs: [
        {
          libraryName: '@arco-design/web-vue',
          esModule: true,
          resolveStyle: (name) => {
            // css
            return `@arco-design/web-vue/es/${name}/style/css.js`;
          },
        },
      ],
    }),
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
      entry: path.resolve(__dirname, 'src/export.ts'),
      name: 'dhi.dss.login',
      fileName: (format) => `dhi.dss.domain.wd.${format}.js`,
    },
    sourcemap: true,
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
        },
        exports: 'named',
      },
    },
  },
});
```

```typescript 网页发布实例
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import eslintPlugin from 'vite-plugin-eslint';
import { createStyleImportPlugin } from 'vite-plugin-style-import';
import { vitePluginForArco } from '@arco-plugins/vite-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 51110,
    proxy: {},
  },
  plugins: [
    vue(),
    createStyleImportPlugin({
      libs: [
        {
          libraryName: '@arco-design/web-vue',
          esModule: true,
          resolveStyle: (name) => {
            // css
            return `@arco-design/web-vue/es/${name}/style/css.js`;
          },
        },
      ],
    }),
    // 添加下面这块
    eslintPlugin({
      include: ['src/**/*.ts', 'src/**/*.vue', 'src/*.ts', 'src/*.vue'],
    }),
    splitVendorChunkPlugin(),
    // gzip
    viteCompression({ filter: /\.(css|js|svg|html|ico|map)$/, threshold: 0 }),
    // jsx
    vueJsx(),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "src/css/app.scss";',
      },
    },
  },
});
```

7. 删除不必要的文件，包发布不需要 public, App.vue，index.html 等，这一步每个包都不一致

8. 加入到 rush.json 中的 projects

```json
    {
      "packageName": "dhi-dss-domain-wwtp",
      "projectFolder": "Domain/WWTP",
      "reviewCategory": "production",
      "tags": ["domain", "components"]
    },
```

9. 更新依赖库和编译包文件

```powershell
rush update
```

# Authoring change logs

## Start with a verb. These verbs are recommended:

- Add - when you introduce or expose a new feature, property, class, UI, etc.
- Remove - when you fully removed something and it can no longer be used.
- Deprecate - when you plan on removing something, but it is still accessible.
- Fix an issue with/where... - when you fixed a bug.
- Improve - when you made an existing thing better.
- Update - when you refresh something, but don't necessarily make it better.
- Upgrade - when upgrading the version of a dependency.
- Initial/Beta release of ... - when releasing a brand-new feature.

Don't use the word bug. Use issue instead.

Don't use shorthand words or acronyms, unless they are widely recognized (e.g. "HTTP")

Use correct spelling and grammar. The CHANGELOG.md is part of your package's published documentation.

When referring to public API changes, use the () suffix to indicate a function name, e.g. setSomethingOnWebpart()

When referring to public API changes, use backticks (` `) around class and property names.

When documenting an upgrade, indicate the old and new version. For example: "Upgraded widget-library from 1.0.2 to 2.0.1"

If fixing a GitHub issue, consider adding the issue URL in parentheses.

Don't add a trailing period unless you have two or more sentences.

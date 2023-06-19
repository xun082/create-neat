## Create-Neat

### 一、背景 📖

在刚开始学习 `React` 的时候，使用的脚手架就是 `create-react-app`，虽然这个脚手架提供的零配置、开箱即用很适合新手，但是要想对其进行扩展就非常麻烦。要想对其进行扩展你必须 `eject` 或者 使用 `carco` 进行配置。

尽管 `Typescript` 已经流行了很久，但是要从零设计一个 `Typescript` 库依旧麻烦，本人也曾有过从零搭建一个 `React` 组件库的想法，但是对一堆陌生的配置望而生畏。

`Create-Neat` 就是为了解决这些问题应运而生的，解决以上所有问题，开箱即用，零配置 🚀🚀🚀

### 二、特性 🧰

- 📦 零配置,开箱即用;
- 🚀 使用 `axios` + `npm` 的方式构建你的项目基础模板，初始化速度要比 `create-react-app` 快;
- 💯 代码风格统一，项目统一配置 `Eslint`、`Prettier`、`Husky`;
- 🥂 使用 `Rollup` 打包你的 `Typescript` 库，支持 `UMD`、`CJS`、`ESM` 输出格式，并生成全局 `.d.ts` 文件;
- 🍻 支持用户自定义 `Rollup` 配置扩展原有的配置，为项目添加特有的功能;
- 🥂 使用 `Webpack` 打包你的 `Web` 应用程序,实现多环境打包部署，代码分割优化，配合官方分析工具，实时优化代码;
- 🍻 支持用户自定义 `Webpack` 配置扩展原有的配置，为项目添加特有的功能;
- 🎯 支用户自定义 `Babel` 配置，让你的程序更健壮;
- 📕 友好的日志输出，让你快速定位问题所在以及增加开发体验;
- 在使用 `Husky` 的情况下使用 `standard-version` 自动生成 `CHANGELOG` 文件;
- 🔸 等等......

### 三、快速开始 🚩

```
npx create-neat my-app
cd my-app
npm start
```

如果你之前已经通过 `npm install -g create-neat` 全局安装了 `create-neat`，我们建议你使用 `npm uninstall -g create-neat` 或 `yarn global remove create-neat` 来卸载这个包，以确保 npx 总是使用最新的版本。

当你在终端中输入 `npx create-neat my-app` 时，控制台会有以下选项功能选择:

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b1423eca147545c698bec5b7f30f2da2~tplv-k3u1fbpfcp-zoom-1.image)

`create-neat` 会根据你的创建不同的应用程序，这些应用程序都是开箱即用，无需配置，其中:

- `common-lib`：一个基础的 `Typescript` 库，您可以使用该模板来编写一个类似于 `lodash` 的工具库;
- `react-ui`: 为你快速创建一个 `react` 组件库，内置 `storybook` 让你快速编写你的组件库文档，并且使用 `standard-version` 自动为你生成 `CHANGELOG` 文件;
- 剩下的四个都是为你创建不用的 `web` 应用程序，其中 `vue` 同时支持 `.vue` 和 `.tsx` 的语法。

如果项目创建成功，会有如下效果图所示:

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe46e77448d54c14aebf4557db949883~tplv-k3u1fbpfcp-zoom-1.image)

> 更多使用方式后续会在 [掘金](https://juejin.cn/user/3782764966460398/posts) 中以文章方式呈现出来，感兴趣的小伙伴可以关注一下。

### 四、 创建应用程序 📕

要创建一个新的应用程序，您可以选择以下方法之一:

#### NPX

```
npx create-neat my-app
```

#### NPM

```
npm init neat my-app
```

#### YARN

```
yarn create neat my-app
```

它将在当前文件夹中创建一个名为 my-app 的目录。
在该目录中，它将根据你所选择的项目类型生成不同的初始项目结构并根据你所选择的包管理工具进行安装可传递的依赖项，例如当你选择 `react-ui` 时会为你创建一个开箱即用的组件库模板,具体目录结构如下所示:

```
├───📁 .husky/
│   ├───📄 commit-msg
│   └───📄 pre-commit
├───📁 .storybook/
│   ├───📄 main.js
│   └───📄 preview.js
├───📁 .vscode/
│   └───📄 settings.json
├───📁 example/
│   ├───📄 App.tsx
│   ├───📄 index.html
│   ├───📄 index.tsx
│   ├───📄 package.json
│   └───📄 tsconfig.json
├───📁 src/
│   ├───📁 components/
│   │   └───...
│   └───📄 index.tsx
├───📁 stories/
│   └───📄 button.stories.tsx
├───📄 .eslintignore
├───📄 .eslintrc.json
├───📄 .gitignore
├───📄 .prettierignore
├───📄 .prettierrc.json
├───📄 babel.config.js
├───📄 commitlint.config.js
├───📄 package.json
├───📄 pnpm-lock.yaml
└───📄 tsconfig.json
```

无需配置或复杂的文件夹结构，只有构建应用程序所需的文件。

安装完成后，你可以打开你的项目文件夹:

```
cd my-app
```

在新创建的项目中，您可以运行一些内置命令:

#### `npm start`、`pnpm start` 或者 `yarn start`

如果你使用的是 `web` 相对应的项目类型，则在开发模式下运行应用程序并自动打开 [http://localhost:3000](http://localhost:3000) 在浏览器中进行查看，否则则使用 `Rollup` 中的 `watch` 钩子在命令行终端中监听您文件的变化。

#### `npm build`、`pnpm build` 或者 `yarn build`

如果您使用的是 `web` 应用程序，使用该命令则会将其应用程序优化构建以获得最佳性能并将其存放与 `dist` 目录下。

如果您在项目初始化的时候选择的 `common-lib` 或者 `react-ui`,那么该应用程序将会使用 `Rollup` 进行打包构建，并根据你所传入的参数构建成不同格式的文件,完整参数配置如下所示:

```
Usage
  $ rollup-script build [options]

Options
  --target              指定目标环境  默认使用 web
  --name                指定在 UMD 模式构建中全局的名称
  --format              指定模式格式(cjs，esm，umd)  默认是 esm

Examples
  $ rollup-script build --target node
  $ rollup-script build --name Foo
  $ rollup-script build --format cjs,esm,umd
  $ rollup-script build --format umd --name Foo
```

### Babel

您可以将自己的 `Babel` 配置添加到项目的根目录当中, `create-neat` 会将其与自己原有的 `Babel` 转换合并并且将新的预设和插件放在列表的末尾。

#### Example

```js
// babel.config.js

module.exports = {
  plugins: ["babel-plugin-styled-components"],
};
```

### webpack

> ⚠️ Warning
> 这些修改有可能覆盖 `create-neat` 的默认行为和配置，请谨慎使用!

如果您想扩展 `webpack` 配置已增加项目对不同功能的支持或者增加项目性能，您可以在 `webpack.config.js` 文件下对 `webpack` 配置进行扩展.并且您可以使用 `process.env.NODE_ENV` 以区分开发环境和生产环境。

#### Example

```js
// webpack.config.js

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const isDevelopment = process.env.NODE_ENV === "development";

module.exports = {
  plugins: [isDevelopment && MiniCssExtractPlugin()],
};
```

### Rollup

> ⚠️ Warning
> 这些修改有可能覆盖 `create-neat` 的默认行为和配置，请谨慎使用!

如果你选择的项目类型是 `common-lib` 或者 `react-ui` 并且您希望更改 `Rollup` 配置，可以在项目的根目录下创建一个名为 `rollup.config.js` 的文件，示例代码如下所示:

```js
module.exports = {
  rollup(config, options) {
    return config;
  },
};
```

#### Example

```js
const postcss = require("rollup-plugin-postcss");

module.exports = {
  rollup(config, options) {
    config.plugins.push(postcss());
    return config;
  },
};
```

### 五、捐赠 🍵

> 如果你正在使用这个项目或者对这个项目感兴趣，可以通过以下方式支持我:

- **Star、Fork、Watch** 一键三连 🚀🚀

> 我们很乐意在 `create-neat` 中得到您的帮助，看到您的贡献，如果你想获取到更多信息以及如何开始，请扫描进群:

<center>
<img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5cd5949ed05749968c36edaddb024f5d~tplv-k3u1fbpfcp-watermark.image?" width="400" height="300" alt="微信群">
</center>

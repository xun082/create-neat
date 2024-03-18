## Create-Neat

### Background 📖

At the beginning of learning 'React', the scaffold used was' create react app '. Although this scaffold provides zero configuration and is suitable for beginners to use out of the box, it is very difficult to expand it. To extend it, you must either use 'eject' or configure it using 'carpo'.

Although 'Typescript' has been popular for a long time, designing a 'Typescript' library from scratch is still troublesome. I have also had the idea of building a 'React' component library from scratch, but I am afraid of a bunch of unfamiliar configurations.

`Create Eat was born to solve these problems, solving all of them out of the box with zero configuration 🚀🚀🚀

### Characteristics 🧰

- 📦 Zero configuration, ready to use out of the box;
- 🚀 Build your project's basic template using the methods of 'axios' and' npm ', and the initialization speed is faster than that of' create read app ';
- 💯 Unified code style, unified project configuration for 'Eslint', 'Prettier', and 'Husky';
- 🥂 Use 'Rollup' to package your 'Typescript' library, support 'UMD', 'CJS', and' ESM 'output formats, and generate global'. d. ts' files;
- 🍻 Support user-defined 'Rollup' configuration to extend existing configurations and add unique features to the project;
- 🥂 Use Webpack to package your Web application, achieve multi environment packaging and deployment, optimize code segmentation, and work with official analysis tools to optimize code in real-time;
- 🍻 Support users to customize Webpack configurations to extend existing configurations and add unique features to projects;
- 🎯 Support user-defined Babel configuration to make your program more robust;
- 📕 Friendly log output allows you to quickly locate the problem and increase the development experience;
  -Automatically generate a 'CHANGELOG' file using 'standard version' while
- 🔸 ......

### Quick Start 🚩

```
npx create-neat my-app
cd my-app
npm start
```

If you have previously installed 'create nut' globally through 'npm install g create nut', we recommend using 'npm uninstall g create nut' or 'yarn global remove create nut' to uninstall this package to ensure that npx always uses the latest version.
When you enter 'npx create eat my app' in the terminal, the console will have the following options and functions to choose from:
![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b1423eca147545c698bec5b7f30f2da2~tplv-k3u1fbpfcp-zoom-1.image)
`Create-neat ` will create different applications based on your needs, all of which are out of the box and do not require configuration. Among them:

- 'common lib': a basic 'Typescript' library that you can use to write a tool library similar to 'lodash';

- 'react ui ': Quickly create a' react 'component library for you, with built-in' storybook 'allowing you to quickly write your component library documentation, and use' standard version 'to automatically generate a' CHANGELOG 'file for you;

- The remaining four are all for creating unused 'web' applications for you, where 'vue' supports both the syntax of '. vue' and '. tsx'.

  If the project is successfully created, the following effect will appear:

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe46e77448d54c14aebf4557db949883~tplv-k3u1fbpfcp-zoom-1.image)

> More usage methods will be available in [Digging for Gold] in the future（ https://juejin.cn/user/3782764966460398/posts ）Presented in the form of an article, interested friends can follow it.

### Create an application 📕

To create a new application, you can choose one of the following methods:

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

It will create a directory called my app in the current folder.
In this directory, it will generate different initial project structures based on the type of project you have chosen and install transferable dependencies based on the package management tool you have chosen. For example, when you choose 'react ui', it will create an out of the box component library template for you. The specific directory structure is as follows:

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

No configuration or complex folder structure required, only the files required to build the application.

After installation is completed, you can open your project folder:

```
cd my-app
```

In newly created projects, you can run some built-in commands:

#### `npm start`、`pnpm start` OR `yarn start`

If you are using a project type corresponding to 'web', run the application in development mode and automatically open it[ http://localhost:3000 ]（ http://localhost:3000 ）View in the browser, otherwise use the 'watch' hook in 'Rollup' to listen for changes in your files in the command line terminal.

#### `npm build`、`pnpm build` OR `yarn build`

If you are using a 'web' application, using this command will optimize its application construction for optimal performance and store it in the 'dist' directory.

If you choose 'common lib' or 'react ui' during project initialization, the application will be packaged and built using 'Rollup', and different format files will be built based on the parameters you pass in. The complete parameter configuration is as follows:

```
Usage
  $ rollup-script build [options]

Options
  --target              Specify the target environment to use web by default
  --name                Specify the global name in UMD pattern construction
  --format              The default format for the specified pattern (cjs, esm, umd) is esm

Examples
  $ rollup-script build --target node
  $ rollup-script build --name Foo
  $ rollup-script build --format cjs,esm,umd
  $ rollup-script build --format umd --name Foo
```

### Babel

You can add your own 'Babel' configuration to the root directory of the project, and 'create new' will merge it with your original 'Babel' transformation and place the new presets and plugins at the end of the list.

#### Example

```js
// babel.config.js

module.exports = {
  plugins: ["babel-plugin-styled-components"],
};
```

### webpack

> ⚠️ Warning
> These modifications may overwrite the default behavior and configuration of 'create neat', please use with caution!

If you want to extend the 'webpack' configuration to increase project support for different features or improve project performance, you can extend the 'webpack' configuration in the 'webpack. config. js' file. You can also use' process. env ' NODE-ENV ` to distinguish between development and production environments.

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
> These modifications may overwrite the default behavior and configuration of 'create not', please use with caution!

If you have selected a project type of 'common lib' or 'react ui' and wish to change the 'Rollup' configuration, you can create a file named 'roll up. config. js' in the root directory of the project. The example code is as follows:

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

### Donation🍵

> If you are currently using or interested in this project, you can support me through the following methods:

- **Star、Fork、Watch** 🚀🚀🚀

> We would be happy to receive your help and see your contributions in 'create now'. If you would like more information and how to get started, please scan and join the group:

<center>
<img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5cd5949ed05749968c36edaddb024f5d~tplv-k3u1fbpfcp-watermark.image?" width="400" height="300" alt="WeChat groups">
</center>

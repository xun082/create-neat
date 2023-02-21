# 基本使用

> 我发布的脚手架的包名字很长,没办法,因为不会取名,如果有取名大佬也可以联系我。

## 全局安装

```bash
npm install @obstinate/react-cli --location=global
```

该脚手架提供的的全局指令为 `crazy`,查看该脚手架帮助,你可以直接使用:

```bash
crazy
```

输入该命令后,输出的是整个脚手架的命令帮助,如下图所示:

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3950f1460b9b4ed2a6d1d4402e396667~tplv-k3u1fbpfcp-watermark.image?)

## 创建项目

要想创建项目,你可以执行以下命令来根据你想要的项目:

```bash
crazy create <projectName> [options]
```

例如创建一个名为 `moment`,并且当当前终端存在同名文件时直接覆盖,你可以执行以下命令:

```bash
crazy create moment -f
```

之后便有以下交互信息,你可以根据这些交互选择你想要的模板:

![动画.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d094c0b458ca4c38ac4e2939796fe647~tplv-k3u1fbpfcp-watermark.image?)

当项目安装完成之后你就可以根据控制台的指示去启动你的项目了。

## 创建文件

通过该脚手架你可以快速创建不同类型的文件,你可以指定创建文件的指定路径,否则则使用默认路径。

要想成创建创建文件,请执行以下指令:

```bash
crazy mkdir <type> [router]
```

其中 `type` 为必选命令,为你要创建的文件类型,现在可供选择的有 `axios、component、page、redux、axios`,`router` 为可选属性,为创建文件的路径。

具体操作请看下列动图:

![动画.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c9ace1c86f6c4cdbb8b03c8158e49aa0~tplv-k3u1fbpfcp-watermark.image?)

> 输入不同的类型会有不同的默认路径,并且无需你输入文件的后缀名,会根据你的项目生成相对应的文件后缀名,其中最特别的是创建 redux 文件会自动全局导入 reduxer,无需你自己手动导入,方便了日常的开发效率。

## 灵活配置

与 `create-react-app` 不同的是,该脚手架提供了自定义 `Webpack` 和 `babel` 配置,并通过 `webpack-merge` 对其进行合并,美中不足的是暂时并还没有提供 `env` 环境变量,要区分环境你可以在你通过脚手架下来的项目的 `webpack.config.js` 文件中这样操作:

```js
// 开发环境
const isDevelopment = process.argv.slice(2)[0] === "serve";

module.exports = {
  // ...
};
```

这些就是目前仅有的功能,其他的功能正在逐渐开发中......

# 为 create-neat 贡献力量

我们很乐意您为 create-neat 做出贡献，并帮助它变得比今天更好!作为贡献者，以下是我们希望您遵循的指导方针:

- [疑问或问题?](#Question)

- [问题和 bug](#issue)

- [功能请求](#功能)

- [提交指引](#submit)

- [开发设置](#开发)

- [编码规则](#规则)

- [提交消息指引](#Commit)

## <a name="question"></a>有疑问或问题吗?

**不要为一般支持问题打开问题，因为我们希望将GitHub 问题保留为 bug 报告和功能请求如果您想实时讨论问题，您可以在微信上加入我们的技术交流群与我们联系。**

 

## <a name="issue"></a>发现 Bug?

 

如果你在源代码中发现一个 bug，你可以通过[提交一个问题](#submit-issue)到我们的[GitHub Repository](https://github.com/xun082/create-neat)来帮助我们。更好的是，你可以[提交一个拉取请求](#submit-pr)并进行修复。

##  <a name="feature"></a>缺了一个 feature ?

你可以通过[提交 issue](#submit-issue)到我们的 GitHub Repository 来请求一个新特性。如果你想**实现**一个新功能，请首先提交一个带有工作建议的 issue，以确保我们可以使用它。请考虑它是什么样的更改:

 

- 对于一个**主要功能**，首先打开一个 issue 并概述你的提案，以便进行讨论。这也将使我们能够更好地协调我们的工作，防止重复工作，并帮助您精心设计更改，以便它成功地被接受到项目中。对于您的 issue 名称，请在您的提案前加上`[discussion]`，例如"[discussion]:您的feature idea"。

- **小功能**可以制作并直接[作为拉取请求提交](#submit-pr)。

## <a name="submit"></a>提交指南

### <a name="submit-issue"></a>提交 Issue

在你提交一个问题之前，请搜索问题跟踪器，也许你的问题已经存在，讨论可能会通知你现成的解决方法。

我们希望尽快修复所有问题，但在修复一个 bug 之前，我们需要复现并确认它。为了重现 bug，我们将系统地要求您使用存储库或[Gist](https://gist.github.com/)提供一个最小的再现场景。拥有一个活生生的、可重现的场景，可以为我们提供丰富的重要信息，而不必带着额外的问题来回询问你，比如:

- create-neat 使用的版本

- 第三方库及其版本

- 最重要的是一个失败的用例

不幸的是，在没有最小复制的情况下，我们无法调查/修复 bug，所以如果我们没有收到你的反馈，我们将关闭一个没有足够信息可以复制的问题。

您可以通过填写我们的[new issue from](https://github.com/xun082/create-neat/issues/new/choose)来提交新 issue。

### <a name="submit-pr"></a>提交拉取请求(PR)

在提交拉取请求(PR)之前，请考虑以下指导方针:

搜索[GitHub 拉请求](https://github.com/xun082/create-neat/pulls)为一个开放或封闭的 PR，涉及到你的提交。你不想重复努力。

Fork 这个仓库。

在一个新的git 分支中进行更改:

```
git checkout -b my-fix-branch master . git 
```

创建你的补丁，**包括适当的测试用例**。

遵循我们的[编码规则](https://github.com/xun082/create-neat/blob/main/CONTRIBUTING.md#rules)。

运行完整的 create-neat 测试套件  (参见[常用脚本](https://github.com/xun082/create-neat/blob/main/CONTRIBUTING.md#common-scripts)) ，并确保所有测试都通过。

按照我们的[提交消息约定](https://github.com/xun082/create-neat/blob/main/CONTRIBUTING.md#commit)，使用描述性提交消息提交您的更改。遵守这些约定是必要的，因为发布说明是根据这些消息自动生成的。

```
git commit -a 
```

注:可选的 commit `-a`命令行选项会自动 “ add ” 和 “ rm ”编辑后的文件。

将你的分支推送到GitHub:

```
git push origin my-fix-branch 
```

在GitHub 中，发送一个 pull 请求到 `create-neat:master`。

- 如果我们建议更改:

- 进行所需的更新。

- 重新运行 create-neat 测试套件以确保测试仍能通过。

- 重新设置分支并强制推送到 GitHub 存储库(这将更新您的 Pull Request): 

  ```
  git rebase master -i git push -f
  ```

就是这样!感谢大家的贡献!

#### 在你的 pull request 合并之后

在你的 pull request 合并后，你就可以安全地删除你的分支并拉取更改了从主(上游)仓库:

- 通过GitHub web UI 或本地 shell 删除 GitHub 上的远程分支，如下所示:

```shell
git push origin --delete my-fix-branch
```

- 查看 master 分支:

```
 git checkout master -f
```

- 删除本地分支:

```
 git branch -D my-fix-branch
```

- 用最新的上游版本更新你的 master:

```
git pull --ff upstream master
```

##  <a name="development"></a>开发设置

你需要[Node.js](https://nodejs.org/)版本>= 10.13.0 (v13 除外)。

克隆仓库后，运行:

```bash

$ npm ci --legacy-peer-deps # (or yarn install)

```

为了准备环境，运行`prepare.sh` shell 脚本: 

```bash

$ sh scripts/prepare.sh

```

这将编译新的包，然后将它们全部移动到`sample`目录。

### <a name="common-scripts"></一个>常用 NPM 脚本



```bash
# build all packages and move to "sample" directories
$ npm run build

# run the full unit tests suite
$ npm run test

# run integration tests
# docker is required(!)
$ sh scripts/run-integration.sh

# run linter
$ npm run lint

# build all packages and put them near to their source .ts files
$ npm run build:prod
```

## <a name="rules"></a>编码规则

为了确保整个源代码的一致性，在工作时请牢记这些规则:

- 所有功能或 bug 修复**必须经过**一个或多个规范(单元测试)的测试。

- 我们遵循[谷歌的 JavaScript 风格指南](https://google.github.io/styleguide/jsguide.html)，但将所有代码包装在**100 characters**。有一个自动格式化程序(`npm run format`)。

## <a name="commit"></a>提交消息指南

对于我们的git 提交消息如何格式化，我们有非常精确的规则。这导致**更多可读性强的信息**在查看**项目历史记录**时很容易理解。但同时,

我们使用 git 提交消息来**生成 create-neat 更改日志**。

### 提交消息格式

每条提交消息都由**header**、**body**和**footer**组成。标题有一个特殊的包含**type**、**scope**和**subject**的格式:

```

<type>(<scope>): <subject>

<BLANK LINE>

<body>

<BLANK LINE>

<footer>

```

 

**header**是强制的，而 header 的**scope**是可选的。

提交信息的任何一行都不能超过 100 个字符!这使得消息更加简单可以在 GitHub 以及各种 git 工具中阅读。

页脚应该包含[对某个问题的结束引用](https://help.github.com/articles/closing-issues-via-commit-messages/)(如果有的话)。

样本:(更多[样本](https://github.com/xun082/create-neat/commits/main/)) 

```

docs(changelog): update change log to beta.5

fix(core): need to depend on latest rxjs and zone.js

```

 

### 回复

如果提交还原了前一次提交，它应该以`revert:`开头，然后是被还原的提交的头部。在正文中应该这样写:This reverts commit <hash>.，其中的哈希值是要恢复的提交的 SHA。

### 类型

必须是以下之一:

**build**:影响构建系统或外部依赖的更改(例如:gulp, broccoli, npm)

**chore**:更新任务等;无生产环境代码变更

**ci**:更改我们的 ci 配置文件和脚本(示例范围:Travis, Circle, BrowserStack, SauceLabs)

**文档**:文档只发生了变化

**feat**:一个新功能

**fix**: bug 修复

**perf**:提高性能的代码更改

**重构**:既没有修复 bug 也没有添加新功能的代码更改

**样式**:不影响代码含义的更改(空格、格式化、缺少分号等)

**测试**:添加缺失的测试或修正现有的测试

**样例**:对样例的修改

### 范围

作用域应该包含受影响的 npm 包的名称(由阅读由提交消息生成的更改日志的人感知)。以下是支持范围的列表:



**common**:用于对`packages/common`目录所做的更改

**核心**:用于查看`packages/core`目录的更改

**样本**:查看`packages/sample`目录下的更改

**微服务**:用于查看`packages/microservices`目录上的更改

**express**:用于查看`packages/platform-express`目录上的更改

**fastify**:查看`packages/platform-fastify`目录上的更改

* *套接字。Io **:用于查看在`packages/platform-socket. js `上所做的更改。io 的目录

**ws**:用于查看在`packages/platform-ws`目录上所做的更改

**testing**:用于检测`packages/testing`目录上的更改

**websockets**:用于查看`packages/websockets`目录的更改

如果您的更改影响多个包，请使用逗号分隔作用域(例如。“共同核心”)。目前“使用包名”规则有一些例外:

**打包**:用于更改我们所有包中的 NPM 包布局，例如公共路径更改、打包。对所有包所做的 Json 更改，d.ts 文件/格式更改，对包的更改等。

**changelog**:用于更新 CHANGELOG.md 中的发行说明

**sample/#**:对于示例应用目录，将#替换为示例应用编号

none/空字符串:用于在所有包中进行的“样式”、“测试”和“重构”更改(例如:`style:添加缺失的分号`)

### 话题

主题包含了对变化的简洁描述:

- 使用祈使句，现在时:"change"而不是"changed"或"changes"
- 首字母不要大写
- 结尾不要有句点

### 身体

就像在**主语**中一样，使用祈使句，现在时:"change"而不是"changed"或"changes"。主体应包括改变的动机，并将其与之前的行为进行对比。

### 页脚
页脚应该包含有关**突破性更改**的任何信息，也是到引用此提交**关闭**的GitHub 问题。
**突破性更改**应该以`BREAKING CHANGE:`开头，用空格或两个换行符。提交消息的其余部分用于完成此操作。
详细的解释可以在这个[文档](https://github.com/xun082/create-neat/issues/35#)中找到。
[github]:https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit


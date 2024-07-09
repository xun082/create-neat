/**
 * 表示 package.json 文件的类型定义。
 */
export interface PackageJsonType {
  name?: string; // 包名
  version?: string; // 版本号
  description?: string; // 描述
  main?: string; // 入口文件
  types?: string; // TypeScript 类型定义文件
  scripts?: { [scriptName: string]: string }; // npm 脚本
  repository?: {
    // 仓库信息
    type: string;
    url: string;
  };
  keywords?: string[]; // 关键字
  author?: // 作者信息
  | string
    | {
        name: string;
        email?: string;
        url?: string;
      };
  license?: string; // 许可证
  dependencies?: { [packageName: string]: string }; // 生产环境依赖
  devDependencies?: { [packageName: string]: string }; // 开发环境依赖
  peerDependencies?: { [packageName: string]: string }; // 对等依赖
  optionalDependencies?: { [packageName: string]: string }; // 可选依赖
  engines?: {
    // 引擎要求
    node?: string;
    npm?: string;
  };
  config?: { [key: string]: any }; // 配置信息
  "lint-staged"?: { [globPattern: string]: string | string[] }; // lint-staged 配置
}

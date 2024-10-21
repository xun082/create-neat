export type BuildToolType = "webpack" | "vite" | "rollup";

interface Import {
  /** 导出内容 */
  name: string;
  /** 导出的包 */
  from: string;
}

export interface Plugin {
  /** 导出内容 */
  name: string;
  /** 配置参数 */
  params: object;
  /** 导出配置 */
  import: Import;
}

export interface Options {
  /** rules配置项 */
  rules: any;
  /** 插件配置 */
  plugins: Plugin[];
}

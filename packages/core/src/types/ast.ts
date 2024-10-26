interface ASTImport {
  /** 导出内容 */
  name: string;
  /** 导出的包 */
  from: string;
}

export interface ASTPlugin {
  /** 导出内容 */
  name: string;
  /** 配置参数 */
  params: object;
  /** 导出配置 */
  import: ASTImport;
}

export interface ASTOptions {
  /** rules配置项 */
  rules: any;
  /** 插件配置 */
  plugins: ASTPlugin[];
}

/**
 * 表示用户的预设配置。
 * @interface Preset
 * @property {string} template - 模板名称。
 * @property {string} buildTool - 构建工具名称。
 * @property {Record<string, any>} plugins - 插件列表，键为插件名称，值为插件配置。
 * @property {string} packageManager - 包管理器名称。
 * @property {string} npmSource - npm 源名称。
 * @property {boolean} extraConfigFiles - 选择文件生成位置 'In dedicated config files' --> true 'In packagejson' --> false。
 */
interface Preset {
  template: string;
  buildTool: string;
  plugins: Record<string, any>;
  packageManager: string;
  npmSource: string;
  extraConfigFiles: boolean;
}

/**
 * @description 处理用户预设
 * @param template 模板
 * @param buildTool 构建工具
 * @param plugins 插件列表
 * @param npmSource npm源
 * @param extraConfigFiles 选择文件生成位置
 * @return 用户预设
 */
// todo: 目前没有使用到 defaultPreset，后续考虑加入默认配置
const getPreset = (
  template: string,
  buildTool: string,
  plugins: string[],
  packageManager: string,
  npmSource: string,
  extraConfigFiles: boolean,
): Preset => {
  const preset: Preset = {
    template,
    buildTool,
    plugins: {},
    packageManager,
    npmSource,
    extraConfigFiles,
  };

  // todo: 插件配置目前设置为空，且没有使用情况，后续优化
  plugins.forEach((plugin) => {
    preset.plugins[plugin] = {};
  });

  return preset;
};
/**
 * 默认预设配置。
 * @constant {Preset} defaultPreset
 * @description 默认预设配置对象，包含常见配置的默认值。
 */
const defaultPreset: Preset = {
  template: "common-lib",
  buildTool: "webpack",
  plugins: {
    eslint: {},
  },
  packageManager: "npm",
  npmSource: "",
  // todo: 更多配置随构建需要添加
  extraConfigFiles: true,
};

export { Preset, getPreset, defaultPreset };

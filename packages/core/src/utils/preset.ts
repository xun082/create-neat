interface Preset {
  template: string;
  buildTool: string;
  plugins: Record<string, any>;
  packageManager: string;
  npmSource: string;
}

/**
 * @description 处理用户预设
 * @param template 模板
 * @param buildTool 构建工具
 * @param plugins 插件列表
 * @param npmSource npm源
 * @return 用户预设
 */
// todo: 目前没有使用到 defaultPreset，后续考虑加入默认配置
const getPreset = (
  template: string,
  buildTool: string,
  plugins: string[],
  packageManager: string,
  npmSource: string,
): Preset => {
  const preset: Preset = {
    template,
    buildTool,
    plugins: {},
    packageManager,
    npmSource,
  };

  // todo: 插件配置目前设置为空，且没有使用情况，后续优化
  plugins.forEach((plugin) => {
    preset.plugins[plugin] = {};
  });

  return preset;
};

const defaultPreset: Preset = {
  template: "common-lib",
  buildTool: "webpack",
  plugins: {
    eslint: {},
  },
  packageManager: "npm",
  npmSource: "",
  // todo: 更多配置随构建需要添加
};

export { Preset, getPreset, defaultPreset };

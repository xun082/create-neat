import { mapForPreset } from "./configMap";

interface Preset {
  template: string;
  buildTool: string;
  plugins: Record<string, any>;
  packageManager: string;
}

/**
 * @description 处理用户预设
 * @param template 模板
 * @param buildTool 构建工具
 * @param plugins 插件列表
 * @return 用户预设
 */
// todo: 目前没有使用到 defaultPreset，后续考虑加入默认配置
const getPreset = (
  template: string,
  buildTool: string,
  plugins: string[],
  packageManager: string,
): Preset => {
  const preset: Preset = {
    template,
    buildTool,
    plugins: {},
    packageManager,
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
  // todo: 更多配置随构建需要添加
};

const { template, buildTool, plugins } = mapForPreset;

/**
 * @description 根据配置映射生成预设相关的文件
 * @param preset 用户预设
 */
const getFilesForProject = (preset: Preset) => {
  let fileList = [...template[preset.template].files, ...buildTool[preset.buildTool].files];

  // 独立处理 plugins
  Object.keys(preset.plugins).forEach((item) => {
    fileList = [...fileList, ...plugins[item].files];
  });

  return fileList;
};

/**
 * @description 根据配置映射生成预设相关的依赖
 * @param preset 用户预设
 */
const getNpmForPackage = (preset: Preset) => {
  let npmList = [...template[preset.template].npm, ...buildTool[preset.buildTool].npm];

  // 独立处理 plugins
  Object.keys(preset.plugins).forEach((item) => {
    npmList = [...npmList, ...plugins[item].npm];
  });

  return npmList;
};

export { Preset, getPreset, defaultPreset, getFilesForProject, getNpmForPackage };

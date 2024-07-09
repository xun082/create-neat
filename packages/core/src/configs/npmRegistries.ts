/**
 * @interface RegistryInfo
 * @property {string} home - 注册中心的主页链接
 * @property {string} registry - 注册中心的注册表链接
 */
interface RegistryInfo {
  home: string;
  registry: string;
}
/**
 * @interface Source
 * @property {RegistryInfo} sourceName - 注册中心的信息
 * @property {number} duration - 持续时间
 */
interface Source {
  sourceName: RegistryInfo;
  duration: number;
}
/**
 * 包含所有注册中心信息的对象
 * @type {Record<string, RegistryInfo>}
 */
const npmRegistries: Record<string, RegistryInfo> = {
  npm: {
    home: "https://www.npmjs.org",
    registry: "https://registry.npmjs.org/",
  },
  yarn: {
    home: "https://yarnpkg.com",
    registry: "https://registry.yarnpkg.com/",
  },
  tencent: {
    home: "https://mirrors.cloud.tencent.com/npm/",
    registry: "https://mirrors.cloud.tencent.com/npm/",
  },
  cnpm: {
    home: "https://cnpmjs.org",
    registry: "https://r.cnpmjs.org/",
  },
  taobao: {
    home: "https://npmmirror.com",
    registry: "https://registry.npmmirror.com/",
  },
  npmMirror: {
    home: "https://skimdb.npmjs.com/",
    registry: "https://skimdb.npmjs.com/registry/",
  },
};

/**
 * 导出这个对象，以便在其他部分的代码中使用
 * @exports
 */
export { npmRegistries, Source, RegistryInfo };

interface RegistryInfo {
  home: string;
  registry: string;
}

interface Source {
  sourceName: RegistryInfo;
  duration: number;
}

// 创建包含所有注册中心信息的对象
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

// 导出这个对象，以便在其他部分的代码中使用
export { npmRegistries, Source, RegistryInfo };

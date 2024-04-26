import Generator from "packages/core/src/utils/Generator";
import TemplateAPI from "packages/core/src/utils/TemplateAPI";

export const pluginTypeScript = (generator: Generator, options: Record<string, object>) => {
  const templateAPI = new TemplateAPI(generator);

  // 添加依赖和脚本
  templateAPI.addDependency("vue", "^3.3.0");
  templateAPI.addScript("serve", "vue-cli-service serve");

  // 扩展配置
  if (options.typescript) {
    templateAPI.extendConfigFile("tsconfig", {
      file: {
        json: ["tsconfig.json"],
      },
    });
  }

  templateAPI.generateFiles();
};

import https from "https";

import getPackageJsonInfo from "./getPackageInfo";
// 获取npm源以及最快的npm源
export const getNpmSource = () => {
  const npmJson: any = getPackageJsonInfo("../../../../registries.json", true);
  const npmSources: any = [];
  for (const key in npmJson) {
    npmSources.push({ label: key, value: npmJson[key].registry });
  }
  const checkSourceSpeed = (source: any) => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const req = https.request(source.registry, () => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        resolve({ sourceName: source, duration });
      });
      req.on("error", (error) => {
        reject(error);
      });

      req.end();
    });
  };
  (async () => {
    try {
      // 为每个源创建 Promise
      const promises = Object.keys(npmJson).map((sourceName) => {
        const source = npmJson[sourceName];
        return checkSourceSpeed(source);
      });

      // 使用 Promise.race 找出哪个源最快，并用 await 等待结果
      const fastestSource: any = await Promise.race(promises);

      // 将最快源的 registry 添加到 npmSources 中
      npmSources.push({ label: "Fastest source", value: fastestSource.sourceName.registry });
    } catch (error) {
      console.error("检测源速度时发生错误:", error);
    }
  })();
  return npmSources;
};

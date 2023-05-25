import glob from "glob";
import { resolveApp } from "@obstinate/utils";
import fs from "fs";
import path from "path";
import XlsxPopulate from "xlsx-populate";
import chalk from "chalk";

/**
 * 统计组件使用次数
 */
export default async function queryComponents(packageName) {
  const Regex1 = new RegExp(
    `import\\s*{\\s*([\\w\\s,]+)\\s*}\\s*from\\s*['"](?:.*\/)?${packageName}(?:\/[^'"]+)?['"]`,
    "g"
  );

  const moduleDir = resolveApp("src");
  const files = await glob("**/*.{jsx,tsx,vue,js}", {
    cwd: moduleDir,
  });
  const resFile = {};
  for (const file of files) {
    const content = fs.readFileSync(resolveApp(`src/${file}`), "utf-8");
    let match;
    while ((match = Regex1.exec(content))) {
      const componentNames = match[1].split(",").map((name) => name.trim());
      const wayMatch = match[0].match(/from\s+['"]([^'"]+)['"]/);
      for (const component of componentNames) {
        resFile[component] = resFile[component] || {
          count: 0,
          files: [],
        };
        resFile[component].count++;
        resFile[component].library = wayMatch[1] || "";
        resFile[component].files.push(path.join(moduleDir, file));
      }
    }
  }
  const resFileSort = Object.entries(resFile).sort(
    (a, b) => b[1].count - a[1].count
  );

  const workbook = XlsxPopulate.fromBlankAsync().then((workbook) => {
    workbook.sheet("Sheet1").cell("A1").value("组件");
    workbook.sheet("Sheet1").cell("B1").value("使用次数");
    workbook.sheet("Sheet1").cell("C1").value("使用库");
    workbook.sheet("Sheet1").cell("D1").value("使用路径");

    let rowNum = 2;
    resFileSort.forEach(([component, { count, library, files }]) => {
      const row = workbook.sheet("Sheet1").row(rowNum++);
      row.cell("A").value(component);
      row.cell("B").value(count);
      row.cell("c").value(library);

      files.map((item, index) => {
        if (index === 0) {
          row.cell("D").value(item);
        } else {
          const row = workbook.sheet("Sheet1").row(rowNum++);
          row.cell("D").value(item);
        }
      });
    });
    return workbook.outputAsync();
  });

  const fileName = "moment.xlsx";
  const statistic = resolveApp(fileName);

  workbook
    .then((data) => {
      if (fs.existsSync(statistic)) {
        fs.unlinkSync(statistic);
      }
      fs.writeFileSync(statistic, data, "binary");
      console.log("组件统计结果已经输出到 moment.xlsx 文件中。");
    })
    .catch((res) => {
      console.log("\n");
      console.log(
        chalk.red(`检查到你的 ${fileName} 文件正在打开,请先关闭再执行当前命令`)
      );
      console.log("\n");
    });
}

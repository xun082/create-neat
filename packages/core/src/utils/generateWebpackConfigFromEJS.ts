import ejs from "ejs";

import { buildToolType } from "../types";

export default function generateWebpackConfigFromEJS(
  framework: string,
  bundler: buildToolType,
  language: string,
  template: string,
) {
  const config = ejs.render(template, {
    framework,
    bundler,
    language,
  });

  return config;
}

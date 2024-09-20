import ejs from "ejs";

export default function generateBuildToolConfigFromEJS(options, template: string) {
  const config = ejs.render(template, options);

  return config;
}

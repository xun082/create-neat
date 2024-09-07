import ejs from "ejs";

export default function generateWebpackConfigFromEJS(options, template: string) {
  const config = ejs.render(template, options);

  return config;
}

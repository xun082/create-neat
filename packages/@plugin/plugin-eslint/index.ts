const buildToolConfigs = {
  webpack: (config) => {
    if (config.resolve.alias) {
      config.resolve.alias.set("a", "b");
    } else {
      config.resolve.alias = { a: "b" };
    }
  },
  vite: (options) => {
    options.alias = [{ find: "a", replacement: "b" }];
  },
  // 添加其他构建工具的配置...
};

const pluginEslint = (api, options) => {
  const { buildTool } = options.preset;
  const configHandler = buildToolConfigs[buildTool];

  if (configHandler) {
    configHandler(api, options);
  } else {
    console.warn(`Unsupported build tool: ${buildTool}`);
  }

  // 其他独立于构建工具的配置
  // ……
};

module.exports = {
  pluginEslint,
};

// declare class PluginAPI {
//     id: string

//     service: any

//     readonly version: string

//     assertVersion(range: number | string): void

//     /**
//      * Current working directory.
//      */
//     getCwd(): string

//     /**
//      * Resolve path for a project.
//      *
//      * @param  _path - Relative path from project root
//      * @return The resolved absolute path.
//      */
//     resolve(_path: string): string

//     /**
//      * Check if the project has a given plugin.
//      *
//      * @param id - Plugin id, can omit the (@vue/|vue-|@scope/vue)-cli-plugin- prefix
//      * @return `boolean`
//      */
//     hasPlugin(id: string): boolean

//     /**
//      * Register a command that will become available as `vue-cli-service [name]`.
//      *
//      * @param name
//      * @param  [opts]
//      * @param  fn
//      */
//     registerCommand(name: string, fn: RegisterCommandFn): void
//     registerCommand(name: string, opts: RegisterCommandOpts, fn: RegisterCommandFn): void

//     /**
//      * Register a function that will receive a chainable webpack config
//      * the function is lazy and won't be called until `resolveWebpackConfig` is
//      * called
//      *
//      * @param fn
//      */
//     chainWebpack(fn: WebpackChainFn): void

//     /**
//      * Register
//      * - a webpack configuration object that will be merged into the config
//      * OR
//      * - a function that will receive the raw webpack config.
//      *   the function can either mutate the config directly or return an object
//      *   that will be merged into the config.
//      *
//      * @param fn
//      */
//     configureWebpack(fn: webpackRawConfigFn): void

//     /**
//      * Register a dev serve config function. It will receive the express `app`
//      * instance of the dev server.
//      *
//      * @param fn
//      */
//     configureDevServer(fn: DevServerConfigFn): void

//     /**
//      * Resolve the final raw webpack config, that will be passed to webpack.
//      *
//      * @param [chainableConfig]
//      * @return Raw webpack config.
//      */
//     resolveWebpackConfig(chainableConfig?: ChainableConfig): webpack.Configuration

//     /**
//      * Resolve an intermediate chainable webpack config instance, which can be
//      * further tweaked before generating the final raw webpack config.
//      * You can call this multiple times to generate different branches of the
//      * base webpack config.
//      * See https://github.com/mozilla-neutrino/webpack-chain
//      *
//      * @return ChainableWebpackConfig
//      */
//     resolveChainableWebpackConfig(): ChainableConfig

//     /**
//      * Generate a cache identifier from a number of variables
//      */
//     genCacheConfig(id: string, partialIdentifier: any, configFiles?: string | string[]): CacheConfig
// }

// /**
//  * Service plugin serves for modifying webpack config,
//  * creating new vue-cli service commands or changing existing commands
//  *
//  * @param api - A PluginAPI instance
//  * @param options - An object containing project local options specified in vue.config.js,
//  *    or in the "vue" field in package.json.
//  */
// type ServicePlugin = (
//     api: PluginAPI,
//     options: ProjectOptions
// ) => any

// export { ServicePlugin, PluginAPI }

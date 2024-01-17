import { createConfigItem } from '@babel/core';
import { createBabelInputPluginFactory } from '@rollup/plugin-babel';
import merge from 'lodash.merge';

export const isTruthy = (object: any) => {
  if (!object) return false;
  return object.constructor !== Object || Object.keys(object).length > 0;
};

const replacements = [{ original: 'lodash(?!/fp)', replacement: 'lodash-es' }];

export const mergeConfigItems = (type: any, ...configItemsToMerge: any[]) => {
  const mergedItems: any[] = [];

  configItemsToMerge.forEach((configItemToMerge) => {
    configItemToMerge.forEach((item: any) => {
      const itemToMergeWithIndex = mergedItems.findIndex(
        (mergedItem) => mergedItem.file.resolved === item.file.resolved
      );

      if (itemToMergeWithIndex === -1) {
        mergedItems.push(item);
        return;
      }

      mergedItems[itemToMergeWithIndex] = createConfigItem(
        [
          mergedItems[itemToMergeWithIndex].file.resolved,
          merge(mergedItems[itemToMergeWithIndex].options, item.options)
        ],
        {
          type
        }
      );
    });
  });

  return mergedItems;
};

export const createConfigItems = (type: any, items: any[]) => {
  return items.map(({ name, ...options }) => {
    return createConfigItem([require.resolve(name), options], { type });
  });
};

export const babelPluginsConfig = createBabelInputPluginFactory(() => ({
  options({ custom: customOptions, ...pluginOptions }: any) {
    return {
      customOptions,
      pluginOptions
    };
  },
  config(config: any, { customOptions }: any) {
    const defaultPlugins = createConfigItems(
      'plugins',
      [
        { name: 'babel-plugin-macros' },
        { name: 'babel-plugin-annotate-pure-calls' },
        { name: 'babel-plugin-dev-expression' },
        customOptions.format !== 'cjs' && {
          name: 'babel-plugin-transform-rename-import',
          replacements
        },
        {
          name: 'babel-plugin-polyfill-regenerator',
          // don't pollute global env as this is being used in a library
          method: 'usage-pure'
        },
        {
          name: '@babel/plugin-proposal-class-properties',
          loose: true
        },
        isTruthy(customOptions.extractErrors) && {
          name: '../utils/errors/transformErrorMessages.ts'
        }
      ].filter(Boolean)
    );

    const babelOptions = config.options || {};
    babelOptions.presets = babelOptions.presets || [];

    const presetEnvIdx = babelOptions.presets.findIndex((preset: any) =>
      preset.file.request.includes('@babel/preset-env')
    );

    if (presetEnvIdx !== -1) {
      const presetEnv = babelOptions.presets[presetEnvIdx];
      babelOptions.presets[presetEnvIdx] = createConfigItem(
        [
          presetEnv.file.resolved,
          merge(
            {
              loose: true,
              targets: customOptions.targets
            },
            presetEnv.options,
            {
              modules: false
            }
          )
        ],
        {
          type: `preset`
        }
      );
    } else {
      // if no preset-env, add it & merge with their presets
      const defaultPresets = createConfigItems('preset', [
        {
          name: '@babel/preset-env',
          targets: customOptions.targets,
          modules: false,
          loose: true
        }
      ]);

      babelOptions.presets = mergeConfigItems(
        'preset',
        defaultPresets,
        babelOptions.presets
      );
    }

    babelOptions.plugins = mergeConfigItems(
      'plugin',
      defaultPlugins,
      babelOptions.plugins || []
    );

    return babelOptions;
  }
}));

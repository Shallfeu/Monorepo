import webpack from 'webpack';
import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import { BuildOptions } from './types/types';
import { buildLoaders } from './buildLoaders';
import { buildPlugins } from './buildPlugins';
import { buildResolvers } from './buildResolver';
import { buildDevServer } from './buildDevServer';

export const buildWebpack = (options: BuildOptions) => {
    const { mode, paths, port } = options;
    const isDev = mode === 'development';

    const config: webpack.Configuration = {
        mode: mode ?? 'development',
        entry: paths.entry,
        output: {
            path: paths.output,
            filename: '[name].[contenthash].js',
            clean: true,
        },
        plugins: buildPlugins(options),
        module: {
            rules: buildLoaders(options),
        },
        resolve: buildResolvers(options),
        devtool: isDev ? 'eval-cheap-module-source-map' : 'source-map',
        devServer: buildDevServer(options),
    };

    return config;
};

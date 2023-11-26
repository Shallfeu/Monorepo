import path from 'path';
import htmlWebpackPlugin from 'html-webpack-plugin';
import webpack, { Configuration, DefinePlugin } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { BuildOptions } from './types/types';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';

export const buildPlugins = (options: BuildOptions): Configuration['plugins'] => {
    const isDev = options.mode === 'development';

    const plugins: Configuration['plugins'] = [
        new htmlWebpackPlugin({
            publicPath: '/',
            template: options.paths.html,
            favicon: path.resolve(options.paths.public, 'favicon.ico'),
        }),
        new DefinePlugin({ __PLATFORM__: JSON.stringify(options.platform) }),
    ];

    if (isDev) {
        plugins.push(new webpack.ProgressPlugin());
        // plugins.push(new ForkTsCheckerWebpackPlugin());
        plugins.push(new ReactRefreshWebpackPlugin());
    }

    if (!isDev) {
        plugins.push(
            new MiniCssExtractPlugin({
                filename: 'css/[name].[contenthash:8].css',
                chunkFilename: 'css/[name].[contenthash:8].css',
            }),
        );
        plugins.push(
            new CopyPlugin({
                patterns: [
                    {
                        from: path.resolve(options.paths.public, 'locales'),
                        to: path.resolve(options.paths.output, 'locales'),
                    },
                ],
            }),
        );
    }

    if (options.analyzer) {
        plugins.push(new BundleAnalyzerPlugin());
    }

    return plugins;
};

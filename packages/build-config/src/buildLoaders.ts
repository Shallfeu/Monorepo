import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { BuildOptions } from './types/types';
import { ModuleOptions } from 'webpack';
import ReactRefreshTypeScript from 'react-refresh-typescript';

export const buildLoaders = (options: BuildOptions): ModuleOptions['rules'] => {
    const isDev = options.mode === 'development';

    const svgrLoader = {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: [
            {
                loader: '@svgr/webpack',
                options: {
                    icon: true,
                    svgoConfig: {
                        plugins: [
                            {
                                name: 'convertColors',
                                params: {
                                    currentColor: true,
                                },
                            },
                        ],
                    },
                },
            },
        ],
    };

    const assetsLoader = {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
    };

    const cssLoader = {
        loader: 'css-loader',
        options: { modules: { localIdentName: isDev ? '[path][name]__[local]' : 'hash:base64:8' } },
    };

    const sassLoader = {
        test: /\.s[ac]ss$/i,
        use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, cssLoader, 'sass-loader'],
    };

    const tsLoader = {
        test: /\.tsx?$/,
        use: {
            loader: 'ts-loader',
            options: {
                getCustomTransformers: () => ({
                    before: [isDev && ReactRefreshTypeScript()].filter(Boolean),
                }),
                transpileOnly: isDev,
            },
        },
        exclude: /node_modules/,
    };

    const babelLoader = {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: [
                    '@babel/preset-env',
                    '@babel/preset-typescript',
                    ['@babel/preset-react', { runtime: isDev ? 'automatic' : 'classic' }],
                ],
            },
        },
    };

    return [svgrLoader, assetsLoader, sassLoader, tsLoader];
};

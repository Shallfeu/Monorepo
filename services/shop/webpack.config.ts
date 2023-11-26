import webpack, { Configuration } from 'webpack';
import path from 'path';
import { BuildPaths, BuildPlatform, buildWebpack } from '@packages/build-config';
import packageJson from './package.json';

interface EnvVariables {
    port?: number;
    mode?: 'development' | 'production';
    platform?: BuildPlatform;
    analyzer?: boolean;
}

export default (env: EnvVariables) => {
    const paths: BuildPaths = {
        entry: path.resolve(__dirname, 'src', 'index.tsx'),
        output: path.resolve(__dirname, 'build'),
        public: path.resolve(__dirname, 'public'),
        html: path.resolve(__dirname, 'public', 'index.html'),
        src: path.resolve(__dirname, 'src'),
    };

    const config: Configuration = buildWebpack({
        port: env.port ?? 3001,
        paths,
        mode: env.mode ?? 'development',
        platform: env.platform ?? 'desktop',
        analyzer: env.analyzer,
    });

    config.plugins.push(
        new webpack.container.ModuleFederationPlugin({
            name: 'shop',
            filename: 'remoteEntry.js',
            exposes: {
                './Router': './src/router/Router.tsx',
            },
            shared: {
                ...packageJson.dependencies,
                react: {
                    eager: true,
                    requiredVersion: packageJson.dependencies['react'],
                },
                'react-router-dom': {
                    eager: true,
                    requiredVersion: packageJson.dependencies['react-router-dom'],
                },
                'react-dom': {
                    eager: true,
                    requiredVersion: packageJson.dependencies['react-dom'],
                },
            },
        }),
    );

    return config;
};

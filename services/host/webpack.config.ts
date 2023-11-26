import webpack, { Configuration } from 'webpack';
import path from 'path';
import { BuildPaths, BuildPlatform, buildWebpack } from '@packages/build-config';
import packageJson from './package.json';

interface EnvVariables {
    port?: number;
    mode?: 'development' | 'production';
    platform?: BuildPlatform;
    analyzer?: boolean;
    SHOP_REMOTE_URL?: string;
    ADMIN_REMOTE_URL?: string;
}

export default (env: EnvVariables) => {
    const paths: BuildPaths = {
        entry: path.resolve(__dirname, 'src', 'index.tsx'),
        output: path.resolve(__dirname, 'build'),
        public: path.resolve(__dirname, 'public'),
        html: path.resolve(__dirname, 'public', 'index.html'),
        src: path.resolve(__dirname, 'src'),
    };

    const SHOP_REMOTE_URL = env.SHOP_REMOTE_URL ?? 'http://localhost:3001';
    const ADMIN_REMOTE_URL = env.ADMIN_REMOTE_URL ?? 'http://localhost:3002';

    const config: Configuration = buildWebpack({
        port: env.port ?? 3000,
        paths,
        mode: env.mode ?? 'development',
        platform: env.platform ?? 'desktop',
        analyzer: env.analyzer,
    });

    config.plugins.push(
        new webpack.container.ModuleFederationPlugin({
            name: 'host',
            filename: 'remoteEntry.js',
            remotes: {
                shop: `shop@${SHOP_REMOTE_URL}/remoteEntry.js`,
                admin: `admin@${ADMIN_REMOTE_URL}/remoteEntry.js`,
            },
            shared: {
                ...packageJson.dependencies,
                react: {
                    eager: true,
                    // requiredVersion: packageJson.dependencies['react'],
                },
                'react-router-dom': {
                    eager: true,
                    // requiredVersion: packageJson.dependencies['react-router-dom'],
                },
                'react-dom': {
                    eager: true,
                    // requiredVersion: packageJson.dependencies['react-dom'],
                },
            },
        }),
    );

    return config;
};

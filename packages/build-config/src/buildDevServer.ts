import { Configuration } from 'webpack-dev-server';
import { BuildOptions } from './types/types';

export const buildDevServer = (options: BuildOptions): Configuration => {
    return {
        port: options.port ?? 3000,
        open: true,
        historyApiFallback: true,
        hot: true,
    };
};

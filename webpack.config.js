const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtReactWebpackPlugin = require('@extjs/reactor-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');
const sourcePath = path.join(__dirname, './app/src');

module.exports = function (env) {
    const nodeEnv = env && env.prod ? 'production' : 'development';
    const isProd = nodeEnv === 'production';

    const plugins = [
        new ExtReactWebpackPlugin({
            theme: 'custom-ext-react-theme',
            overrides: ['ext-react/overrides'],
            production: isProd
        }),
        new webpack.EnvironmentPlugin({
            NODE_ENV: nodeEnv
        }),
        new webpack.NamedModulesPlugin()
    ];

    if (isProd) {
        plugins.push(
            new webpack.LoaderOptionsPlugin({
                minimize: true,
                debug: false
            }),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false,
                    screw_ie8: true
                }
            })
        );
    } else {
        plugins.push(
            new webpack.HotModuleReplacementPlugin(),
            new WebpackShellPlugin({
                onBuildEnd: 'electron .'
            })
        );
    }

    plugins.push(new HtmlWebpackPlugin({
        template: 'index.html',
        hash: true
    }));

    return {
        devtool: isProd ? 'source-map' : 'cheap-module-source-map',
        context: sourcePath,

        entry: {
            'app': [
                'babel-polyfill',
                './index.js',
            ]
        },

        output: {
            path: path.resolve(__dirname, './app/build'),
            filename: '[name].js'
        },

        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: [
                        'babel-loader'
                    ],
                },
            ],
        },

        resolve: {
            // The following is only needed when running this boilerplate within the extjs-reactor repo.  You can remove this from your own projects.
            alias: {
                "react-dom": path.resolve('./node_modules/react-dom'),
                "react": path.resolve('./node_modules/react')
            }
        },

        plugins,

        stats: {
            colors: {
                green: '\u001b[32m',
            }
        }
    }
};
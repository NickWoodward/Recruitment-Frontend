const HtmlWebpackPlugin = require('html-webpack-plugin');
const SpriteLoaderPlugin = require("svg-sprite-loader/plugin");


module.exports = {
    entry: {
        common: './src/js/common.js',
        index: './src/js/index.js',
        about: './src/js/about.js',
        admin: './src/js/admin.js',
        jobs: './src/js/jobs.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader'
            },
            {
                test: /\.html$/,
                use: 'html-loader'
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'svg-sprite-loader',
                        options: {
                            extract: true,
                            spriteFilename: 'svg/spritesheet.svg'
                        },
                    },
                    'svgo-loader',
                ]
                
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html',
            chunks: ['index', 'common']
        }),
        new HtmlWebpackPlugin({
            filename: 'about.html',
            template: './src/about.html',
            chunks: ['about', 'common']
        }),
        new HtmlWebpackPlugin({
            filename: 'admin.html',
            template: './src/admin.html',
            chunks: ['admin', 'common']
        }),
        new HtmlWebpackPlugin({
            filename: 'jobs.html',
            template: './src/jobs.html',
            chunks: ['jobs', 'common']
        }),
        new SpriteLoaderPlugin(),
    ]
}
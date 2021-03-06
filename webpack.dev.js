const common = require('./webpack.common');
const { merge } = require('webpack-merge');

module.exports = merge(common, {
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    'style-loader', 
                    'css-loader', 
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|jpg|webp)$/,
                use: [ 
                    "url-loader",
                    {
                        loader: "image-webpack-loader",
                        options: {
                            mozjpeg: {
                                progressive: true,
                                quality: 65,
                            },
                            optipng: {
                                enabled: false,
                            },
                            pngquant: {
                                quality: [0.65, 0.9],
                                speed: 4,
                            },
                            webp: {
                                quality: 75
                            },
                        },
                    },
                ],
            },
        ]
    }
});
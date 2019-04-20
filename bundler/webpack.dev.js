// Ajout des plugins après le telechargement
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const commonConfiguration = require('./webpack.common.js')

module.exports = webpackMerge(
    commonConfiguration,
    {
        mode: 'development',
        plugins:
        [
            // Plugin Hot Reload
            new webpack.HotModuleReplacementPlugin(),
        ],
        // Initialisation serveur dev webpack
        devServer:
        {
            contentBase: './dist',
            open: true,
            hot: true
        },
        module:
        {
            rules:
            [
                {
                    test: /\.css$/,
                    use:
                    [
                        'style-loader',
                        'css-loader'
                    ]
                },
                {
                    test: /\.styl$/,
                    use:
                    [
                        'style-loader',
                        'css-loader',
                        'stylus-loader'
                    ]
                }
            ]
        }
    }
)
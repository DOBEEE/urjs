var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
    	test: './test/test.js'
    },
    output: {
        path: path.resolve(__dirname, 'test/dist'),
        publicPath: '/',
        filename: 'test.js',
    },
    devtool: '#source-map',
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    optimization: {
        splitChunks: {
            chunks: 'async',
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '_',
            name: true,
            cacheGroups:{
            	libs: {
                    test: /ur.js/ig,
                    name: 'libs',
                    chunks: 'initial',
                    priority: -20,
                },
            },
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'test')],
                // exclude: /adfe-request\.js/,
            },
        ]
    },
    plugins: [
    	new HtmlWebpackPlugin({
    		title: "hello world",
            filename: 'index.html',
            template: 'test/index.html',
            inject: true,
        }),
    ]
};

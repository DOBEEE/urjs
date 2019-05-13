
var config = require('./config');
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV);
}

var opn = require('opn');
var path = require('path');
var express = require('express');
var webpack = require('webpack');
// var proxyMiddleware = require('http-proxy-middleware');
// var mockServerMiddleware = require('./mockServerMiddleware');
// var proxyServerMiddleware = require('./proxyServerMiddleware');
var webpackConfig = require('../webpack.dev.config.js');

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port;
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser;
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable;

var app = express();
var compiler = webpack(webpackConfig);

var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quiet: true,
});

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: false,
    heartbeat: 2000,
});

// // proxy api requests
// Object.keys(proxyTable).forEach(function (context) {
//   var options = proxyTable[context]
//   if (typeof options === 'string') {
//     options = { target: options }
//   }
//   app.use(proxyMiddleware(options.filter || context, options))
// })

// serve webpack bundle output
app.use(devMiddleware);

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware);

// if (process.env.SERVER_ENV === 'mock') {
//   app.use(mockServerMiddleware);
// } else {
//   app.use(proxyServerMiddleware);
// }

// mock & proxy server
app.use(
    require('express-devtool')({
        mockDir: path.join(process.cwd(), 'test/mock'), // 定义mock目录
    })
);

// serve pure static assets
// var staticPath = path.join(process.cwd(), 'test');
app.use(express.static(path.join(process.cwd(), 'test/dist')));

var uri = 'http://localhost:' + port;

var _resolve;
var readyPromise = new Promise(resolve => {
    _resolve = resolve;
});

console.log('> Starting dev server...');
devMiddleware.waitUntilValid(() => {
    console.log('> Listening at ' + uri + '\n');
    // when env is testing, don't need open it
    // if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    //     opn(uri);
    // }
    _resolve();
});
var server = app.listen(port);
module.exports = {
    ready: readyPromise,
    close: () => {
        server.close();
    },
};

var webpack = require('webpack');
var path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin')


// Naming and path settings
var appName = 'raxxla';
var entryPoint = './resources/js/main.js';
var exportPath = path.resolve(__dirname, './public/');

// Enviroment flag
var plugins = [];
var env = process.env.WEBPACK_ENV;

// Differ settings based on production flag
if (env === 'production') {
    var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

    // plugins.push(new UglifyJsPlugin({ minimize: true }));
    plugins.push(new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: 'development'
        }
    }
    ));

    appName = appName + '.min.js';
} else {
    appName = appName + '.js';
}
// console.log(process.NODE_ENV, process.env);
// plugins.push(new VueLoaderPlugin());

// Main Settings config
module.exports = {
    mode: process.env.WEBPACK_ENV,
    watch: process.env.WEBPACK_ENV === 'development',
    watchOptions: {
        poll: true
    },
    entry: entryPoint,
    output: {
        path: exportPath,
        filename: appName
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['@babel/preset-env']
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
             {
                 test: /\.(scss)$/,
                 use: [{
                     loader: 'style-loader', // inject CSS to page
                 }, {
                     loader: 'css-loader', // translates CSS into CommonJS modules
                 }, {
                     loader: 'postcss-loader', // Run post css actions
                     options: {
                         plugins: function () { // post css plugins, can be exported to postcss.config.js
                             return [
                                 require('precss'),
                                 require('autoprefixer')
                             ];
                         }
                     }
                 }, {
                     loader: 'sass-loader' // compiles Sass to CSS
                 }]
             },
             {
                 test: /\.(css)$/,
                 use: [{
                     loader: 'style-loader', // inject CSS to page
                 }, {
                     loader: 'css-loader', // translates CSS into CommonJS modules
                 }]
             },
            // {
            //     test: /\.scss$/,
            //     use: [
            //         "style-loader", // creates style nodes from JS strings
            //         // "css-loader", // translates CSS into CommonJS
            //         "sass-loader" // compiles Sass to CSS, using Node Sass by default
            //     ]
            // }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    plugins: [
        new VueLoaderPlugin()
    ]
};

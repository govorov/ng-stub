const path                    = require('path');
const webpack                 = require('webpack');

const ExtractTextPlugin       = require('extract-text-webpack-plugin');
const StatsPlugin             = require('stats-webpack-plugin');
const HtmlPlugin              = require('html-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// TODO
// const AotPlugin               = require('@ngtools/webpack').AotPlugin;
const outputDir               = path.join(__dirname, 'build');
const buildEnv                = process.env.NODE_ENV === 'build';


const config = {

    entry: {
        'main' : [
            path.resolve(__dirname, 'src','entrypoints','main.ts'),
        ],

        'style' : [
            path.resolve(__dirname, 'src','entrypoints','style.scss'),
        ],
    },


    output: {
        path: outputDir,
        filename: '[name]-[hash].js',
    },


    module: {
        rules: [
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader",
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader",
            },
            {
                test   : /\.ts?$/,
                // TODO AOT
                // loaders : buildEnv ? '@ngtools/webpack' : 'awesome-typescript-loader',
                loaders : 'awesome-typescript-loader',
            },
            {
                test   : /\.pug$/,
                //this loader allows angular2 expressions to be used without ""
                loader : 'pug-ng-html-loader',
            },
            {
                test : /\.scss$/,
                use  : ExtractTextPlugin.extract(['css-loader','resolve-url-loader','sass-loader?sourceMap']),
            },
        ],
    },


    resolve: {

        modules: [
            path.resolve(__dirname, 'src'),
            'node_modules',
        ],

        extensions: [
            '.ts',
            '.js',
            '.pug',
            '.scss',
        ],
    },


    watch: !buildEnv,


    plugins: [
        new ExtractTextPlugin( '[name]-[hash].css' ),
        new HtmlPlugin({
            template: 'html/index.pug',
            filename: 'index.html',
        }),
        new webpack.DefinePlugin({
            buildEnv,
        })
    ],


    devServer: {
        //all routes should be redirected to index.html
        historyApiFallback: true,
        host: '0.0.0.0',
    },

};


// production settings
if (buildEnv) {
    config.plugins.push(
        // TODO - parallel build with webpack-uglify-parallel
        new webpack.optimize.UglifyJsPlugin({
            compressor : { warnings: false },
            sourceMap  : false,
            screw_ie8  : true,
            comments   : false,
        }),
        new OptimizeCssAssetsPlugin({
            cssProcessor        : require('cssnano'),
            cssProcessorOptions : { discardComments: {removeAll: true } },
            canPrint            : true,
        })
        // TODO
        // new AotPlugin({
        //     tsConfigPath : './tsconfig.json',
        //     entryModule  : 'src/app.module#AppModule'
        // })
    );
}


module.exports = config;

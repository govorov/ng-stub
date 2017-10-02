const path                     = require('path');
const webpack                  = require('webpack');
const ProgressPlugin           = require('webpack/lib/ProgressPlugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const StatsPlugin              = require('stats-webpack-plugin');
const ExtractTextPlugin        = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin  = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin        = require('html-webpack-plugin');
const { TsConfigPathsPlugin }  = require('awesome-typescript-loader');
const { AotPlugin }            = require('@ngtools/webpack');
const {
    NamedLazyChunksWebpackPlugin,
    BaseHrefWebpackPlugin
} = require('@angular/cli/plugins/webpack');

const entryPoints  = ["polyfills","styles","vendor","main"];
const isProduction = process.env.NODE_ENV === 'production';
const isAotEnabled = process.env.AOT === 'true';


const jitTsLoader = [
    {
        loader : 'awesome-typescript-loader',
    },
];


const aotTsLoader = [
    {
        loader: "@ngtools/webpack",
    },
];


const plugins = [
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)@angular/,
      path.resolve(__dirname, '../src')
    ),
    new ProgressPlugin(),
    new CircularDependencyPlugin({
      "exclude": /(\\|\/)node_modules(\\|\/)/,
      "failOnError": false
    }),
    new HtmlWebpackPlugin({
        template       : "./html/index.pug",
        filename       : "index.html",
        hash           : false,
        inject         : true,
        compile        : true,
        favicon        : false,
        minify         : false,
        cache          : true,
        showErrors     : true,
        chunks         : "all",
        excludeChunks  : [],
        title          : "Webpack App",
        xhtml          : true,
        chunksSortMode : function sort(left, right) {
            let leftIndex  = entryPoints.indexOf(left.names[0]);
            let rightindex = entryPoints.indexOf(right.names[0]);
            if (leftIndex > rightindex) {
                return 1;
            }
            else if (leftIndex < rightindex) {
                return -1;
            }
            else {
                return 0;
            }
        }
    }),
    new BaseHrefWebpackPlugin({}),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

    new StatsPlugin('manifest.json', {
        // We only need assetsByChunkName
        chunkModules : false,
        source       : false,
        chunks       : false,
        modules      : false,
        assets       : true,
    }),

    new ExtractTextPlugin({
        filename  : '[name]-[chunkhash].css',
        allChunks : true,
    }),
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    })
];


if (isProduction) {
    console.log('Production build');
    plugins.push(
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
    );
}


if (isAotEnabled) {
    console.log('AOT enabled');
    plugins.push(new AotPlugin({
        mainPath           : "./src/entrypoints/main.ts",
        tsConfigPath       : "tsconfig.json",
        replaceExport      : false,
        exclude            : [],
        skipCodeGeneration : true,
    }));
}


const config = {

    entry: {
        main: [
            "./src/entrypoints/main.ts",
        ],
        polyfills: [
            "./src/entrypoints/polyfills.ts",
        ],
        styles: [
            "./src/entrypoints/styles.scss",
        ],
    },

    output: {
        filename   : '[name]-[chunkhash].js',
        path       : path.resolve(__dirname,'dist'),
    },

    resolve: {
        alias: {
        },

        modules: [
            path.resolve(__dirname,"./src"),
            path.resolve(__dirname,"node_modules"),
        ],

        extensions : [
            ".js",
            ".ts",
            ".scss",
            ".pug",
        ],
    },

    resolveLoader: {
        modules: [
            "./node_modules",
        ],
    },

    watch: !isProduction,

    module: {
        rules: [
            {
                test: /\.html$/,
                loader: "raw-loader"
            },
            {
                test: /\.(eot|svg|cur)$/,
                loader: "file-loader?name=[name].[hash:20].[ext]"
            },
            {
                test: /\.(jpg|png|webp|gif|otf|ttf|woff|woff2|ani)$/,
                loader: "url-loader?name=[name].[hash:20].[ext]&limit=10000"
            },

            {
                test    : /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        'css-loader',
                        'postcss-loader',
                        'resolve-url-loader',
                        'sass-loader?sourceMap',
                    ],
                }),
            },

            {
                test    : /\.ts$/,
                exclude : /node_modules/,
                use     : isAotEnabled ? aotTsLoader : jitTsLoader,
            },

            {
                test: /\.pug$/,
                use: [
                    {
                        loader: "pug-ng-html-loader",
                    },
                ],
            },
        ],
    },

    plugins,

    devtool: isProduction ? 'none' : 'eval',

    devServer: {
        historyApiFallback: {
            disableDotRule: true,
        },

        host: '0.0.0.0',
        port: 8080,
        disableHostCheck: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
        }
    },

};


module.exports = config;

const Webpack             = require('webpack')
const path                = require('path')
const ExtractTextPlugin   = require('extract-text-webpack-plugin')
const WriteFilePlugin     = require('write-file-webpack-plugin')
const CopyWebpackPlugin   = require('copy-webpack-plugin')
const serverConfig        = require('./server.config.js')

const BASE_DIR_PATH       = path.resolve(__dirname)
const NODE_MODULES_PATH   = path.resolve(__dirname, 'node_modules')
const CLIENT_PATH         = path.resolve(__dirname, 'client')
const COMMON_PATH         = path.resolve(__dirname, 'client', 'common')
const OUTPUT_PATH         = path.resolve(__dirname, 'public')
const ENTRY_APP_PATH      = path.resolve(CLIENT_PATH, 'app.js')
const ENTRY_CSS_PATH      = path.resolve(CLIENT_PATH, 'style', 'main.scss')

let extractCSSPath = 'stylesheet.css'
const config = {

  resolve: {
    modulesDirectories: [
      'client',
      'node_modules'
    ],
    root: [
      COMMON_PATH
    ],
    extensions: ['', '.js', '.scss']
  },
  // entry: {}
  devtool: "eval-source-map",
  output: {
    path: OUTPUT_PATH,
    filename: "app.js",
    publicPath: '/public/'
  },
  module: {
    preloaders: [
      {
        test: /\.js$/, // include .js files
        exclude: [NODE_MODULES_PATH],
        loader: "jshint-loader"
      }
    ],
    loaders: [
      // I highly recommend using the babel-loader as it gives you
      // ES6/7 syntax and JSX transpiling out of the box
      {
        test: /\.js$/,
        loader: serverConfig.isLocal ?  'babel-loader!react-hot' : 'babel-loader',
        exclude: [NODE_MODULES_PATH, __dirname+'/client/**/__test__'],
        query: {
          cacheDirectory: true,
          presets: ['react', 'es2015']
       }
      },
      {
        test: /\.json$/,
        loader: "json-loader"
      },
      { test: /\.(glsl|frag|vert)$/, loader: 'raw', exclude: /node_modules/ },
      { test: /\.(glsl|frag|vert)$/, loader: 'glslify', exclude: /node_modules/ }
    ],
  },
  sassLoader: {
    includePaths: [CLIENT_PATH]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        context: __dirname + '/asset',
        from: '**/*',
        to: __dirname + '/public'
      }
    ])
  ],
}

/**
 * Switch by node ENV
 */
switch(process.env.NODE_ENV) {
  default:
  case 'local':
    config.devServer = {
      // THIS MUST BE THE SAME AS THE config.output.path above
      outputPath: OUTPUT_PATH
    }
    config.entry = [
      ENTRY_APP_PATH,
      ENTRY_CSS_PATH,
      // For hot style updates
      'webpack/hot/dev-server',
      // The script refreshing the browser on none hot updates
      'webpack-dev-server/client?http://localhost:' + serverConfig.wpPort
    ]
    config.output = {
      path: BASE_DIR_PATH,
      filename: "build/app.js"
    }
    config.plugins.push(
      new Webpack.HotModuleReplacementPlugin(),
      new WriteFilePlugin()
    )
    extractCSSPath = 'build/stylesheet.css'
    break
  case 'development':
    break
  case 'staging':
  case 'production':
    // SET THIS TO FALSE REDUCES THE FILESIZE DRASTICALLY
    config.devtool = false
    config.entry = {
      vendor: ['react', 'react-dom', 'react-router', 'react-redux', 'redux', 'react-router-redux', 'd3', 'three'],
      app: [
        ENTRY_APP_PATH,
        ENTRY_CSS_PATH
      ]
    }
    config.plugins.push(
      new Webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        },
        mangle: {
          except: ['$super', '$', 'exports', 'require']

            // toplevel: true,
            // sort: true,
            // eval: true,
            // properties: true,
            // // Don't care about IE8
            // screw_ie8 : true,
            // // Don't mangle function names
            // keep_fnames: true
        },
        sourceMap: true
      }),
      new Webpack.optimize.CommonsChunkPlugin({
        name: "vendor",
        filename: "vendor.js"
      }),
      new Webpack.optimize.DedupePlugin(),
      new Webpack.optimize.OccurrenceOrderPlugin(),
      new Webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 15
      }),
      new Webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }
      })
    )
    break
}

/**
 * create extract CSS
 */
const extractCSS = new ExtractTextPlugin(extractCSSPath)
config.module.loaders.push({
  test: /\.scss$/,
  loader: extractCSS.extract("css-loader!sass-loader!autoprefixer-loader"),
  exclude: [NODE_MODULES_PATH]
})
config.plugins.push(extractCSS)


/**
 * exports
 */
module.exports = config

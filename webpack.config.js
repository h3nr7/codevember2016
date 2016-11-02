const Webpack             = require('webpack')
const path                = require('path')
const ExtractTextPlugin   = require('extract-text-webpack-plugin')
const nodeModulesPath     = path.resolve(__dirname, 'node_modules')

const serverConfig        = require('./server.config.js')

let extractCSSPath = 'stylesheet.css'
const config = {
  resolve: {
    modulesDirectories: [
      'node_modules'
    ],
    root: [
      path.resolve(__dirname, 'client', 'common')
    ],
    extensions: ['', '.js', '.scss']
  },
  entry: {
    vendor: ['react', 'react-dom', 'react-router', 'react-redux', 'redux', 'react-router-redux', 'd3'],
    app: [
      path.resolve(__dirname, 'client', 'app.js'),
      path.resolve(__dirname, 'client', 'style', 'main.scss')
    ]
  },
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: "app.js",
    publicPath: '/public/'
  },
  module: {
    preloaders: [
      {
        test: /\.js$/, // include .js files
        exclude: [nodeModulesPath],
        loader: "jshint-loader"
      }
    ],
    loaders: [
      // I highly recommend using the babel-loader as it gives you
      // ES6/7 syntax and JSX transpiling out of the box
      {
        test: /\.js$/,
        loader: serverConfig.isLocal ?  'babel-loader!react-hot' : 'babel-loader',
        exclude: [nodeModulesPath, __dirname+'/client/**/__test__'],
        query: {
          cacheDirectory: true,
          presets: ['react', 'es2015']
       }
     },
      {
        test: /\.json$/,
        loader: "json-loader"
      }
    ],
  },
  sassLoader: {
    includePaths: [path.resolve(__dirname, 'client')]
  },
  plugins: [],
}

/**
 * Switch by node ENV
 */
switch(process.env.NODE_ENV) {
  default:
  case 'local':
    config.entry.push(
      // For hot style updates
      'webpack/hot/dev-server',
      // The script refreshing the browser on none hot updates
      'webpack-dev-server/client?http://localhost:' + serverConfig.wpPort
    )
    config.output = {
      path: path.resolve(__dirname, 'build'),
      filename: "build/app.js",
      publicPath: '/build/'
    }
    config.plugins.push(
      new Webpack.HotModuleReplacementPlugin()
    )
    extractCSSPath = 'build/stylesheet.css'
    break
  case 'development':
    break
  case 'staging':
  case 'production':
    config.devtool = 'eval'
    config.plugins.push(
      new Webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false },
        mangle: {
            except: ['$super', '$', 'exports', 'require']
        },
        comments: false,
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
          'NODE_ENV': JSON.stringify('production')
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
  exclude: [nodeModulesPath]
})
config.plugins.push(extractCSS)


/**
 * exports
 */
module.exports = config

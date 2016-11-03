const Webpack             = require('webpack')
const path                = require('path')
const ExtractTextPlugin   = require('extract-text-webpack-plugin')
const WriteFilePlugin     = require('write-file-webpack-plugin')
const CopyWebpackPlugin   = require('copy-webpack-plugin')
const serverConfig        = require('./server.config.js')

const nodeModulesPath     = path.resolve(__dirname, 'node_modules')

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
  // entry: {}
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
      },
      { test: /\.(glsl|frag|vert)$/, loader: 'raw', exclude: /node_modules/ },
      { test: /\.(glsl|frag|vert)$/, loader: 'glslify', exclude: /node_modules/ }
    ],
  },
  sassLoader: {
    includePaths: [path.resolve(__dirname, 'client')]
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
      outputPath: path.join(__dirname, './public')
    }
    config.entry = [
      path.resolve(__dirname, 'client', 'app.js'),
      path.resolve(__dirname, 'client', 'style', 'main.scss'),
      // For hot style updates
      'webpack/hot/dev-server',
      // The script refreshing the browser on none hot updates
      'webpack-dev-server/client?http://localhost:' + serverConfig.wpPort
    ]
    config.output = {
      path: path.resolve(__dirname),
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
    config.devtool = 'eval'
    config.entry = {
      vendor: ['react', 'react-dom', 'react-router', 'react-redux', 'redux', 'react-router-redux', 'd3'],
      app: [
        path.resolve(__dirname, 'client', 'app.js'),
        path.resolve(__dirname, 'client', 'style', 'main.scss')
      ]
    }
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

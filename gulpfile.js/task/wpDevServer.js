if (process.env.NODE_ENV !== 'local') return

const gulp          = require('gulp')
const gutil         = require('gulp-util')
const WpDevServer   = require('webpack-dev-server')
const Webpack       = require('webpack')
const serverConfig  = require('server.config.js')
const wpConfig      = require('webpack.config.js')

gulp.task('wpDevServer', (cb) => {

  let compiler = Webpack(wpConfig)

  // We give notice in the terminal when it starts bundling and
  // set the time it started
  compiler.plugin('compile', function() {
    gutil.log("[webpack-dev-server]", 'Bundling...')
    bundleStart = Date.now();
  });

  // We also give notice when it is done compiling, including the
  // time it took. Nice to have
  compiler.plugin('done', function() {
    gutil.log("[webpack-dev-server]", 'Bundled in ' + (Date.now() - bundleStart) + 'ms!')
  });


  /**
   * Webpack Dev Server
   */
  let bundler = new WpDevServer(compiler, {
      publicPath: '/' + wpConfig.output.publicPath,
      // Configure hot replacement
      hot: true,
      // The rest is terminal configurations
      quiet: false,
      noInfo: true,
      stats: {
        colors: true
      }
    }).listen(serverConfig.wpPort, 'localhost', (err) => {
      if(err) throw new gutil.PluginError("webpack-dev-server", err);
		  gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
    })

})

const gulp = require('gulp')
const gutil = require('gulp-util')
const Webpack = require('webpack')
const wpConfig = require('webpack.config.js')

/**
 * Compile webpack together
 * @param  {[type]} 'webpack' [description]
 * @param  {[type]} (cb       [description]
 * @return {[type]}           [description]
 */
gulp.task('wp', (cb) => {

  let compiler = Webpack(wpConfig, (err, stats) => {
    if(err) throw new gutil.PluginError('webpack', err)
    gutil.log('[webpack]', stats.toString({
      // TODO: output options
    }))
    cb()
  })

})

if (process.env.NODE_ENV !== 'local') return

const gulp = require('gulp')
const server = require('gulp-develop-server')
const gutil = require('gulp-util')
const serverConf = require('server.config.js')

gulp.task('gulpDevServer', (cb) => {
  /** Start web server*/
  var startServer = server.listen({
      path: './server/app.js',
      env: {NODE_ENV: 'local'},
      execArgv: ['--debug']
    }, (err) => {
      if(err) {
        gutil.warn("[webpack-dev-server]", 'Forcing server restart: ', err);
        server.kill('SIGTERM', startServer);
      }

    });

  gulp.watch(serverConf.paths.files).on('change', server.restart);
})

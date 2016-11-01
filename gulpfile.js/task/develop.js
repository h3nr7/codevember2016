if (process.env.NODE_ENV !== 'local') return

const gulp = require('gulp')

gulp.task('develop', [
    'wpDevServer',
    'gulpDevServer'
  ])

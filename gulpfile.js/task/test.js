if (process.env.NODE_ENV !== 'test') return


const gulp = require('gulp');
const runSequence = require('run-sequence');

/**
 * develop everything
 */
gulp.task('test', function(cb) {

	runSequence(
		// 'serverTest',
		'clientTest',
		cb);

});

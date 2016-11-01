if (process.env.NODE_ENV !== 'test') return

const gulp          = require('gulp')
const GMocha        = require('gulp-mocha')
const serverConfig  = require('server.config.js')
if (serverConfig.env.isLocal || serverConfig.env.isDevelopment) require('dotenv').load()

require('app-module-path').addPath(__dirname + '/../..')



/**
 * CLIENT TEST
 */
gulp.task('clientTest', () => {
	// mocha test/client/_setup.js client/**/__test__/*-test.js
	let mSrc = ['./test/client/_setup.js', './client/**/__test__/*-test.js'];
	return gulp.src(mSrc)
		.pipe(GMocha())
		.once('error', function (err) {
			console.log('error', err)
			process.exit(1);
		})
		.once('end', function () {
			console.log('end')
			process.exit();
		});

})

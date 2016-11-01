const env = process.env.NODE_ENV;
require('app-module-path').addPath(process.cwd())

/**
 * load environment vars from .env file in local development
 */
if(process.env.NODE_ENV === 'local') {
  const dotenv = require('dotenv');
  dotenv.load();
}

/**
 * required dir
 */
const requireDir = require('require-dir');

/**
 * Require all tasks in gulpfile.js/tasks, including subfolders
 */
requireDir('./task', { recurse: true })

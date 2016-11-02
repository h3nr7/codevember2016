/** Add base path to modules */
require('app-module-path').addPath(process.cwd());

const _                 = require('lodash')
const express           = require('express')
const path              = require('path')
const session           = require('express-session')
const redisStore        = require('connect-redis')(session)
const passport          = require('passport')
const exphbs            = require('express-handlebars')
const bodyParser        = require('body-parser')
const cookieParser      = require('cookie-parser')
const timeout           = require('connect-timeout')
const serverConf        = require('server.config.js')
const auth              = require('server/middleware/auth')


const app = express()

/**
 * handlebar templates
 */
app.engine('handlebars', exphbs({
	// defaultLayout: 'index',
	layoutsDir: path.join(__dirname + '/view'),
	extname: '.handlebars'
}))
app.set('views', path.join(__dirname, '/view'));
app.set('view engine', 'handlebars');

/**
 * initialise passport auth
 */
auth.init()

/**
 * Initialise passport and session
 * Parse Cookie & Body
 */

let sessOption = {
	secret: process.env.SESSION_SECRET,
	resave: true,
	saveUninitialized: true,
}

/**
 * LOCAL
 */
if(serverConf.env.isLocal) {
  const httpProxy = require('http-proxy')
  const proxy = httpProxy.createProxyServer()

  app.all('/build/*', (req, res) => {
      proxy.web(req, res, { target: 'http://localhost:' + serverConf.wpPort })
    })

  // catch all proxy error or server will crash.
  // An example of this is connecting to the server when webpack is bundling
  proxy.on('error', function(e) {
    console.log('Could not connect to proxy, please try again...');
  });

  /**
   * use redis as session storage
   */
  _.assign(sessOption, {
  	store: new redisStore({
			 host: 'localhost',
			 port: 6379,
			 db: 1
    })
  })
} else {
  /**
   * use redis as session storage
   */
  _.assign(sessOption, {
    store: new redisStore({ url: process.env.REDIS_URL })
  })
}

/**
 * static paths
 * @param  {[type]} express.static(serverConf.paths.js.internal [description]
 * @return {[type]}                                        [description]
 */
app.use('/public', express.static(__dirname + '/../public'))

/**
 * initialise session and passport
 */
app.use(session(sessOption))
app.use(passport.initialize())

/**
 * session and parsers
 */
app.use(passport.session())
app.use(timeout(serverConf.env.timeout))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

/**
 * Routing
 */
app.disable('etag'); // avoids 304 status with API
app.use('/', require('./route'));



app.listen(serverConf.port, function () {
  console.log('Server running on port ' + serverConf.port);
});

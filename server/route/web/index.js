const serverConf        = require('server.config.js')

module.exports = (router) => {

  router.get('/*', (req, res, nect) => {

    var output = {
      title: '',
      JS_FOLDER: serverConf.paths.js.name
    }

    res.render('core', output);
  })

}

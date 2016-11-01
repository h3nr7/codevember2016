
const respond       = require('server/middleware/respond')
const blog          = require('server/controller/blog')

module.exports = (router) => {

  router.get('/api/blog', blog.get, respond)

}

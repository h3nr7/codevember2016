const respond           = require('server/middleware/respond')


exports.get = (req, res, next) => {
  let { page, pagination } = req.body

  // TODO: dummy promise
  return Promise.resolve({statusCode: 200, success:true})
    .then(respond.successHandler(res, next))

}

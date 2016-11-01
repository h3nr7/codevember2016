const logger                             = require('server/lib/logger')
const _                                  = require('lodash')

/**
 * Response
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
const respond = function(req, res, next) {
  let _data = res._data || {}
  // logger.info('Response', {sent: _data});

  res.status(_data.statusCode || 200).send(_data);
};


/**
 * Success promise handler for passthrough with data set
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
respond.successHandler = function(res, next, statusCode){
  return (data) => {
    res._data = {
      statusCode: statusCode || 200,
      data: data
    }
    next()
  }
}

/**
 * Error promise handler
 * @param  {[type]}   errObj [description]
 * @param  {[type]}   res    [description]
 * @param  {Function} next   [description]
 * @return {[type]}          [description]
 */
respond.errorHandler = (errObj, res, next) => {
  return (err) => {

  }
}

module.exports = respond

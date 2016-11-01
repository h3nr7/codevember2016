const logger                        = require('bunyan')
const serverConf                    = require('server.config.js')
const PrettyStream                  = require('bunyan-prettystream')
const BunyanSlack                   = require('bunyan-slack')
const appInfo                       = require('package.json')
const prettyStdOut                  = new PrettyStream()

// prettyStdOut.pipe(process.stdout)
//
// const channel = serverConf.env.isProduction ? '#prod_server_logs' : '#dev_server_logs'
// const stream = []
//
// /**
//  * avoid local streams
//  * @param  {Boolean} !conf.isLocal [description]
//  * @return {[type]}                [description]
//  */
// if(!serverConf.env.isLocal) {
//     stream.push({
//       level: serverConf.env.logger.server.level,
//       stream: new BunyanSlack({
//         // webhook_url: "https://hooks.slack.com/services/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",
//         channel: '#dev_server_logs',
//         username: "Dev Alliance"
//       })
//     });
// }
//
// stream.push({
//   level: conf.env.logger.server.level,
//   type: 'raw',
//   stream: prettyStdOut
// })
//
// module.exports = logger.createLogger({
//   name: appInfo.name,
//   streams: stream
// });

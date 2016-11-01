const path = require('path')

const config = {
  port: process.env.PORT,
  paths: {
    files: 'server/**/*',
    js: {
      internal: path.resolve('public'),
      name: 'public'
    }
  },
  logger: {
    server:{
      level: 'error'
    }
  }
}

switch(process.env.NODE_ENV) {
  default:
  case 'local':
    config.wpPort = 8089
    config.port = 3000
    config.paths.js = {
      name: 'build',
      internal: path.resolve('build')
    }
    config.env = {
      port: 3000,
      isLocal: true,
      timeout: '120s'
    }
    config.logger.server.level = 'debug'

    break
  case 'development':
    config.env = {
      timeout: '120s'
    }
    config.logger.server.level = 'debug'

    break
  case 'staging':
    config.env = {
      timeout: '120s'
    }
    break
  case 'production':
    config.port = process.env.PORT || 3000
    config.env = {
      timeout: '60s'
    }
    break
}


module.exports = config

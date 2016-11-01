const serverConfig  = require('server.config.js')
if (serverConfig.env.isLocal || serverConfig.env.isDevelopment) require('dotenv').load()


require('babel-register')({
  extensions: [".jsx", ".js"]
});

var jsdom = require('jsdom').jsdom;

var exposedProperties = ['window', 'navigator', 'document'];

global.document = jsdom('');
global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
})

global.navigator = {
  userAgent: 'node.js'
}

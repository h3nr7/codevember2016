const express = require('express')
const router = express.Router()

/** API route */
const apiRoutes = require('./api')(router);

/** Web route */
const webRoutes = require('./web')(router);


module.exports = router;

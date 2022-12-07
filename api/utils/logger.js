const bunyan = require("bunyan");

const log = bunyan.createLogger({ name: 'express-backend' });

module.exports = { log };
/// General error logging
const winston = require('winston');

module.exports = function() {
    // logs errors not to do with express
    process.on('uncaughtException', (ex) => {
        winston.error(ex.message, ex);
        process.exit(1);
    });
}
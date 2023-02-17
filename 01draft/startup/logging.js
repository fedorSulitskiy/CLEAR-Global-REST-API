/// General error logging
const winston = require('winston');

module.exports = function() {
    // Logs error not to do with express (Example: when error occurs during startup)
    process.on('uncaughtException', (ex) => {
        console.log('WE GOT UNCAUGHT EXCEPTION');
        winston.add(new winston.transports.File({ filename: 'logfile.log' }));
        winston.error(ex.message, ex);
        process.exit(1);
    });
    
    process.on('unhandledRejection', (ex) => {
        // handles failed async promise calls
        console.log('WE GOT AN UNHANDLED REJECTION');
        winston.add(new winston.transports.File({ filename: 'logfile.log' }));
        winston.error(ex.message, ex);
        process.exit(1);
    });
}
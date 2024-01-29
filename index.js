/// Main file
//  to launch type "npm start" -> it's same as typing "nodemon index.js", and I thought it would be simpler

require('dotenv').config();
const express = require('express');
const app = express();
const winston = require('winston');

require('./startup/logging')();
require('./startup/routes')(app);

// throw new Error('Something failed during startup'); // to test uncaught exception
// const p = Promise.reject(new Error('Something failed miserably')); // rejected promise, like async operation dying
// p.then(() => console.log('Done')); // unhandled rejection

const server = app.listen(process.env.APP_PORT, () => {
    // logs the start of the server in logfile.log
    winston.add(new winston.transports.File({ filename: 'logfile.log' }));
    winston.info(`Server up and running on port ${process.env.APP_PORT}`);
})

module.exports = server;
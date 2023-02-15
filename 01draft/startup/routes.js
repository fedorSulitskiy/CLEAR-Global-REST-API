const express = require('express');

const langRouter = require('../api/languages/III.lang.router');

const error = require('../middleware/error');

module.exports = function(app) {
    app.use(express.json());
    app.use("/api/languages", langRouter);
    app.use(error);
}
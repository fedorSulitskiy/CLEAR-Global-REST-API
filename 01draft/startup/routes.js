/// Stores all routers from APIs
const express = require('express');

const langRouter = require('../api/languages/III.lang.router');
const userRouter = require('../api/users/III.user.router');
const appRouter = require('../api/app/III.app.router');

module.exports = function(app) {
    app.use(express.json());
    app.use("/api/languages", langRouter);
    app.use("/api/users", userRouter);
    app.use("/api/app", appRouter);
}
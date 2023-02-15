/// Connects the SQL query executor functions with html requests
const { createLang } = require('./II.lang.controller');

const router = require('express').Router();

router.post("/", createLang);

module.exports = router;
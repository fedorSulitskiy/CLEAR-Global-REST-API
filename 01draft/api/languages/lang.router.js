const { createLang } = require('./lang.controller');

const router = require('express').Router();

router.post("/", createLang);

module.exports = router;
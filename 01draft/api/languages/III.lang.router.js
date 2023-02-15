/// Connects the SQL query executor functions with html requests
const { createLang, update, showAll, showByID, deleteLang } = require('./II.lang.controller');

const router = require('express').Router();

router.post("/", createLang);
router.delete("/:id", deleteLang);

module.exports = router;